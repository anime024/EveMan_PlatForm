const jwt=require("jsonwebtoken")



function setUserContext(req, res, next) {
        const token=req.cookies.token;
        res.locals.user = null;


    try{
        if (!token) {
        return next();
    }
        
            var decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;
    res.locals.user = req.user || null; 
        }catch(error){
            console.log("Some error in localUser midlleware , ",error)
        }

    
    
    next();
}

module.exports = setUserContext;