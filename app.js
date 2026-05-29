require('dotenv').config();

const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser")

const {connectDB}=require("./config/db")
const {authRouter}=require("./routes/authRoute")
const {userRouter}=require("./routes/userRoute")
const {eventRouter}=require("./routes/eventRoute")
const {uploadRouter}=require("./routes/uploadRoutes")

const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
connectDB();
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use("/",authRouter)
app.use("/user",userRouter);
app.use('/event',eventRouter)
app.use('/upload',uploadRouter);
app.use("/",(req,res)=>{
    res.render("homepage",{message:null});
})


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Server statrted succesfuly at ${process.env.PORT}`);
})