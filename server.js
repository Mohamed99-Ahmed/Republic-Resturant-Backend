const mongoose = require("mongoose");
const app = require("./app.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 9000;
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
console.log("Database URL:", DB);
dotenv.config({ path: "./config.env" });

// conncet to database
mongoose
  .connect(DB)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));


  app.use(cors());
//listen to server
app.listen(port, () => {
  console.log(`heoo from port ${port}`);
});
