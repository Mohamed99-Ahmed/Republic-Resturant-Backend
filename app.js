/* eslint-disable no-undef */
const express = require("express");
const app = express();
const prductsRoutes = require("./routes/categoryRoute");
const cors = require("cors");

// Middle wares
let date;
app.use(express.json());

// Enable CORS for all routes
app.use(cors());
// Add CreatedAt middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Store request time as a string
  next();
});


//  Routes
app.use("/categories", prductsRoutes);

// if route not found upper go to this route
app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
  next()
});

//listen to server
module.exports = app;
