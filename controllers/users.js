const user = require("../models/user");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, likeItem, dislikeItem } = req.body;
  user
    .create({ name, avatar, likeItem, dislikeItem })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
