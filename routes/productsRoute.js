const express = require("express");
const router = express.Router(); // router instead of app

const productController = require("../controllers/productsController");
const authController = require("../controllers/authController");
// get All Proucts and create product
router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  );
// getSpecefic product and delet product and update
router
  .route("/:id")
  .get(productController.getspeceficProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateSpeceficProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteSpeceficProduct
  );

module.exports = router;
