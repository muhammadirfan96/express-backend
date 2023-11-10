const express = require("express");
const {
  show,
  find,
  create,
  update,
  remove,
  uploadImage,
} = require("../controllers/ProductControllers");
const { createValidation } = require("../validations/ProductValidations");
const router = express.Router();
const Authentication = require("../middleware/Authentication");

router.get("/product/:id", Authentication, show);
router.get("/product", Authentication, find);
router.post("/product", Authentication, createValidation, create);
router.patch("/product/:id", Authentication, createValidation, update);
router.delete("/product/:id", Authentication, remove);
router.patch("/product/:id/image", Authentication, uploadImage);

module.exports = router;
