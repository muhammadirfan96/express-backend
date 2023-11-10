const express = require("express");
const {
  show,
  login,
  logout,
  refreshToken,
  remove,
  find,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/UserControllers");
const router = express.Router();
const Authentication = require("../middleware/Authentication");
const {
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  forgotPasswordValidation,
} = require("../validations/UserValidations");

/////////// auth ///////////
router.post("/user/login", loginValidation, login);
router.post("/user/register", registerValidation, register);
router.get("/user/refresh-token", refreshToken);
router.delete("/user/logout", logout);
router.post("/user/reset-password", resetPasswordValidation, resetPassword);
router.post("/user/forgot-password", forgotPasswordValidation, forgotPassword);

/////////// controller ///////////
router.get("/user/:id", Authentication, show);
router.get("/user", Authentication, find);
router.delete("/user/:id", Authentication, remove);

module.exports = router;
