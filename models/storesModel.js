const mongoose = require("mongoose");
// add a docucment to collection in database after make schema
const sotoreSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "name of product is required"],
    maxLength: [100, "max length of product is 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "description is requierd"]
  },
  link: {
    type: String,
    trim: true,
    required: [true, "Link of location is requierd"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});



// this virtual field appear in output of data but not in database


// Make a Model for all products
const Store = mongoose.model("store", sotoreSchema);

//   exprorts module
module.exports = Store ;
