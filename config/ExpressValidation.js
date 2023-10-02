const { body, check } = require("express-validator");
const path = require("path");

exports.productRules = [
  check("name").notEmpty().withMessage("input required").escape().trim(),
  check("price").notEmpty().withMessage("input required").escape().trim(),
  check("photo").custom((value, { req }) => {
    if (!req.file) throw new Error("no file selected");
    if (req.file.size > 1000000) throw new Error("size can not more than 1 MB");
    if (!req.file.mimetype.startsWith("image/"))
      throw new Error("what you oploaded is not image");
    return true;
  }),
];
