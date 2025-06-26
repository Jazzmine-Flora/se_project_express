const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/NotFoundError");

// const auth = require("../middlewares/auth");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

// Public route for getting all items
router.use("/items", clothingItemRouter);

// Protected routes
// router.use(auth);
router.use("/users", userRouter);

// Centralized error for unknown routes
router.use((req, res, next) => {
  next(new NotFoundError("Route Not found"));
});

module.exports = router;
