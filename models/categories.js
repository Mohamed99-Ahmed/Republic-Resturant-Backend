const mongoose = require("mongoose");
// add a docucment to collection in database after make schema
const productSchema = new mongoose.Schema({
  name: { type: String  },
  price: {
    type:  mongoose.Schema.Types.Mixed,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  imageCover: { type: String, required: false },
  description: {
    type : String,
  },
  createdAt: { type: Date, default: Date.now() },
});

const categorySchema = new mongoose.Schema({
  categoryName: { type: String },
  createdAt: { type: Date, default: Date.now() },
  products: [productSchema], // Each product will get a unique _id automatically
});


// Make a Model for all products
const Categories = mongoose.model("Category", categorySchema);

//   exprorts module
module.exports = { Categories };
