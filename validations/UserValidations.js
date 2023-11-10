const { body } = require("express-validator");
const UsersModel = require("../models/UsersModel");

exports.loginValidation = [
  body("email").trim().escape().notEmpty().withMessage("email required"),
  body("password").trim().escape().notEmpty().withMessage("password required"),
];

exports.registerValidation = [
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("email not valid")
    .bail()
    .normalizeEmail()
    .bail()
    .custom(async (value) => {
      const user = await UsersModel.findOne({ where: { email: value } });
      if (user) throw new Error("email alredy used");
      return true;
    }),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage("password min 6 character"),
  body("confPassword").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("confirmation password not match");
    return true;
  }),
];

exports.forgotPasswordValidation = [
  body("email").trim().escape().notEmpty().withMessage("email required"),
];

exports.resetPasswordValidation = [
  body("newPassword")
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage("password min 6 character"),
  body("confPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword)
      throw new Error("confirmation password not match");
    return true;
  }),
  body("emailToken").trim().escape().notEmpty().withMessage("token required"),
];
