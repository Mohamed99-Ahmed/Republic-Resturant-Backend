const express = require("express");
const router = express.Router(); // router instead of app
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
// use  authController.protect for all routes

router.use(authController.protect);
router
  .route("/checkout-session/:cartId")
  .get(orderController.getCheckoutSession);

router
  .route("")
  .get(orderController.createOrderCheckout)
  .post(orderController.createOrder);
router.route("/geMyOrders").get(orderController.getMyOrders);

// the routes are Authorize
router.use(authController.restrictTo("admin"));
router
  .route("/:id")
  .delete(orderController.deleteOrder)
  .get(orderController.getOrder);
router.route("/allOrders").get(orderController.getAllOrders);
module.exports = router;
