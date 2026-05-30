const {Media}=require("../models/media");
const { User } = require("../models/user");
const {Event}=require("../models/event")


async function handleGetSingleMedia(req,res){
    const media=await Media.findById(req.params.id).populate('uploadedBy').populate("event").populate("tags").populate("comments.user");

    if(!media){
        return res.redirect('/event/?msg=No Such Media Found ');
    }

    res.render("media/show",{media});
}

async function handlePostLike(req,res){
    const media=await Media.findById(req.params.id);
    const userId=req.user._id;

    console.log(`Media is ${media}. UserId is ${userId}`);
    if(media.likes.includes(userId)){
        media.likes.pull(userId);
    }else{
        media.likes.push(userId);
    }

    await media.save();

    return res.redirect(`/media/${media._id}`);
}
async function handlePostFavourite(req,res){
    try{
        const media=await Media.findById(req.params.id);
    const userId=req.user._id;

    console.log(`Media is ${media}. UserId is ${userId}`);
    if(media.favourites.includes(userId)){
        media.favourites.pull(userId);
    }else{
        media.favourites.push(userId);
    }

    await media.save();

    return res.redirect(`/media/${media._id}`);
    }catch(error){
        console.log("ERROR IN handlePostFavourite ",error)
        return res.redirect('/events');
    }
}
async function handlePostComment(req,res){
    try{
        const media=await Media.findById(req.params.id);
    const userId=req.user._id;

    if(!media){
        console.log("NO MEDIA  handlePostComment")
        return res.redirect('/events');
    }

    media.comments.push({
        user:userId,
        text:req.body.text
    });
    await media.save();

    return res.redirect(`/media/${media._id}`);
    }catch(error){
        console.log("SOME ERROR IN handlePostComment ",error);
        return res.redirect('/events');
    }
}

async function handleSearchMedia(req,res) {
    const query=req.query.q;
    const events=await Event.find({
        title:{
            $regex:query,
            $options:"i",
        }
    })
    
    const users=await User.find({
        name:{
            $regex:query,
            $options:"i"
        }
    })

    const media=await Media.find({
        $or:[
            {
            tags:{
                $in:[query]
            }
        },
            {
                event:{
                $in:events.map(e=>e._id)
            }
        },
            {
                uploadedBy:{
                    $in:users.map(u=>u._id)
                }
            }
        ]
    })
    .populate("event")
    .populate("uploadedBy");

    console.log(`medias are ${media}`);
    return res.render('media/searchResults',{media,query});
    
}

module.exports={handleGetSingleMedia,handlePostLike,handlePostFavourite,handlePostFavourite,handlePostComment,handleSearchMedia}