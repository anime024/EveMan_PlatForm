const express=require("express");
const {handleGetNotifications}=require("../controllers/notificationController")
const {auth}=require("../middlewares/auth")

const notificationRouter=express.Router();

notificationRouter.get('/',auth,handleGetNotifications)

module.exports={notificationRouter}