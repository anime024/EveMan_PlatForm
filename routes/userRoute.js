const express=require("express")
const {handleUserDashboard,handleUserLogout,handlePhotoGrapher,handleGetFavourites}=require("../controllers/userController")
const {auth}=require("../middlewares/auth")
const{checkRole}=require("../middlewares/checkRole")
const userRouter=express.Router();

userRouter.get("/dashboard",auth,handleUserDashboard)
userRouter.get("/logout",auth,handleUserLogout)
userRouter.get("/photographer",auth,checkRole("photographer"),handlePhotoGrapher)
userRouter.get("/favourites",auth,checkRole("photographer"),handleGetFavourites)

module.exports={userRouter}