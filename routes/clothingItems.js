const router = require("express").Router();

const {
  deleteClothingItem,
  createItem,
  getItems,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

// Create a clothing item (validate body)
router.post("/", auth, validateCardBody, createItem);

// Get all items
router.get("/", getItems);

// Delete a clothing item (validate itemId param)
router.delete("/:itemId", auth, validateId, deleteClothingItem);

// Like a clothing item (validate itemId param)
router.put("/:itemId/likes", auth, validateId, likeItem);

// Dislike a clothing item (validate itemId param)
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
