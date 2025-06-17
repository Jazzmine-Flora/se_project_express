const { JWT_SECRET = "secret_key" } = process.env;

// console.log("JWT_SECRET:", JWT_SECRET); // Log the JWT secret for debugging purposes
module.exports = {
  JWT_SECRET,
};
