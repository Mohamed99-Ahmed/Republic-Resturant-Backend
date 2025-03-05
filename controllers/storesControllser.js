const httpStataus = require("../Utils/httpStatusText");
const apiFeatures = require("../Utils/apiFeatures");
// getBurgers from database
const catchAsync = require("../Utils/catchAsync");
const  allStores  = require("../models/storesModel");
const ApiError = require("../Utils/apiError");

// Makeing api more good (filter, sort, pagination)
// get All stores
exports.getAllStores =catchAsync( async (req, res, next) => {
  let featchers = new apiFeatures(allStores.find(),req.query).filter().sort().limitFields();
  let stores = await featchers.query;
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
        stores,
    },
  });
});
// get specefic store
exports.getspeceficStore =catchAsync( async (req, res,next) => {
  const store = await allStores.findById(req.params.idStore);
  if (!store) {
    // retun this error and close the function
    return next( new ApiError("category id in  not correct", 404));
  }
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: {
            store,
        },
      });
    
});
// updateS pecefic store
exports.updateSpeceficStore =catchAsync( async (req, res,next) => {
  
  const updatedStore = await allStores.findByIdAndUpdate(
    req.params.idStore,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if(!updatedStore){
    return next(new ApiError("category id is not updated", 404));
  }
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        store: updatedStore,
      },
    });
});
// delete specific Store
exports.deleteSpeceficStore =catchAsync( async (req, res, next) => {
  
    const store = await allStores.findByIdAndDelete(req.params.idStore);
    if(!store){
      return next(new ApiError("id is not correct", 404));
    }
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: null,
      });
  
  
});
// create new store
exports.createStore =catchAsync( async (req, res, next) => {
  const newStore = await allStores.create(req.body);
  res.status(201).json({
    status: httpStataus.SUCCESS,
    data: {
      store: newStore,
    },
  });
});