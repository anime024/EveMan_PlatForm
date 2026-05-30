const { upload } = require("../middlewares/upload");
const {Event}=require("../models/event")
const {Media}=require("../models/media")

const {User}=require("../models/user")

async function handleGetSingleUpload(req, res) {

  const event=await Event.findById(req.params.id);
  res.render("uploads/single-upload", {
    message:
      "Only One Photo Upload Allowed Go To Upload Multiple if you want to upload many photos at one time ",
      event:event
  });
}

async function handleGetMultipleUpload(req, res) {

    const event=await Event.findById(req.params.id);

  res.render("uploads/multiple-upload", { message: null,event });
}

async function handlePostSingleUpload(req,res) {
  try{
     console.log(req.file);
    const mediaLocation=req.file.location;

    const {tags}=req.body;
    const user=await User.findOne({email:req.user?.email});
    if(!user)
    {
      console.log(`SOME ERROR IN USER handlePostSingleUpload`)
      return res.json({message:"No user. Login First"})
    }

    const newMedia=await Media.create({event:req.params.id,uploadedBy:user._id,url:mediaLocation,tags:tags? tags.split(','):[]})
    await Event.findByIdAndUpdate(req.params.id,{$push:{media:newMedia._id}})
  return res.json({ message: "Single File Uploaded", file: req.file });
  }catch(error){
    console.log("ERROR PCCURED IN  handlePostSingleUpload ",error);
    return res.json({message:"SOME INTERNAL ERROR "});
  }
   
}

async function handlePostMultipleUpload(req, res) {
  try{
    console.log(req.files);

  const user=await User.findOne({email:req.user.email});
  
  if (!user) {
      console.log(`SOME ERROR IN USER handlePostMultipleUpload`);
      return res.status(401).json({ message: "No user. Login First" });
    }

    const {tags}=req.body;
    const  parsedTags=tags?tags.split(","):[];

    const mediaCreationPromises=req.files.map((file)=>{
      const mediaLocation=file.location;
      return Media.create({
        event:req.params.id,
        uploadedBy:user._id,
        url:mediaLocation,
        tags:parsedTags
      })
    })

    const savedMediaItems=await Promise.all(mediaCreationPromises);

    const mediaIds=savedMediaItems.map(item=> item._id);

    await Event.findByIdAndUpdate(req.params.id,{$push:{media:{$each:mediaIds}}})

    return res.status(201).json({ 
      message: "Multiple Files Uploaded and Linked Successfully", 
      media: savedMediaItems 
    });

  }catch(error){
    console.log("ERROR OCCURRED IN handlePostMultipleUpload ", error);
    return res.status(500).json({ message: "SOME INTERNAL ERROR" });
  }
}

module.exports = {
  handleGetSingleUpload,
  handleGetMultipleUpload,
  handlePostSingleUpload,
  handlePostMultipleUpload,
};
