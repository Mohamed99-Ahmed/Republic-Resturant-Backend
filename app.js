/* eslint-disable no-undef */
const express = require("express");
const app = express();
const prductsRoutes = require("./routes/categoryRoute");
const cors = require("cors");
const ApiError = require("./Utils/apiError");
const globalErrorHandler = require('./controllers/errorController')
// حول Express إلى دالة Serverless حتى يعمل على Vercel

// Middle wares
let date;
app.use(express.json());

// Enable CORS for all routes get and post api
app.use(cors());

// Enable CORS for all routes put and delete api
app.options('*', cors());
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Add CreatedAt middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Store request time as a string
  next();
});


//  Routes
app.use("/categories", prductsRoutes);

// if route not found upper go to this route and this error will go to the next middleware of error
app.use("*", (req, res,next) => {
  next( new ApiError("Route not found", 404));
});
// erorr handler middleware that will use for every erorr in any middleware
app.use(globalErrorHandler)
//listen to server
module.exports = app;
