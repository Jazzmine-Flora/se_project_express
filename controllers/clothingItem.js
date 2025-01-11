const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Get items error", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  console.log(itemId, imageURL);
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Update items error", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Delete items error", err });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(itemId, { $inc: { likes: 1 } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Like items error", err });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(itemId, { $inc: { likes: -1 } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Dislike items error", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
