const mongoose = require("mongoose");
// itemShcama
const itemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
itemSchema.virtual("itemTotal").get(function () {
  return this.quantity * this.product.price;
});
// cartSchema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You should a user "],
      unique: true, // Ensures one cart per user
    },
    items: [itemSchema],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// You can still keep a cart total if needed
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);
});
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user items.product",
    select: "-__v", // Exclude __v field for cleaner results
  });
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
