const { upload } = require("../middlewares/upload");

function handleGetSingleUpload(req, res) {
  res.render("uploads/single-upload", {
    message:
      "Only One Photo Upload Allowed Go To Upload Multiple if you want to upload many photos at one time ",
  });
}

function handleGetMultipleUpload(req, res) {
  res.render("uploads/multiple-upload", { message: null });
}

function handlePostSingleUpload(req, res) {
  console.log(req.body);
    console.log(req.file);
  return res.json({ message: "Single File Uploaded", file: req.file });
}

function handlePostMultipleUpload(req, res) {
  console.log(req.files);
  return res.json({ message: "Multiple File  Uploaded", file: req.files });
}

module.exports = {
  handleGetSingleUpload,
  handleGetMultipleUpload,
  handlePostSingleUpload,
  handlePostMultipleUpload,
};
