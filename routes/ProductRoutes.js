const express = require("express");
const ProductController = require("../controller/ProductController");
const { productRules } = require("../config/ExpressValidation");
const router = express.Router();
const upload = require("../config/Multer");

router.get("/product/:id", ProductController.showProduct);
router.get("/product/:key/:limit/:offset", ProductController.findProduct);
router.post(
  "/product",
  upload.single("photo"),
  productRules,
  ProductController.createProduct
);
router.patch("/product/:id", ProductController.updateProduct);
router.delete("/product/:id", ProductController.deleteProduct);

module.exports = router;
