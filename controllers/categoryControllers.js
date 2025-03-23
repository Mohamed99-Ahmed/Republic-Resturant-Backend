const httpStataus = require("../Utils/httpStatusText");
const apiFeatures = require("../Utils/apiFeatures");
// getBurgers from database
const catchAsync = require("../Utils/catchAsync");
const { Category } = require("../models/categoriesModel");
const ApiError = require("../Utils/apiError");

// Makeing api more good (filter, sort, pagination)
// get All Category
exports.getAllCategories = catchAsync(async (req, res, next) => {
  let featchers = new apiFeatures(
    Category.find().populate({
      path: "products",
      select: "-__v", // Exclude __v field for cleaner results
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();
  let categories = await featchers.query;
  console.log(categories);

  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      categories,
    },
  });
});
// get specefic Category
exports.getspeceficCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.idCategory).populate(
    "products"
  );
  if (!category) {
    // retun this error and close the function
    return next(new ApiError("category id in  not correct", 404));
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      category,
    },
  });
});
// updateS pecefic Category
exports.updateSpeceficCategory = catchAsync(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.idCategory,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCategory) {
    return next(new ApiError("category id is not updated", 404));
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      category: updatedCategory,
    },
  });
});
// delete specific item
exports.deleteSpeceficCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.idCategory);
  if (!category) {
    return next(new ApiError("id is not correct", 404));
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: null,
  });
});
// create new Category
exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: httpStataus.SUCCESS,
    data: {
      category: newCategory,
    },
  });
});
