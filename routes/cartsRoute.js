const express = require("express");
const router = express.Router(); // router instead of app
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

router
  // only form user
  .route("/")
  .get(authController.protect, cartController.getCart)
  .delete(authController.protect, cartController.clearCart);
router
  .route("/:idProduct")
  .delete(authController.protect, cartController.removeFromCart);
router
  .route("/:idProduct/:quantity")
  .post(authController.protect, cartController.addToCart);
// for admin
router
  .route("/allCarts")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    cartController.getAllCarts
  );

module.exports = router;
