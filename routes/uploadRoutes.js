const express=require("express")
const {auth}=require("../middlewares/auth")
const {upload}=require("../middlewares/upload")

const {
  handleGetSingleUpload,
  handleGetMultipleUpload,
  handlePostSingleUpload,
  handlePostMultipleUpload,
}=require("../controllers/uploadController")
const uploadRouter=express.Router();


uploadRouter.get('/single/:id',auth,handleGetSingleUpload);
uploadRouter.post('/single/:id',upload.single("media"),auth,handlePostSingleUpload);
uploadRouter.get('/multiple/:id',auth,handleGetMultipleUpload);
uploadRouter.post('/multiple/:id',upload.array("medias",12),auth,handlePostMultipleUpload);

module.exports={uploadRouter};

