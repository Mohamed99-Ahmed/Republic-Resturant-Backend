const express = require("express");
const router = express.Router(); // router instead of app

const userController = require("../controllers/usersControllser");
const authController = require("../controllers/authController");

// signup
router.route("/signup").post(authController.signUp);
// login
router.route("/login").post(authController.login);
// forgetPassword
router.route("/forgetPassword").post(authController.forgetPassword);
// reset password
router.route("/resetPassword/:token").patch(authController.resetPassword);
// udpate my password
router
  .route("/updateMyPassword")
  .patch(authController.protect, authController.updateMyPassword);

// getAllusers
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getallUsers
  );
// getSpecefig user and delet user
router
  .route("/:id")
  .get(userController.getspeceficUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteSpecUser
  );
// update me (only name or email)
router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);

// make nested route of user
// router.use('/:tourUser/cart', cart);
module.exports = router;
