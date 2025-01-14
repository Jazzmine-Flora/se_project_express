// const e = require("express");
const clothingItems = require("../models/clothingItem");
const { BAD_REQUEST, DEFAULT, NOT_FOUND } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, weather, imageUrl, owner: req.user.Id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((errors) => {
      if (errors.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT).send({ message: "Create item error" });
    });
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItems
    .findByIdAndRemove(itemId)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((errors) => {
      if (errors.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: errors.message });
      }
      if (errors.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: errors.message });
      }
      return res.status(500).send({ message: "Delete item error" });
    });
};

const likeItem = (req, res) => {
  const { Id } = req.params;
  clothingItems
    .findByIdAndUpdate(Id, { $addToSet: { likes: req.user.Id } }, { new: true })
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
  const { Id } = req.params;
  clothingItems
    .findByIdAndUpdate(Id, { $pull: { likes: req.user.Id } }, { new: true })
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
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
