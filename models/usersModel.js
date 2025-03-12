const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "you should wire email"],
    minLength: [3, "minumum length of name is 3 letters"],
    maxLength: [15, "maxiumum length of name is 15 letters"],
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "this email already exist please choose anoter email"],
    lowercase: [true, "email muse be lowercase"],
    required: [true, "you should wire email"],
    validate: [validator.isEmail, "please wirte valid email"],
  },
  phone: {
    type: Number,
    required: [true, "you should write your number"],
  },
  location: {
    type: String,
    required: [true, "you should write your location"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "repassword is required"],
    select: false,
  },
  rePassword: {
    type: String,
    required: [true, "password is required"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "repassword not equal to password",
    },
  },
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
});
// before save and create make hasing on password
userSchema.pre("save", async function (next) {
  // if not update user next to next middleware
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // not send to database only on validation when create
  this.rePassword = undefined;
  // next to middleware
  next();
});
// changePasswordAt change if password change
userSchema.pre("save", async function (next) {
  // if not update password or user is new   next to next middleware
  if (!this.isModified("password") || this.isNew) return next();
  // if passwordChanged
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// correctpasswaord method(add method for every document in this model  that can access and return true or false)
userSchema.methods.correctPassword = async function (candiatePass, userPass) {
  return await bcrypt.compare(candiatePass, userPass);
};

// changePassword after created
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // JWTTimestamp must equal to  passwordChangedAt if in start so this func return false
    // but if change passwordChangedAt it will bigger than JWTTimestamp(initial value of date) so func return truen
    // the controller will handle the result
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
// create password Reset Token (token send to databse but with hash)
userSchema.methods.createPasswordResetToken = function () {
  // make resetToken by crypto that is in node
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Make hash in resetToken to be more secure
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // change in expire to make it in future  (ex 10 min)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // ok this function will return resetToken
  return resetToken;
};

// Make a Model for all products
const Users = mongoose.model("User", userSchema);

//   exprorts module
module.exports = Users;
