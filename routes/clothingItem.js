const router = require("express").Router();

const { createItem, getItems } = require("../controllers/clothingItem");

router.post("/", createItem);

router.get("/", getItems);

module.exports = router;
