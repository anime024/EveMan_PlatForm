const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB Connected");
    }catch(error){
        console.log(`error occured while connecting MongoDB . ERROR:${error}`);
    }
}

module.exports={connectDB};