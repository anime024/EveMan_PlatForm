const mongoose=require("mongoose")

const {User}=require("./user")

const EventSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        default:"General",
    },
    date:{
        type:Date,
        required:true,
    },
    location:{
        type:String,
        default:"",
    },
    media:{
        type:[String],
        default:[]
    },
    coverImage:{
        type:String,
        default:""
    },
    visibility:{
        type:String,
        enum:["public","private"],
        default:"public"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }

},{timestamps:true})

const Event=mongoose.model("Event",EventSchema);

module.exports={Event};