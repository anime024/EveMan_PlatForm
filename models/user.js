const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profilePhoto:{
        type:String,
    }
    ,
    profilePhotoKey:{
    type:String
    },
    faceId:{
        type:String,
    }
    ,
    role: {
      type: String,
      enum: ["admin", "photographer","member","user"],
      default: "user",
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String
    }
},{timestamps:true})
const User=mongoose.model("User",UserSchema)

module.exports={User}