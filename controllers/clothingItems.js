// const e = require("express");
const clothingItems = require("../models/clothingItem");
const {
  BAD_REQUEST,
  DEFAULT,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

const deleteClothingItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const item = await clothingItems.findById(itemId).orFail();

    if (item.owner.toString() !== userId) {
      return res
        .status(FORBIDDEN)
        .send({ message: "You do not have permission to delete this item" });
    }

    await item.remove();
    return res.status(200).send({ message: "Item deleted successfully" });
  } catch (errors) {
    console.error(errors);
    if (errors.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    if (errors.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
    }
    return res.status(DEFAULT).send({ message: errors.message });
  }
};
const createItem = async (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  try {
    const item = await clothingItems.create({ name, imageUrl, weather, owner });
    return res.status(201).send({ data: item });
  } catch (errors) {
    if (errors.name === "ValidationError") {
      // Handle validation error
      return res.status(BAD_REQUEST).send({ message: errors.message });
    }
    console.error(errors);
    return res.status(DEFAULT).send({ message: errors.message });
  }
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((errors) => {
      console.error(errors);
      return res.status(DEFAULT).send({ message: "Get items error" });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;
//   console.log(itemId, imageUrl);
//   clothingItems
//     .findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send({ message: "Update items error" });
//     });
// };

const likeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((errors) => {
      if (errors.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: errors.message });
      }
      if (errors.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: errors.message });
      }
      return res.status(DEFAULT).send({ message: "Like item error" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((errors) => {
      if (errors.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: errors.message });
      }
      if (errors.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: errors.message });
      }
      return res.status(DEFAULT).send({ message: "Dislike item error" });
    });
};

module.exports = {
  deleteClothingItem,
  createItem,
  getItems,
  likeItem,
  dislikeItem,
};
