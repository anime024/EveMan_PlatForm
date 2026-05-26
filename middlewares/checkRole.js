function checkRole(role){
    return (req,res,next)=>{
        if(!req.user){
            console.log("login first from checkrolev")
            return res.redirect('/?msg=Login In First');
        }

        const userRole=req.user.role;

        if(userRole===role){
            console.log("Authorized for this route ")
            return next();
        }
        console.log("NOT AUTHORZED");
         return res.redirect('/?msg=You are not authorized');
    }
}

module.exports={checkRole};