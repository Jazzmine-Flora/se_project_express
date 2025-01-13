const clothingItems = require("../models/clothingItem");
const errors = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItems
    .create({ name, weather, imageUrl, owner: req.user._Id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return errors.BAD_REQUEST.send({ message: err.message });
      }
      return errors.DEFAULT.send({ message: err.message });
    });
};

const getItems = (req, res) => {
  clothingItems
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Get items error" });
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
    .catch((err) => {
      if (err.name === "CastError") {
        return errors.BAD_REQUEST.send({ message: err.message });
      }
      console.error(err);
      errors.DEFAULT.send({ message: "Delete items error" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(
      Id,
      { $addToSet: { likes: req.user._Id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return errors.BAD_REQUEST.send({ message: err.message });
      }
      console.error(err);
      res.status(500).send({ message: "Like items error" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItems
    .findByIdAndUpdate(Id, { $pull: { likes: req.user._Id } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Dislike items error" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
