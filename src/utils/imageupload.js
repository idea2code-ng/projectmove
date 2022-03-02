const path = require("path");
const multer = require("multer");


const imageStorage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    req.filename =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
});

const upload = imageUpload.fields([
  { name: "vehicle_image", maxCount: 1 },
  { name: "licence_image", maxCount: 1 },
  { name: "insurance_image", maxCount: 1 },
  { name: "profile_image", maxCount: 1 },
]);

module.exports = { upload };
