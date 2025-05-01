const ApiError = require("../utils/apiError");
const { Cart } = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const httpStatus = require("../utils/httpStatusText");
//  (get cart / addTocart / removee from cart / clear cart) access to user

// getCart
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      data: cart,
    },
  });
});

// Add products to cart or, if him not have cart make new cart
exports.addToCart = catchAsync(async (req, res, next) => {
  const { size, choice, quantity, productId, description } = req.body; // Assuming size is passed in the request body
  // find the cart that relate to user
  let cart = await Cart.findOne({ user: req.user.id });

  // If no cart exists, create a new one
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [], description });
  } else if (description) {
    cart.description = description; // Update description if needed
  }

  // Find the existing product in the cart

  const existingItem = cart.items.find((item) => {
    // if i wirte size and choice  so the product have (size and choice)
    const sameProduct = item.product._id.toString() === productId.toString();

    if (size && choice) {
      return sameProduct && item.size === size && item.choice === choice;
    }

    if (!size && choice) {
      return sameProduct && item.choice === choice;
    }

    // لا يوجد size ولا choice
    return sameProduct;
  });

  if (existingItem) {
    // Update the quantity dynamically
    existingItem.quantity = quantity;
    existingItem.size = size; // Update size if needed
    existingItem.choice = choice; // Update choice if needed
    if (existingItem.quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items = cart.items.filter(
        (item) => item.product._id.toString() !== productId.toString()
      );
    }
  } else {
    // Add new item only if quantity is positive
    if (quantity > 0) {
      cart.items.push({ product: productId, quantity, size, choice });
    }
  }

  await cart.save();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      data: cart,
    },
  });
});

// remove product form cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const productId = req.params.idProduct;
  let cart = await Cart.findOne({ user: req.user.id });
  // make error if cart not found
  if (!cart) return next(new ApiError("id of product is not correct", 404));
  // remove product from cart
  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== productId.toString()
  );
  await cart.save();
  // getCart()
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      data: cart,
    },
  });
});

// clear cart
exports.clearCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  // clear cart
  cart.items = [];
  // save the changes
  await cart.save();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: null,
  });
});

//  (get carts / removee  cart ) access to adimin
exports.getAllCarts = factory.getAll(Cart);
