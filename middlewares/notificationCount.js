const { Notification } = require("../models/notification");

async function notificationCount(req,res,next){

    try{

        if(req.user){

            const count =
            await Notification.countDocuments({
                recipient:req.user._id,
                isRead:false,
            });

            res.locals.unreadCount = count;

        }else{

            res.locals.unreadCount = 0;

        }

        next();

    }catch(err){

        console.log(err);
        next();

    }

}

module.exports = {
    notificationCount,
};