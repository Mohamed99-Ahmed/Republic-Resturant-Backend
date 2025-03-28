
const { Category } = require("../models/categoriesModel");
const factory = require("./handlerFactory");
// Makeing api more good (filter, sort, pagination)
// get All Category
exports.getAllCategories = factory.getAll(Category, {
  path: "products",
  select: "-__v", // Exclude __v field for cleaner results
});

// updatee pecefic Category
exports.updateSpeceficCategory = factory.updateOne(Category);
// get specefic Category
exports.getspeceficCategory = factory.getOne(Category, { path: "products" });
// delete specific item
exports.deleteSpeceficCategory = factory.deleteOne(Category);
// create new Category
exports.createCategory = factory.createOne(Category);
