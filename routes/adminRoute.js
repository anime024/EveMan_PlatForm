const express=require("express")

const {handleAdminDashboard,handleAdminUser,handleGetEditRole,handlePostEditRole,handlePostDeleteUser,handleGetAllEvents,handleGetAllMedia}=require('../controllers/adminController')
const { auth } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const {restrictTo}=require("../middlewares/roleMiddleware")

const adminRouter=express.Router();

adminRouter.get('/dashboard',auth,restrictTo(["admin"]),handleAdminDashboard);
adminRouter.get('/users',auth,restrictTo(['admin']),handleAdminUser)
adminRouter.get('/users/:id/editRole',auth,restrictTo(['admin']),handleGetEditRole)
adminRouter.post('/users/:id/editRole',auth,restrictTo(['admin']),handlePostEditRole)
adminRouter.post('/users/:id/delete',auth,restrictTo(['admin']),handlePostDeleteUser)
adminRouter.get('/events',auth,restrictTo(['admin']),handleGetAllEvents);
adminRouter.get('/allMedia',auth,restrictTo(['admin']),handleGetAllMedia);
// adminRouter.post('/',handlePostMediaDelete)




module.exports={adminRouter}