const { Attribute, IndexFacesCommand,SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");
const { Media } = require("../models/media");
const {User}=require("../models/user")
const {rekognitionClient}=require('../services/rekognition')
const {setUser}=require("../utils/generateToken")


function handleUserDashboard(req,res){
    const user=req.user;
    console.log('USER IS ',user);
    return res.render("dashboard",{message:null,user:user});
}

function handleUserLogout(req,res){
    res.clearCookie('token');
    return res.redirect('/?msg=Logged out successfully');
}



async function handleGetFavourites(req,res){
    const media=await Media.find({favourites:req.user._id});
    console.log(`Favourites Media : ${media}`);
    return res.render("favourites",{media});

}

async function handleGetSelfie(req,res){
    return res.render('selfie',{message:null});
}

async function handlePostSelfie(req,res){
    try {
        console.log(req.file);
        console.log("Req File key ",req.file.key);

        const imageUrl=req.file.location;

        const user=await User.findById(req.params.id);

        if(!user){
            return res.json({message:"No User Found"});
        }

        const params={
            CollectionId: "cig-face-collection",
            Image:{
                S3Object:{
                    Bucket:process.env.AWS_BUCKET_NAME,
                    Name:req.file.key
                },
                
            },
            ExternalImageId: user._id.toString(),
            MaxFaces: 1,
            "Attributes":["All"]
        }

        const response=await rekognitionClient.send(new IndexFacesCommand(params));


        if(!response.FaceRecords || response.FaceRecords.length===0){
            return res.status(400).json({message:"No Face Detected"});
        }

        const faceId=response.FaceRecords[0].Face.FaceId;

        user.profilePhoto=imageUrl;
        user.faceId=faceId;
        user.profilePhotoKey = req.file.key;
        
        await user.save();
        console.log("User after selfie ", user);

        const token=setUser(user);
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
        })

          return res.json({ message: "Profile photo Uploaded", file: req.file });



    } catch (error) {
        console.log(error);

    return res.status(500).send(
      "Error while registering face"
    );
  }
    
}

async function handleGetMyPhotos(req,res){
     try {
        const user=await User.findById(req.params.id);
    if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
    }   
    console.log("Uswer is ",user)

    if(!user.profilePhotoKey){
        return res.render("dashboard",{message:"Upload your selfie first"})
    }
    
    const response = await rekognitionClient.send(
    new SearchFacesByImageCommand({
        CollectionId: "cig-face-collection",

        Image: {
            S3Object: {
                Bucket: process.env.AWS_BUCKET_NAME,
                Name: user.profilePhotoKey
            }
        },

        FaceMatchThreshold: 70,
        MaxFaces: 100
    })
    );

    const matchedFaceIds =
    response.FaceMatches?.map(
        match => match.Face.FaceId
    ) || [];

    console.log(
   response.FaceMatches?.map(
      match => ({
         faceId: match.Face.FaceId,
         similarity: match.Similarity
      })
   )
);

    const photos = await Media.find({
    faceIds: {
        $in: matchedFaceIds
    }
    })
    .populate("event")
    .populate("uploadedBy");

    console.log(
    photos.map(photo => ({
        id: photo._id,
        event: photo.event
    }))
);

const validPhotos = photos.filter(
    photo => photo.event
);

    return res.render("myPhotos", {
            photos:validPhotos
        });
     } catch (error) {
        console.log(error);
   return res.status(500).json({
      message:"Internal Server Error"
   });
     }

}

module.exports={handleUserDashboard,handleUserLogout,handleGetFavourites,handleGetSelfie,handlePostSelfie,handleGetMyPhotos}