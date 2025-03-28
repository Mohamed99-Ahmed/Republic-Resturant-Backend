const factory = require("./handlerFactory");
const { Product } = require("../models/productsModel");

// get All products
exports.getAllProducts = factory.getAll(Product);
// get specefic products
exports.getspeceficProduct = factory.getOne(Product, { path: "category" });
// updateS pecefic products
exports.updateSpeceficProduct = factory.updateOne(Product);
// delete specific product
exports.deleteSpeceficProduct = factory.deleteOne(Product)
// create new product
exports.createProduct = factory.createOne(Product)
