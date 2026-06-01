const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    type:{
        type:String,
        required:true,
    },

    message:{
        type:String,
        required:true,
    },

    isRead:{
        type:Boolean,
        default:false,
    },

    media:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Media",
    }
},
{
    timestamps:true,
});

const Notification =
mongoose.model(
    "Notification",
    notificationSchema
);

module.exports={
    Notification,
};