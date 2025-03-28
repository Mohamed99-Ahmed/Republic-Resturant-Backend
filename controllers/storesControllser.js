
// getBurgers from database
const  Store  = require("../models/storesModel");
const factory = require("./handlerFactory");

// Makeing api more good (filter, sort, pagination)
// get All stores
exports.getAllStores = factory.getAll(Store)
// get specefic store
exports.getspeceficStore = factory.getOne(Store)
// updateS pecefic store
exports.updateSpeceficStore = factory.updateOne(Store)
// delete specific Store
exports.deleteSpeceficStore = factory.deleteOne(Store)
// create new store
exports.createStore = factory.createOne(Store)