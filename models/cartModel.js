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
    size: {
      type: String,
      enum: ["single", "double", "normal"],
      default: "normal",
    },
    choice: {
      type: String,
      default: "regualr",
      enum: ["regualr", "spicy"],
    },
    itemTotal: {
      type: Number,
      default: 0,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
itemSchema.pre("save", async function (next) {
  // Now populate 'product' directly in the parent cartSchema
  // if (!this.product) {
  //   return next(); // No product, skip population logic
  // }
  if (this.isNew) {
    this.product = await mongoose
      .model("Product")
      .findById(this.product)
      .select("-__v -createdAt ");
  }
  // Price
  if (this.product && this.product.price) {
    const price = this.product.price;
    if (this.size === "single") {
      this.itemTotal = this.quantity * price.single;
    } else if (this.size === "double") {
      this.itemTotal = this.quantity * price.double;
    } else if (this.size === "normal") {
      this.itemTotal = this.quantity * price;
    }
  }
  next();
});

// itemSchema.virtual("itemTotal").get(function () {
//   const price = this.product?.price?.single ?? this.product?.price;

//   if (!price) return 0;

//   return this.quantity * price;
// });
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
    description: {
      type: String,
      default:"",
    },
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
