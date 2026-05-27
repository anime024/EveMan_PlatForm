const express=require("express")
const {handleGetAllEvents,handleGetCreateEventPage,handlePostCreateEvent,handleGetSingleEvent,handleGetEditEventPage,handlePostEditEvent,handlePostDeleteEvent}=require("../controllers/eventController")
const {auth}=require("../middlewares/auth")
const {validate}=require("../middlewares/validateEventOwnership")
const {restrictTo}=require("../middlewares/roleMiddleware")
const eventRouter=express.Router();

eventRouter.get('/',auth,handleGetAllEvents)
eventRouter.get('/create',auth,restrictTo(["admin","photographer"]),handleGetCreateEventPage)
eventRouter.post('/create',auth,restrictTo(["admin","photographer"]),handlePostCreateEvent)
eventRouter.get('/edit/:id',auth,restrictTo(["admin","photographer"]),handleGetEditEventPage)
eventRouter.post('/edit/:id',auth,restrictTo(["admin","photographer"]),validate,handlePostEditEvent)
eventRouter.post('/delete/:id',auth,restrictTo(["admin","photographer"]),validate,handlePostDeleteEvent)
eventRouter.get('/:id',auth,handleGetSingleEvent)



module.exports={eventRouter};