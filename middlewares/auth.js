const jwt=require("jsonwebtoken")

function auth(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.render("login",{message:"login first"});
    }

    try{
        var decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err)
    {
        return res.render("login",{message:"invalid token"})
    }
}

module.exports={auth};