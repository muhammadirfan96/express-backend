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
    cb(new Error("what you oploaded is not image"), false);
  }

  if (file.size < 1000000) {
    cb(null, true);
  } else {
    cb(new Error("size can not more than 1 MB"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = upload;
