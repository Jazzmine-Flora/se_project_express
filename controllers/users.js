const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
} = require("../utils/errors");

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((errors) => {
      console.error(errors);
      return res.status(DEFAULT).send({ message: errors.message });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, likeItem, dislikeItem, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      name,
      avatar,
      likeItem,
      dislikeItem,
      email,
      password: hashedPassword,
    });

    res.status(201).send({ message: "User created" });
  } catch (errors) {
    if (errors.code === 11000) {
      // Handle duplicate email error
      return res.status(409).send({ message: "Email already exists" });
    }
    console.error(errors);
    res.status(400).send({ message: errors.message });
  }
};

// const createUser = (req, res) => {
//   const { name, avatar, likeItem, dislikeItem, email, password } = req.body;
//   user
//     .create({ name, avatar, likeItem, dislikeItem })
//     .then(() => res.status(201).send({ message: "User created" }))
//     .catch((errors) => {
//       console.error(errors);
//       if (errors.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: errors.message });
//       }
//       return res.status(DEFAULT).send({ message: errors.message });
//     });
// };

const getUser = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    .then((userData) => res.status(200).send({ data: userData }))
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (errors) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Invalid email or password" });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
};
