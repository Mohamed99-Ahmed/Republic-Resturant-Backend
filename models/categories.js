const mongoose = require("mongoose");
// add a docucment to collection in database after make schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "name of product is required"],
    maxLength: [100, "max length of product is 100 characters"],
    minLength: [3, "min length of product is 3 characters"],
  },
  price: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "price of product is required"],
  },
  id: {
    type: Number,
    required: [true, "id of product is required"],
  },
  imageCover: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "name of category is required"],
      maxLength: [100, "max length of category is 100 characters"],
      minLength: [3, "min length of category is 3 characters"],
    },
    createdAt: { type: Date, default: Date.now() },
    products: [productSchema], // Each product will get a unique _id automatically
  },
  {
    toJSON: { virtuals: true }, // Make virtual fields available in JSON output
    toObject: { virtuals: true },
  }
);
// this virtual field appear in output of data but not in database
categorySchema.virtual("countProducts").get(function () {
  return this.products.length;
});

// Make a Model for all products
const Categories = mongoose.model("Category", categorySchema);

//   exprorts module
module.exports = { Categories };
