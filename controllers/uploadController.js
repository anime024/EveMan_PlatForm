const { upload } = require("../middlewares/upload");
const {Event}=require("../models/event")


async function handleGetSingleUpload(req, res) {

  const event=await Event.findById(req.params.id);
  res.render("uploads/single-upload", {
    message:
      "Only One Photo Upload Allowed Go To Upload Multiple if you want to upload many photos at one time ",
      event:event
  });
}

async function handleGetMultipleUpload(req, res) {

    const event=await Event.findById(req.params.id);

  res.render("uploads/multiple-upload", { message: null,event });
}

async function handlePostSingleUpload(req,res) {
  console.log(req.body);
    console.log(req.file);
    const media=req.file.location;
    await Event.findByIdAndUpdate(req.params.id,{$push:{media}})
  return res.json({ message: "Single File Uploaded", file: req.file });
}

async function handlePostMultipleUpload(req, res) {
  console.log(req.files);

  let mediaUrls=[];
  for(let i=0;i<req.files.length;i++)
  {
    mediaUrls.push(req.files[i].location);
  }

    await Event.findByIdAndUpdate(req.params.id,{$push:{media:{$each:mediaUrls}}})
  return res.json({ message: "Multiple File  Uploaded", file: req.files });
}

module.exports = {
  handleGetSingleUpload,
  handleGetMultipleUpload,
  handlePostSingleUpload,
  handlePostMultipleUpload,
};
