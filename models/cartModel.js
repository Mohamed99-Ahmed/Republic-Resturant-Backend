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
  const price = this.product?.price?.single ?? this.product?.price;

  if (!price) return 0;

  return this.quantity * price;
});
// cartSchema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You should provide a user"], // تعديل الرسالة
      unique: true, // Ensures one cart per user
    },
    items: [itemSchema],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to calculate total price dynamically
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    const price = item.product?.price?.single ?? item.product?.price ?? 0;
    return total + item.quantity * price;
  }, 0);
});

// Auto-populate user and products when querying carts
cartSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "user", select: "-__v" },
    { path: "items.product", select: "-__v" },
  ]);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
