/* eslint-disable no-undef */
const express = require("express");
const app = express();
const prductsRoutes = require("./routes/categoryRoute");
const cors = require("cors");
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
