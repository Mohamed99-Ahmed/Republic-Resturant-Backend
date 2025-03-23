const mongoose = require("mongoose");
const { Category } = require("./categoriesModel");
// add a docucment to collection in database after make schema
const productSchema = new mongoose.Schema(
  {
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // reference to Category Model
      required: [true, "you should write categoryDetails filed"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// population category in product
productSchema.pre(/^find/, function (next) {
  console.log("Populating category..."); // Debugging log
  this.populate({
    path: "category",
    select: "-products",
  });
  next();
});

// Make a Model for all products
const Product = mongoose.model("Product", productSchema);

//   exprorts module
module.exports = { Product };
