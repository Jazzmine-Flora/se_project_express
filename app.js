const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const routes = require("./routes"); // Import all routes from index.js
const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

const allowedOrigins = [
  "https://www.wat2wear.twilightparadox.com",
  "https://wat2wear.twilightparadox.com",
  "http://localhost:3000", // for local dev, optional
];

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // console.log("Connected to db"); // Removed to resolve the no-console warning
  })
  .catch(console.error);

app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you use cookies or Authorization headers
  })
);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger); // before routes
// Use routes from index.js
app.use(routes);

app.use(errorLogger);
app.use(errors());
// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
}); // Removed to resolve the no-console warning
