const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const app = express();
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const envCmd = require("env-cmd");

const PORT = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Your app is running on port ${PORT}`);
});
