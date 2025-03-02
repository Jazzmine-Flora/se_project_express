const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { createUser } = require("../controllers/users");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.post("/", createUser);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Router Not found" })
);

module.exports = router;
