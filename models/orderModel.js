const mongoose = require("mongoose");
const { Cart } = require("./cartModel");
const ApiError = require("../utils/apiError");

const orderSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
    required: [true, "Booking must belong to a cart!"],
  },
  cartCopy: {
    type: Object,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  price: {
    type: Number,
    require: [true, "Booking must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: false,
  },
});
// pre save change cartItems to cart

orderSchema.pre("save", async function (next) {
  // Find the cart that relates to the user
  const cart = await Cart.findOne({ user: this.user }).select("-id");
  if (!cart) {
    return next(new ApiError("No cart found for this user"));
  }
  // i want take copy from cart not the same
  this.cartCopy = JSON.parse(JSON.stringify(cart)); // Assign cart items to order
  await Cart.deleteOne({ user: this.user }); // Delete the cart after creating the order
  next();
});
// pre make order when every any find
orderSchema.pre(/^find/, function (next) {
  this.populate("user");
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
