require('dotenv').config();

const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser")
const http=require('http')

const {connectDB}=require("./config/db")
const {setupSocket}=require("./sockets/socketHandler")
const jwt=require('jsonwebtoken')

const app=express();
const {Server}=require('socket.io');
const server=http.createServer(app);
const io=new Server(server);

setupSocket(io);
app.set("io",io);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
connectDB();
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.json());

const setUserContext = require('./middlewares/localUser');
const {notificationCount}=require("./middlewares/notificationCount")
app.use(setUserContext);
app.use(notificationCount);

const {authRouter}=require("./routes/authRoute")
const {userRouter}=require("./routes/userRoute")
const {eventRouter}=require("./routes/eventRoute")
const {uploadRouter}=require("./routes/uploadRoutes")
const {mediaRouter}=require('./routes/mediaRoutes')
const {notificationRouter}=require("./routes/notificationRoute")
const {adminRouter}=require('./routes/adminRoute')

// app.get("/test",(req,res)=>{

//     const io = req.app.get("io");

//     console.log("TEST ROUTE HIT");

//     io.emit("notification",{
//         message:"GLOBAL TEST"
//     });

//     res.send("sent");

// });


app.use("/user",userRouter);
app.use('/event',eventRouter)
app.use('/upload',uploadRouter);
app.use('/media',mediaRouter)
app.use('/notification',notificationRouter)
app.use('/admin',adminRouter);
app.use("/",authRouter)

app.get("/",(req,res)=>{
    res.render("homepage",{message:null});
})


const PORT = process.env.PORT || 3000;


server.listen(PORT,()=>{
    console.log(`Server statrted succesfuly at ${PORT}`);
})