const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const errors = require("../utils/errors");

router.use("/clothingItems", clothingItem);
router.use("/users", userRouter);

router.use(() => errors.NOT_FOUND.send({ message: "Router Not found" }));

module.exports = router;
