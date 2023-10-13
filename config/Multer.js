const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads-img/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error(), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: {
    fileSize: 1024 * 1024,
  },
});

module.exports = upload;
