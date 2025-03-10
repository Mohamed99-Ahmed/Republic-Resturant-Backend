const express = require("express");
const router = express.Router(); // router instead of app

const userController = require("../controllers/usersControllser");
const authController = require("../controllers/authController");
// getAllusers
router.route("/").get(authController.protect, userController.getallUsers);
//  get specifc user - delete user
router
  .route("/:idUser")
  .get(userController.getspeceficUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteSpecUser
  );
// signup
router.route("/signup").post(authController.signUp);
// login
router.route("/login").post(authController.login);
// router.route("/login/:idUser").post(userController.getspeceficUser);

module.exports = router;
