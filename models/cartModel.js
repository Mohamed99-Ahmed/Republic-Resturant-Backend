const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You should a user "],
      unique: true, // Ensures one cart per user
    },
    items: [
      {
        // product id and quatity of product
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user items.product",
    select: "-__v", // Exclude __v field for cleaner results
  });
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
