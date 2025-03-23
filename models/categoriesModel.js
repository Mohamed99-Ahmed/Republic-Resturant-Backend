const mongoose = require("mongoose");

// add a docucment to collection in database after make schema

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "name of category is required"],
      maxLength: [100, "max length of category is 100 characters"],
      minLength: [3, "min length of category is 3 characters"],
    },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// this virtual field appear in output of data but not in database
categorySchema.virtual("countProducts").get(function () {
  return this.products ? this.products.length : 0;
});
// referce category with product
categorySchema.virtual("products", {
  ref: "Product", // product Module
  foreignField: "category", //the filed that in product model that refer to id of categor
  localField: "_id", // the id that will compare with filed
});
// categorySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "products",
//     select: "-__v", // Exclude __v field for cleaner results
//   });
//   next();
// });

// Make a Model for all products
const Category = mongoose.model("Category", categorySchema);

//   exprorts module
module.exports = { Category };
