const express=require("express")
const {auth}=require("../middlewares/auth")

const {handleGetSingleMedia,handlePostLike,handlePostFavourite,handlePostComment,handleSearchMedia,handleDownloadMedia,handlePostMediaDelete}=require("../controllers/mediaController");
const { restrictTo } = require("../middlewares/roleMiddleware");

const mediaRouter=express.Router();

mediaRouter.get('/search',auth,handleSearchMedia)
mediaRouter.get('/:id',auth,handleGetSingleMedia)
mediaRouter.post('/:id/like',auth,handlePostLike)
mediaRouter.post('/:id/favourite',auth,handlePostFavourite)
mediaRouter.post('/:id/comment',auth,handlePostComment)
mediaRouter.get('/download/:id',auth,handleDownloadMedia)
mediaRouter.post('/delete/:id',auth,restrictTo(["admin","photographer"]),handlePostMediaDelete)
module.exports={mediaRouter}

