const httpStataus = require("../utils/httpStatusText");
const apiFeatures = require("../utils/apiFeatures");
const { Cart } = require("../models/cartModel");
const factory = require("./handlerFactory");

// getBurgers from database
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const Order = require("../models/orderModel");
const { crossOriginEmbedderPolicy } = require("helmet");
const stripe = require("stripe")(
  "sk_test_51RAl922QW4k1617zavtyxIidkpXGMjEN6Tgbr1UCfeQkxJXC9aAVCbxs0AcI1ZUN9IrczuvmrZ6xC959i2oDmYvU00ZyrxLOSB"
);
// checkout session in stripe
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get cart from param
  const cart = await Cart.findById(req.params.cartId);
  // 2) create checkout seccsion
  const session = await stripe.checkout.sessions.create({
    // information about session
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `https://backend-three-nu-89.vercel.app/order?cart=${req.params.cartId}&user=${req.user.id}&price=${cart.totalPrice}`, // if success make this success link that i will use it to go it and make order in database
    cancel_url: `${req.headers.origin}/cart`, // if not success (cancel order) // ${req.headers.origin}/cart
    customer_email: req.user.email, // cusotomer that make order
    client_reference_id: req.params.cartId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${cart.totalPrice} cart`, // Name of the product
          },
          unit_amount: cart.totalPrice * 100, // Convert to cents (USD)
        },
        quantity: 1,
      },
    ],
  });
  console.log("session", session);
  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

//  make order in databse
exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { cart, user, price } = req.query; // take cart user price form query when success url
  if (!cart && !user && !price)
    return next(new ApiError("you should user and have cart ", 400));
  // Set the paid field to true
  const order = await Order.create({ cart, user, price, paid: true }); // create order in database
  // make cartItems to cart in order
  // await Cart.deleteOne({ user: user });   /// i delete in orderModel
  // it will change with frontend link when success
  res.redirect(`https://republic-front.vercel.app/orders`); // redirest to orginal url in success_url
});

// getCart
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });
  if (!order) return next(new ApiError("you do not have orders", 404));
  res.status(200).json({
    status: httpStataus.SUCCESS,
    data: {
      data: order,
    },
  });
});
// createOrder in database and add delte function to delete cart
exports.deletUserCart = catchAsync(async (req, res, next) => {
  // Find the cart that relates to the user
  const cart = await Cart.findOne({ user: this.user }).select("-id");
  // i want take copy from cart not the same
  this.cartCopy = JSON.parse(JSON.stringify(cart)); // Assign cart items to order
  await Cart.deleteOne({ user: this.user }); // Delete the cart after creating the order
  next();
});
exports.createOrder = factory.createOne(Order);

// these Routes are authorize
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
