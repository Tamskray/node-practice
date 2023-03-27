import express, { json } from "express";
import mongoose from "mongoose";
import authRouter from "./authRouter.js";

const PORT = process.env.PORT || 5000;
const DB_URL =
  "mongodb+srv://user:user@cluster0.z8lqtqz.mongodb.net/?retryWrites=true&w=majority";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
// app.use(express.static("static"));
// app.use(fileUpload({}));

const startApp = async () => {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => console.log("Server started on port " + PORT));
  } catch (e) {
    console.log(e);
  }
};

startApp();
