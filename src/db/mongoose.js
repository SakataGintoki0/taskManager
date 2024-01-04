const mongoose = require("mongoose");

const db = mongoose.connect(process.env.MONGODB_URL);

if (db) {
  console.log("connection successfull");
}
