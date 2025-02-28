const httpStataus = require("../Utils/httpStatusText");
const apiFeatures = require("../Utils/apiFeatures");
// getBurgers from database

const { Categories } = require("../models/categories");

// Makeing api more good (filter, sort, pagination)


// Making pagination

// get All Category
exports.getAllCategories = async (req, res) => {
  try {
    //
    let featchers = new apiFeatures(Categories.find(),req.query).filter().sort().limitFields().pagenation();
    let categories = await featchers.query;
    res.status(200).json({
      status: httpStataus.SUCCESS,
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: httpStataus.ERROR,
      message: err.message,
    });
  }
};
// get specefic Category
exports.getspeceficCategory = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.idCategory);
    if (category) {
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: {
          category,
        },
      });
    } else {
      res.status(400).json({
        status: httpStataus.FAILED,
        data: {
          category: null,
        },
      });
    }
  } catch (err) {
    res.status(404).json({
      status: httpStataus.ERROR,
      message: err.message,
    });
  }
};
// updateS pecefic Category
exports.updateSpeceficCategory = async (req, res) => {
  try {
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.params.idCategory,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedCategory) {
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: {
          category: updatedCategory,
        },
      });
    } else {
      res.status(400).json({
        status: httpStataus.FAILED,
        data: {
          product: null,
        },
      });
    }
  } catch (err) {
    res.status(404).json({
      status: httpStataus.ERROR,
      message: err.message,
    });
  }
};
// delete specific item
exports.deleteSpeceficCategory = async (req, res) => {
  try {
    const category = await Categories.findByIdAndDelete(req.params.idCategory);
    if (category) {
      res.status(200).json({
        status: httpStataus.SUCCESS,
        data: null,
      });
    } else {
      res.status(400).json({
        status: httpStataus.FAILED,
        data: {
          message: "id is not correct",
        },
      });
    }
  } catch (err) {
    res.status(404).json({
      status: httpStataus.ERROR,
      message: err.message,
    });
  }
};
