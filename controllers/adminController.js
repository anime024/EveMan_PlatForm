const { User } = require("../models/user");
const { Event } = require("../models/event");
const { Media } = require("../models/media");
const {deleteFilesFromS3}=require("../utils/deleteS3Files");
async function handleAdminDashboard(req, res) {
  let message = req.query.msg || null;

  const totalUsers = await User.countDocuments();
  const totalEvents = await Event.countDocuments();
  const totalMedias = await Media.countDocuments();

  return res.render("admin/adminDashboard", {
    message,
    totalUsers,
    totalEvents,
    totalMedias,
  });
}

async function handleAdminUser(req, res) {
  let message = req.query.msg || null;
  const users = await User.find();

  if (!users) {
    return res.redirect("/admin/dashboard?msg=No User Found ");
  }

  return res.render("admin/adminUsers", { users, message });
}

async function handleGetEditRole(req, res) {
  const message = req.query.msg || null;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.redirect("/admin/users?msg=No User found ");
  }

  return res.render("admin/editRole", { user, message });
}

async function handlePostEditRole(req, res) {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.redirect("/admin/users?msg=No User Found in database");
  }

  user.role = role;
  await user.save();
  return res.redirect("/admin/users/?msg=User Role Updated ");
}


async function handlePostDeleteUser(req,res){
   

    const medias=await Media.find({uploadedBy:req.params.id});
    if(medias.length>0){
        let keys=medias.map(media=>media.key);
        console.log(keys);
        await deleteFilesFromS3(keys);
        console.log("All Medias Deleted from S3");
    }
    await Event.deleteMany({createdBy:req.params.id});
    await Media.deleteMany({uploadedBy:req.params.id});
    await User.findByIdAndDelete(req.params.id);
    return res.redirect('/admin/users?msg=Users deleted ');

}


async function handleGetAllEvents(req,res){
    const events = await Event.find()
        .populate("createdBy");

    res.render("admin/adminEvents",{
        events
    });
}

async function handleGetAllMedia(req,res){

    const medias = await Media.find()
        .populate("uploadedBy")
        .populate('event')
        .sort({createdAt:-1});

    res.render("admin/allMedia",{
        medias
    });
}

module.exports = { handleAdminDashboard, handleAdminUser, handleGetEditRole ,handlePostEditRole,handlePostDeleteUser,handleGetAllEvents,handleGetAllMedia};
