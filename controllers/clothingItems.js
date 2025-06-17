const clothingItems = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

// DELETE item
const deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const item = await clothingItems.findById(itemId).orFail();

    if (item.owner.toString() !== userId) {
      return next(
        new ForbiddenError("You do not have permission to delete this item")
      );
    }

    await item.remove();
    return res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

// CREATE item
const createItem = async (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  try {
    const item = await clothingItems.create({ name, imageUrl, weather, owner });
    return res.status(201).send({ data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

// GET all items
const getItems = (req, res, next) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));
};

// LIKE item
const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
};

// DISLIKE item
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(err);
    });
};

module.exports = {
  deleteClothingItem,
  createItem,
  getItems,
  likeItem,
  dislikeItem,
};
