const catchAsync = require("../Utils/catchAsync");
const allUsers = require("../models/usersModel");
const httpStataus = require("../Utils/httpStatusText");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const ApiError = require("../Utils/apiError");
// create Send Token
const createSendToke = (id, name, role) => {
  const token = jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIREIN,
  });
  return token;
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
  res.status(201).json({
    status: httpStataus.SUCCESS,
    token: createSendToke(newUser._id, newUser.name, newUser.role),
    data: {
      store: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if you exist email and passoword
  if (!email || !password) {
    return next(new ApiError("you should write email and password", 400));
  }
  // 2) check if email and passowrd are right
  // make password are visible to compare
  const user = await allUsers.findOne({ email }).select("+password");
  const comparedPass = await user.correctPassword(password, user.password);
  if (!user || !comparedPass) {
    return next(new ApiError("email or password is flase", 401));
  }
  res.status(200).json({
    status: "success",
    token: createSendToke(user._id, user.name, user.role),
  });
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
  const currentUser = jwt.verify(token, process.env.JWT_SECRET);
  // check if userr still exist in database or no

  const validtUser = allUsers.findById(currentUser.id);
 
  if (!validtUser) {
    return next(new ApiError("the user belong to this token is exist", 401));
  }
  // check if user change password
  // if(currentUser.changePasswordAfter(decode.iat)){
  //   return next(new ApiError("user change password please login again ", 404))
  // }
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
