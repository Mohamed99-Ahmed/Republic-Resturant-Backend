const httpStataus = require("../Utils/httpStatusText");
const apiFeatures = require("../Utils/apiFeatures");
// getproducts from database
const catchAsync = require("../Utils/catchAsync");
const { Product: Products} = require("../models/productsModel");
const ApiError = require("../Utils/apiError");

// Makeing api more good (filter, sort, pagination)
// get All products
exports.getAllProducts = catchAsync(async (req, res, next) => {
  let products = new apiFeatures(
    Products.find(),
    req.query
  )
    .filter()
    .sort()
    .limitFields();
  let allProducts = await products.query;
 
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      allProducts,
    },
  });
});
// get specefic products
exports.getspeceficProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findById(req.params.idProduct).populate("category");
  if (!product) {
    // retun this error and close the function
    return next(new ApiError("product id in  not correct", 404));
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      product,
    },
  });
});
// updateS pecefic products
exports.updateSpeceficProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Products.findByIdAndUpdate(
    req.params.idProduct,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedProduct) {
    return next(new ApiError("product id is not updated", 404));
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      product: updatedProduct,
    },
  });
});
// delete specific product
exports.deleteSpeceficProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findByIdAndDelete(req.params.idProduct);
  if (!product) {
    return next(new ApiError("id is not correct", 404));
  }
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: null,
  });
});
// create new product
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Products.create(req.body);
  res.status(201).json({
    status: httpStataus.SUCCESS,
    data: {
      product: newProduct,
    },
  });
});
