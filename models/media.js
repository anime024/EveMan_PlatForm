const mongoose=require("mongoose");
const {Event}=require('./event')
const {User}=require('./user')

const mediaSchema=new mongoose.Schema({
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    url:{
        type:String,
    },
    tags:{
        type:[String],
    },
    likes:{
        type:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}]
    },
    favourites:{
        type:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}]
    },
    comments:{
        type:[{user:{type:mongoose.Schema.Types.ObjectId,
        ref:"User"},
        text:String,
        taggedUsers:{
        type:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"}]
    },
        createdAt:{
            type:Date,
            default:Date.now,
        }}]
    }
},{timestamps:true})

const Media=mongoose.model('Media',mediaSchema);

module.exports={Media}