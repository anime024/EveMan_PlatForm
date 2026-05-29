const multer=require("multer")
const path=require("path")

const multerS3=require("multer-s3")
const {client}=require("../config/s3")

// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"uploads/");
//     },
//     filename:function(req,file,cb){
//         const uniqueName= Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, uniqueName + path.extname(file.originalname));
// },
// });

const storage=multerS3({
  s3:client,
  bucket:'cig-media-platform-animesh',
  metadata:function(req,file,cb){
    cb(null,{fieldName:file.fieldname});
  },
  key:function(req,file,cb){
    cb(null,Date.now()+" - " + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload=multer({
    storage,
    fileFilter,
});

module.exports={upload}