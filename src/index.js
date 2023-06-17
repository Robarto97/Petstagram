require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { auth } = require("./middlewares/authMiddleware");
const app = express();
const routes = require("./routes");

app.engine("hbs", handlebars.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "src/views");

mongoose
  .connect("mongodb://127.0.0.1:27017/pets")
  .then(() => console.log("Db connected successfully"))
  .catch((err) => console.log(err));

app.use(express.static("src/public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);
app.use(routes);

app.listen(3000, () => console.log("Listening on port 3000"));
