const express=require("express")
const {handleUserDashboard,handleUserLogout,handlePhotoGrapher}=require("../controllers/userController")
const {auth}=require("../middlewares/auth")
const{checkRole}=require("../middlewares/checkRole")
const userRouter=express.Router();

userRouter.get("/dashboard",auth,handleUserDashboard)
userRouter.get("/logout",auth,handleUserLogout)
userRouter.get("/photographer",auth,checkRole("photographer"),handlePhotoGrapher)

module.exports={userRouter}