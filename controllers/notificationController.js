const {Notification}=require("../models/notification")

async function handleGetNotifications(req, res) {
  const notifications = await Notification.find({
    recipient: req.user._id,
    isRead:false,
  })
    .populate("sender")
    .sort({ createdAt: -1 });

  await Notification.updateMany(
{
    recipient:req.user._id,
    isRead:false,
},
{
    isRead:true,
});

  res.render("notification/index", {
    notifications,
  });
}

module.exports={handleGetNotifications}
