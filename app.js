/* eslint-disable no-undef */
const express = require("express");
const app = express();
// routes
const prductsRoutes = require("./routes/categoryRoute");
const storesRoutes = require("./routes/storesRoute");
const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");
const cartRoute = require("./routes/cartsRoute");
const orderRoute = require("./routes/orderRoute");
// cors and Error
const cors = require("cors");
const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./controllers/errorController");
// security package
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
// حول Express إلى دالة Serverless حتى يعمل على Vercel

// Middle wares
let date;
app.use(express.json());

// Enable CORS for all routes get and post api
app.use(cors());

// Enable CORS for all routes put and delete api
app.options("*", cors());
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// security package
// 1) rateLimit ( limit the maxiumum of request for api)
const rateLimiter = rateLimit({
  max: 100, // maxiumum of request
  windowMs: 60 * 60 * 1000, // message error will appear for 1 hour because maxium request if happend
  message: `'Too many requests from this IP, please try again in an hour!`,
});
app.use("/users", rateLimiter); // middleware that reteLimiter work in it
// 2)  helmet (secure by setting HTTP)
app.use(helmet()); // for all routes
// 3) xxs-clean(secure against nosql => Sanitize untrusted HTML that in req.body)
// express-mongo-sanitize ( secure agaist coding hack in req.body => sanitze coding hack in req.body)
app.use(xss()); // for all routes
app.use(mongoSanitize());
// 4) hpp (remove duplicate query in request and take the last on only that you want make error if you dublicate  )
app.use(
  hpp({
    whitelist: ["sort"], // will make error if you put on of them dublicate
  })
);
// Add CreatedAt middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Store request time as a string
  next();
});

//  Routes
app.use("/categories", prductsRoutes);
app.use("/stores", storesRoutes);
app.use("/users", usersRoute);
app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

// if route not found upper go to this route and this error will go to the next middleware of error
app.use("*", (req, res, next) => {
  next(new ApiError("Route not found", 404));
});
// erorr handler middleware that will use for every erorr in any middleware
app.use(globalErrorHandler);
//listen to server
module.exports = app;
