const router = require("express").Router();
const { getUser } = require("../controllers/users");

// router.get("/", getUsers);
// router.post("/", createUser);
// router.post("/login", login);
router.get("/:userId", getUser);

module.exports = router;
