const express = require("express");
const ProductController = require("../controller/ProductController");
const ProductRules = require("../validations/ProductValidation");
const router = express.Router();

router.get("/product/:id", ProductController.showProduct);
router.get("/product/:key/:limit/:offset", ProductController.findProduct);
router.post("/product", ProductRules, ProductController.createProduct);
router.patch("/product/:id", ProductRules, ProductController.updateProduct);
router.delete("/product/:id", ProductController.deleteProduct);
router.patch("/img-product/:id", ProductController.uploadImage);

module.exports = router;
