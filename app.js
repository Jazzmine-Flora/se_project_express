const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const auth = require("./middlewares/auth");

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

// Public routes
app.post("/signin", require("./controllers/users").login);
app.post("/signup", require("./controllers/users").createUser);
app.use("/items", require("./routes/clothingItems"));

// Protected routes
app.use(auth);
app.use(routes);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
