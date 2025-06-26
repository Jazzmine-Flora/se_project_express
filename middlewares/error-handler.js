function errorHandler(err, req, res, next) {
  // Log the error for debugging purposes
  // console.error(err); // Remove or replace with a logger in production

  // Celebrate/Joi validation error details
  if (err.joi) {
    return res.status(400).json({
      message: err.message,
      details: err.details,
      validation: err.validation,
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "An error occurred on the server" : err.message;

  return res.status(statusCode).json({ message });
}

module.exports = errorHandler;
