const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
// const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", login);

// Public route for getting all items
router.use("/items", clothingItemRouter);

// Protected routes
// router.use(auth);
router.use("/users", userRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Route Not found" })
);

module.exports = router;
