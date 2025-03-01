const mongoose = require("mongoose");
const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 5000;
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
console.log("Database URL:", DB);

// conncet to database
mongoose
  .connect(DB)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// Export the server for Vercel
app.listen(port, () => console.log(`Server running on port ${port}`));


