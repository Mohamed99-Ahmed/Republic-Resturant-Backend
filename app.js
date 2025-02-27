/* eslint-disable no-undef */
const express = require("express");
const app = express();
const prductsRoutes = require("./routes/categoryRoute");

// Adding the data that in conguration to proccess.env
// MiddleWares
// Middle wares
// this is
let date;
app.use(express.json());
app.get((req, res, next) => {
  res.send("Hello from the server app!");
  next();
});
// Add CreatedAt middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Store request time as a string
  next();
});
// Middleware

//  Routes
app.use("/categories", prductsRoutes);

// if route not found upper go to this route
app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
});

//listen to server
module.exports = app;
