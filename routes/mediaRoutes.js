const express=require("express")
const {auth}=require("../middlewares/auth")

const {handleGetSingleMedia,handlePostLike,handlePostFavourite,handlePostComment,handleSearchMedia,handleDownloadMedia}=require("../controllers/mediaController")

const mediaRouter=express.Router();

mediaRouter.get('/search',auth,handleSearchMedia)
mediaRouter.get('/:id',auth,handleGetSingleMedia)
mediaRouter.post('/:id/like',auth,handlePostLike)
mediaRouter.post('/:id/favourite',auth,handlePostFavourite)
mediaRouter.post('/:id/comment',auth,handlePostComment)
mediaRouter.get('/download/:id',auth,handleDownloadMedia)
module.exports={mediaRouter}

