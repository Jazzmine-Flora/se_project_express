function errorHandler(err, req, res, next) {
  // Log the error for debugging purposes
  console.error(err); // Consider replacing with a logger or removing in production
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
