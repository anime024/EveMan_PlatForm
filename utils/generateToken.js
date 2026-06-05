const jwt=require("jsonwebtoken")

function setUser(user){
    return jwt.sign({
    _id:user._id,
    role:user.role,
    email:user.email,
    name:user.name,
    profilePhoto:user.profilePhoto
    },process.env.JWT_SECRET)
}

module.exports={setUser}