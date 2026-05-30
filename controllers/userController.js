const { Media } = require("../models/media");
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

async function handleGetFavourites(req,res){
    const media=await Media.find({favourites:req.user._id});
    console.log(`Favourites Media : ${media}`);
    return res.render("favourites",{media});

}

module.exports={handleUserDashboard,handleUserLogout,handlePhotoGrapher,handleGetFavourites}