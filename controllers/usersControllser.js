const httpStataus = require("../Utils/httpStatusText");
const apiFeatures = require("../Utils/apiFeatures");
const catchAsync = require("../Utils/catchAsync");
const  allUsers  = require("../models/usersModel");
const ApiError = require("../Utils/apiError");

// Makeing api more good (filter, sort, pagination)
// get All Users
exports.getallUsers =catchAsync( async (req, res, next) => {
  let featchers = new apiFeatures(allUsers.find(),req.query).filter().sort().limitFields();
  let users = await featchers.query;
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
        users,
    },
  });
});
// get specefic user
exports.getspeceficUser =catchAsync( async (req, res,next) => {
  const user = await allUsers.findById(req.params.idUser);
  if (!user) {
    // retun this error and close the function
    return next( new ApiError("user id in  not correct", 404));
  }
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: {
            user,
        },
      });
    
});
// updateS pecefic user
exports.updateSpeceficUser =catchAsync( async (req, res,next) => {
  
  const updatedUser = await allUsers.findByIdAndUpdate(
    req.params.idUser,
    req.body,
    {
        // thsi will be validate with my model
      new: true,
      runValidators: true,
    }
  );
  if(!updatedUser){
    return next(new ApiError("User id is not updated", 404));
  }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        store: updatedUser,
      },
    });
});
// delete specific User
exports.deleteSpecUser =catchAsync( async (req, res, next) => {
  
    const user = await allUsers.findByIdAndDelete(req.params.idUser);
    if(!user){
      return next(new ApiError("id is not correct", 404));
    }
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: null,
      });
  
  
});
