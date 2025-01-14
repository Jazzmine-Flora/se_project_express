const user = require("../models/user");

const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((errors) => {
      console.error(errors);
      return res.status(DEFAULT).send({ message: errors.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, likeItem, dislikeItem } = req.body;
  user
    .create({ name, avatar, likeItem, dislikeItem })
    .then(() => res.status(201).send({ message: "User created" }))
    .catch((errors) => {
      console.error(errors);
      if (errors.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: errors.message });
      }
      return DEFAULT.send({ message: errors.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    .then(() => res.status(200).send({ data: user }))
    .catch((errors) => {
      console.error(errors);
      if (errors.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: errors.message });
      }
      if (errors.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: errors.message });
      }
      return DEFAULT.send({ message: errors.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
