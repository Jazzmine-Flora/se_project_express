const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Router Not found" })
);

module.exports = router;
