function restrictTo(roles=[]){
    return function(req,res,next){
        if(!req.user)
        {
            return res.redirect('/login');
        }

        if(!roles.includes(req.user.role))
        {
            return res.render('error',{message:"You Are Not Authorised"});

        }
        next();
    }
}

module.exports={restrictTo}