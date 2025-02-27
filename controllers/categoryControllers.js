const httpStataus = require("../Utils/httpStatusText");

// getBurgers from database

const { Categories } = require("../models/categories");

// Makeing api more good (filter, sort, pagination)
function queryFunc(req) {
  let queryObj = { ...req.query };
  const exclutedFields = ["page", "sort", "limit", "fields"];
  // delete all this exclutedFields from queryObject
  exclutedFields.forEach((el) => delete queryObj[el]);

  // make qeryStr to change any (gt, lt, gte, lte) to ($gt, $lt, $gte, $lte) them return these from function
  const queryStr = JSON.stringify(queryObj).replace(
    /\b(gt|gte|lt|lte)\b/,
    (match) => `$ ${match}`
  );

  return queryStr;
}
// specefic filtriation by fields and sorted
function filtration(req, categories) {
  // make fields filtrition for some fieled to delete form data
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    // select many of fields that you want to appear in filtriation by atoumatic
    categories = categories.select(fields);
  } else {
    // remove _v form category if it written
    categories = categories.select("-_v");
  }
  // sort the categories
  if (req.query.sort) {
    const sorted = req.query.sort.split(",").join(" ");
    categories = categories.sort(sorted);
  } else {
    categories = categories.sort("_createdAt");
  }
  return categories;
}
// Making pagination
 function pagination(req, categories) {
  const page = req.query.page;
  const limit = req.query.limit || 3;
  const skip = (page - 1) * limit; //where i want to skip start display categories
  categories = categories.skip(skip).limit(limit);
  return categories;
}
// get All Category
exports.getAllCategories = async (req, res) => {
  try {
    //
    const query = JSON.parse(queryFunc(req));
    let catag = Categories.find(query);
    // make Filtration for catagegory and pagination
    filtration(req, catag);
    pagination(req, catag);
    // await for categories
    let categories = await catag;
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
