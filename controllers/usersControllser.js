const { User } = require("../models/usersModel");
const factory = require("./handlerFactory");

// Makeing api more good (filter, sort, pagination)
// get All Users
exports.getallUsers = factory.getAll(User);
// get specefic user
exports.getspeceficUser = factory.getOne(User);
// updateMe user   (req.user come from middelware of protect function)
exports.updateMe = factory.updateOne(User);
// delete specific User
exports.deleteSpecUser = factory.deleteOne(User);
