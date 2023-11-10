const { body } = require("express-validator");

exports.createValidation = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("name required")
    .bail()
    .isString()
    .withMessage("name must string"),
  body("price")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("price required")
    .bail()
    .isNumeric()
    .withMessage("price must numeric"),
];
