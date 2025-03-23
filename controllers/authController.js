const catchAsync = require("../Utils/catchAsync");
const allUsers = require("../models/usersModel");
const httpStataus = require("../Utils/httpStatusText");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const ApiError = require("../Utils/apiError");
const sendEmail = require("../Utils/email");
const crypto = require("crypto");
// create Send Token
const signToken = (id, name, role) => {
  const token = jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREIN,
  });
  return token;
};

// create send token with nice response
const createSendToken = (user, statusCode, res) => {
  // signToken
  const token = signToken(user.id, user.name, user.role);

  //  cokkie that will send to browser that recieve it not token so more secure
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if ((process.env.NODE_ENV = "production")) cookieOptions.secure = true; // make secure cookie(token)
  res.cookie("jwt", token, cookieOptions);

  // make invisible password so it will be more secure
  res.password = undefined;
  // response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// create new user
exports.signUp = catchAsync(async (req, res, next) => {
  // we take all of that because of security not req.body but with detaails
  const newUser = await allUsers.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    rePassword: req.body.rePassword,
    location: req.body.location,
    phone: req.body.phone,
    role: req.body.role,
  });
  // create send token with responese
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new ApiError("you should write email and password", 400));
  }

  // 2) check if user exists & password is correct
  const user = await allUsers.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError("email or password is incorrect", 401));
  }

  const comparedPass = await user.correctPassword(password, user.password);
  if (!comparedPass) {
    return next(new ApiError("email or password is incorrect", 401));
  }

  // 3) if everything ok, send token
  createSendToken(user, 200, res);
});
// protect Route
exports.protect = catchAsync(async (req, res, next) => {
  // getting token from headers and check it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // take the secound index that is token and continue this function
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not login please login to take token and can access data",
        401
      )
    );
  }
  // verficate token compare between the secret jwt in tken and in config
  // jwt.verfy return promice function that i can call it with some arguments
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if userr still exist in database or no

  const currentUser = await allUsers.findById(decode.id);

  if (!currentUser) {
    return next(new ApiError("the user belong to this token is exist", 401));
  }
  // check if user change password
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(new ApiError("user change password please login again ", 404));
  }
  // if every things is right go to next middleware(Route)
  req.user = currentUser;

  next();
});
// Authorization (take req.user from the previous middleware protect)
exports.restrictTo = (...roles) => {
  // now roles its an array that have all of Authorization people ["admin", ....]
  //clouture function that can access from parent function
  return (req, res, next) => {
    //check if roles have role of user or no

    if (!roles.includes(req.user.role)) {
      return next(new ApiError("You are not have permission to access", 403));
    }
    // if roles have role that form user go to the next middleware(Route)
    next();
  };
};
// foregetPasssword function
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user base on email
  const user = await allUsers.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("there is no user with this email address", 404));
  }
  // generate random resetToken with no validate before save becase many of input require like (pass,...)
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`; // this resetURL that will send to  user to  can access that in frontned
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "you can reset your password in (10 minitus)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

// reset password with token that get from header
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on reset Token in req param

  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex"); // hash resettoken to compare with hashed token in database

  const user = await allUsers.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log(user);
  // if token right and find user so take password and rePassword from req.body and save user
  if (!user) {
    return next(new ApiError("token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.rePassword = req.body.rePassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  console.log(user);
  await user.save(); // save the user in database
  signToken(user._id, user.name, user.role); // create new token to update token
  res.status(200).json({
    status: "success",
    message: "you seccess change your password you can login again",
  });
});

// udpdate the password (should user log in because this function work after protect function and take token from it)
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // find user and select password to appear to compare with current password that user write
  const user = await allUsers.findById(req.user.id).select("+password");
  console.log("user", user);
  // compare current password that type with user with in database
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError("currentPassword is wrong", 401));
  }

  // if everything is write send user with create new token
  // User.findByIdAndUpdate will NOT work as intended! because validation
  //  of password and some methods like user.pre(save) not world with findByIdAndUpdate
  user.password = req.body.password;
  user.rePassword = req.body.rePassword;
  await user.save();

  // send response with newToken
  createSendToken(user, 200, res);
});
