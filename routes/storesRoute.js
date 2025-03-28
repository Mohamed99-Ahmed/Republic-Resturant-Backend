const express = require("express");
const router = express.Router(); // router instead of app
const authController = require("../controllers/authController");
const storesController = require("../controllers/storesControllser");

router
  .route("/")
  .get(storesController.getAllStores)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    storesController.createStore
  );
router
  .route("/:id")
  .get(storesController.getspeceficStore)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    storesController.updateSpeceficStore
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    storesController.deleteSpeceficStore
  );

module.exports = router;
