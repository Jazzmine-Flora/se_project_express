const express = require("express");

const mongoose = require("mongoose");

const userRoutes = require("./routes/users.js");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to db");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});
app.use(userRoutes);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
