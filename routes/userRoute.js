const express = require("express");
const {
  handleUserDashboard,
  handleUserLogout,
  handlePhotoGrapher,
  handleGetFavourites,
  handleGetSelfie,
  handlePostSelfie,
  handleGetMyPhotos
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const userRouter = express.Router();
const { upload } = require("../middlewares/upload");

userRouter.get("/dashboard", auth, handleUserDashboard);
userRouter.get("/logout", auth, handleUserLogout);
userRouter.get(
  "/photographer",
  auth,
  checkRole("photographer"),
  handlePhotoGrapher,
);
userRouter.get("/favourites", auth, handleGetFavourites);
userRouter.get("/selfie/:id", auth,handleGetSelfie);
userRouter.post("/selfie/:id",auth,upload.single("media"),handlePostSelfie);
userRouter.get('/myphotos/:id',auth,handleGetMyPhotos)


module.exports = { userRouter };
