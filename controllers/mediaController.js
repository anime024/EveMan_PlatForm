const { Media } = require("../models/media");
const { User } = require("../models/user");
const { Event } = require("../models/event");
const { Notification } = require("../models/notification");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { client } = require("../config/s3");
const sharp=require("sharp")
// const ffmpeg=require('fluent-ffmpeg')
const {streamToBuffer}=require('../utils/streamToBuffer')

const fs=require("fs");
const path=require('path');


async function handleGetSingleMedia(req, res) {
  const media = await Media.findById(req.params.id)
    .populate("uploadedBy")
    .populate("event")
    .populate("tags")
    .populate("comments.user");

  if (!media) {
    return res.redirect("/event/?msg=No Such Media Found ");
  }

  res.render("media/show", { media, user: req.user });
}

async function handlePostLike(req, res) {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const userId = req.user._id;
    const mediaOwnerId = media.uploadedBy.toString();

    if (mediaOwnerId.toString() === userId.toString()) {
        console.log("USER TRIED TO LIKE ITS OWN MEDIA")
    return res.status(403).json({
        success: false,
        message: "You cannot like your own media"
    });
}


    const alreadyLiked = media.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      media.likes.pull(userId);
    } else {
      media.likes.push(userId);

      if (mediaOwnerId !== userId.toString()) {
        const message = `${req.user.name} liked your photo`;

        await Notification.create({
          recipient: mediaOwnerId,
          sender: userId,
          type: "like",
          message,
          media: media._id,
        });

        
        const io = req.app.get("io");

        io.to(mediaOwnerId).emit("notification", {
          message,
        });

        console.log(`Notification sent to room ${mediaOwnerId}`);
      }
    }

    await media.save();

    return res.status(200).json({
      success: true,
      likesCount: media.likes.length,
    });
  } catch (err) {
    console.log("Like Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function handlePostFavourite(req, res) {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
    return res.status(404).json({
        success: false,
        message: "Media not found"
    });
}

    const userId = req.user._id;

    if (media.uploadedBy.toString() === userId.toString()) {
    return res.status(403).json({
        success: false,
        message: "You cannot favourite your own media"
    });
}

    if (media.favourites.includes(userId)) {
      media.favourites.pull(userId);
    } else {
      media.favourites.push(userId);
      const io=req.app.get("io");
      io.to(media.uploadedBy.toString()).emit("notification",{
        message:`${req.user.name} favourited your media`
      })

      await Notification.create({
          recipient: media.uploadedBy,
          sender: userId,
          type: "favourite",
          message:`${req.user.name} favourited your media`,
          media: media._id,
        });
    }

    await media.save();

return res.json({
    success: true,
    favouritesCount: media.favourites.length
});
  } catch (error) {
    console.log("ERROR IN handlePostFavourite ", error);
    return res.redirect("/events");
  }
}
async function handlePostComment(req, res) {
  try {

    console.log(req.body);
    
    const media = await Media.findById(req.params.id);
    const userId = req.user._id;

    if (!media) {
      console.log("NO MEDIA  handlePostComment");
      return res.redirect("/events");
    }

    const tagUserInComment=[...new Set([...req.body.text.matchAll(/@([^\s+]+)/g)].map(match=>match[1]))];
    console.log(`Tagged users are : ${tagUserInComment}`);

    const taggedUsers=await User.find({
      email:{$in:tagUserInComment}
    })

        console.log(`Tagged users from database : ${taggedUsers}`);


    media.comments.push({
      user: userId,
      text: req.body.text,
      taggedUsers:taggedUsers.map(user=>user._id)
    });
    await media.save();
    await media.populate("comments.user");

    const io=req.app.get("io");
    io.to(media.uploadedBy.toString()).emit('notification',{
        message:`${req.user.name} commented ${req.body.text} to your media `
    })

    taggedUsers.forEach(user=>{
      if(
        user._id.toString() ===
        req.user._id.toString()
    ) return;
      io.to(user._id.toString()).emit("notification",{message:`${req.user.name} tagged you in a photo`})
    })

    await Promise.all(taggedUsers.map(user=>
       Notification.create({
        recipient:user._id,
          sender: userId,
          type: "tag",
          message:`${req.user.name}: "${req.body.text}"`,
          media: media._id,
    })
    ))


    await Notification.create({
        recipient: media.uploadedBy,
          sender: userId,
          type: "comment",
          message:`${req.user.name}: "${req.body.text}"`,
          media: media._id,
    })

    return res.json({
        success: true,
        commentsCount: media.comments.length,
        commentText: req.body.text,
        userName: req.user.name
    });

} catch (error) {
    console.log("SOME ERROR IN handlePostComment");
    console.log(error);

    return res.status(500).json({
        success:false,
        error:error.message
    });
}
}

