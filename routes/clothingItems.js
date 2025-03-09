const router = require("express").Router();

const {
  deleteClothingItem,
  createItem,
  getItems,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.post("/", auth, createItem); // Apply auth middleware
router.get("/", getItems);
router.delete("/:itemId", auth, deleteClothingItem); // Apply auth middleware
router.put("/:itemId/likes", auth, likeItem); // Apply auth middleware
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
