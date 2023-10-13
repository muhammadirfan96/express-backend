const { body } = require("express-validator");

const ProductRules = [
  body("name")
    .notEmpty()
    .withMessage("name input required")
    .isString()
    .withMessage("name field must string")
    .escape()
    .trim(),
  body("price")
    .notEmpty()
    .withMessage("price input required")
    .isNumeric()
    .withMessage("price field must numeric")
    .escape()
    .trim(),
];

module.exports = ProductRules;
