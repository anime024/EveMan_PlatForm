const {User}=require("../models/user")


function handleUserDashboard(req,res){
    const user=req.user;
    console.log(req.body);
    return res.render("dashboard",{message:null,user:user});
}

function handleUserLogout(req,res){
    res.clearCookie('token');
    return res.redirect('/?msg=Logged out successfully');
}

function handlePhotoGrapher(req,res){
    const message=req.query.msg||null;
    return res.render("photographer",{message});
}

module.exports={handleUserDashboard,handleUserLogout,handlePhotoGrapher}