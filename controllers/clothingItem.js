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

module.exports = { createItem };
