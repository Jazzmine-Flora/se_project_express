const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes"); // Import all routes from index.js

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to db"); // Removed to resolve the no-console warning
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

// Use routes from index.js
app.use(routes);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`); // Removed to resolve the no-console warning
});
