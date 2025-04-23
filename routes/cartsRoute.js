const express = require("express");
const router = express.Router(); // router instead of app
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");
// this protect middleware is used in every route
router.use(authController.protect);
router
  // only form user
  .route("/")
  .get(cartController.getCart)
  .delete(cartController.clearCart)
  .post(cartController.addToCart);
router.route("/:idProduct").delete(cartController.removeFromCart);

// for admin
router
  .route("/allCarts")
  .get(authController.restrictTo("admin"), cartController.getAllCarts);

module.exports = router;
