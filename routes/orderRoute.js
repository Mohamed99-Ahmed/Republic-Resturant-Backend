const express = require("express");
const router = express.Router(); // router instead of app
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
router.route("").get(orderController.createOrderCheckout);
// use  authController.protect for all routes
router.use(authController.protect);
router
  .route("/checkout-session/:cartId")
  .get(orderController.getCheckoutSession);

router.route("").post(authController.protect, orderController.createOrder);
router.route("/myOrders").get(orderController.getMyOrders);

// the routes are Authorize
router.use(authController.restrictTo("admin"));
router.route("/allOrders").get(orderController.getAllOrders);
router
  .route("/:id")
  .delete(orderController.deleteOrder)
  .get(orderController.getOrder);

module.exports = router;
