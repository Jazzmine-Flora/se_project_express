const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res) => res.status(500).send({ message: "Router Not found" }));

module.exports = router;
