const express = require("express");
const router = express.Router(); // router instead of app
const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoryControllers");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(authController.protect,authController.restrictTo("admin"),categoryController.createCategory);
router
  .route("/:id")
  .get(categoryController.getspeceficCategory)
  .patch(authController.protect,authController.restrictTo("admin"),categoryController.updateSpeceficCategory)
  .delete(authController.protect,authController.restrictTo("admin"),categoryController.deleteSpeceficCategory);

module.exports = router;