async function handleSearchMedia(req, res) {
  const query = req.query.q;
  const events = await Event.find({
    title: {
      $regex: query,
      $options: "i",
    },
  });

  const users = await User.find({
    name: {
      $regex: query,
      $options: "i",
    },
  });

  const media = await Media.find({
    $or: [
      {
        tags: {
          $regex: query,
          $options:'i',
        },
      },
      {
        event: {
          $in: events.map((e) => e._id),
        },
      },
      {
        uploadedBy: {
          $in: users.map((u) => u._id),
          
        },
      },
    ],
  })
    .populate("event")
    .populate("uploadedBy");

  console.log(`medias are ${media}`);
  return res.render("media/searchResults", { media, query });
}

async function handleDownloadMedia(req,res){
  const media=await Media.findById(req.params.id).populate("event" , "title");

  if(!media){
    return res.send("Media Not Found");
  }
  
  const ext=media.url.split('.').pop().toLowerCase();
  const isVideo=["mp4","mov","avi","webm"].includes(ext);

  const key = decodeURIComponent(media.url.split('/').pop());
  const command=new GetObjectCommand({
    Bucket:process.env.AWS_BUCKET_NAME,
    Key:key,
  })

  const response=await client.send(command);
  const watermarkText = ` CIG CLUB : ${media.event.title} :${req.user.email}`;

  //for images only 
  if(!isVideo){{

  const imageBuffer=await streamToBuffer(response.Body);
  const image = sharp(imageBuffer);
const metadata = await image.metadata();

const width = metadata.width;
const height = metadata.height;

const svgWatermark = `
<svg width="${width}" height="${height}">
    <style>
        .title {
            fill: black;            
            fill-opacity: 0.4;     
            font-size: 24px;        
            font-family: Arial, sans-serif;
            font-weight: bolder;
        }
    </style>

    <text
        x="95%"                     
        y="10%"                      
        text-anchor="end"           
        class="title"
    >
        ${watermarkText}
    </text>
</svg>
`;

 const watermarkedImage = await sharp(imageBuffer)
    .composite([
        {
            input: Buffer.from(svgWatermark),
            gravity: "center",
        },
    ])
    .jpeg()
    .toBuffer();

    res.setHeader(
    "Content-Disposition",
    "attachment; filename=watermarked.jpg"
);

res.setHeader(
    "Content-Type",
    "image/jpeg"
);

res.send(watermarkedImage);
}}
//for videos
// else
// {
//   const videoBuffer=await streamToBuffer(response.Body);
//   const inputPath=path.join(__dirname,"../temp/input.mp4");
//   const outputPath = path.join(__dirname,"../temp/output.mp4");
//   fs.writeFileSync(inputPath,videoBuffer);

//   await new Promise((resolve, reject) => {

//     ffmpeg(inputPath)
//         .videoFilters(
//             `drawtext=
//             text='${watermarkText}':
//             x=w-tw-20:
//             y=20:
//             fontsize=24:
//             fontcolor=black`
//         )
//         .save(outputPath)
//         .on("end", resolve)
//         .on("error", reject);

// });
// return res.download(outputPath, () => {
//     fs.unlink(inputPath, () => {});
//     fs.unlink(outputPath, () => {});
// });
// }

}

module.exports = {
  handleGetSingleMedia,
  handlePostLike,
  handlePostFavourite,
  handlePostFavourite,
  handlePostComment,
  handleSearchMedia,
  handleDownloadMedia
};
