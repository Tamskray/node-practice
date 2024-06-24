const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const userRouter = require("./routes/userRouter.js");
const taskRouter = require("./routes/taskRouter.js");

const url = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use("", userRouter);
app.use("", taskRouter);

const start = async () => {
  try {
    await mongoose.connect(url);
    app.listen(port, () => console.log(`Server started on PORT ${port}`));
  } catch (e) {
    console.log(e);
  }
};

start();
