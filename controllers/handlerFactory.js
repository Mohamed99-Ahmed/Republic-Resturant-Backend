const httpStataus = require("../utils/httpStatusText");
const apiFeatures = require("../utils/apiFeatures");
// getBurgers from database
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
//  createOne document function
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};
// deleteOne document function
exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ApiError("id of document is not correct", 404));
    }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: null,
    });
  });
};
// getAll document function
exports.getAll = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.find();
    if (popOptions) query = Model.find().populate(popOptions);
    let featchers = new apiFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields();
    let doc = await featchers.query;
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};
// getOne document function
exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = Model.findById(req.params.id).populate(popOptions);
    const doc = await query;
    if (!doc) {
      // retun this error and close the function
      return next(new ApiError("document id in  not correct", 404));
    }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};

// updateOne document function
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new ApiError("document id is not updated", 404));
    }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
};
