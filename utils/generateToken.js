const jwt=require("jsonwebtoken")

function setUser(user){
    return jwt.sign({
    _id:user._id,
    role:user.role,
    email:user.email
    },process.env.JWT_SECRET)
}

module.exports={setUser}