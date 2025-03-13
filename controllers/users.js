const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(201).send(userWithoutPassword);
  } catch (errors) {
    if (errors.code === 11000) {
      // Handle duplicate email error
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    if (errors.name === "ValidationError") {
      // Handle validation error
      return res.status(BAD_REQUEST).send({ message: errors.message });
    }
    console.error(errors);
    return res.status(DEFAULT).send({ message: errors.message }); // Use DEFAULT for 500 status code
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((userData) => res.status(200).send({ data: userData }))
    .catch((errors) => {
      console.error(errors);
      if (errors.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (errors.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      }
      return res.status(DEFAULT).send({ message: errors.message }); // Use DEFAULT for 500 status code
    });
};

const updateUser = async (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    ).orFail();

    return res.status(200).send({ data: updatedUser });
  } catch (errors) {
    console.error(errors);
    if (errors.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    if (errors.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: errors.message });
    }
    return res.status(DEFAULT).send({ message: errors.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (errors) {
    console.error(errors);
    if (errors.message === "Invalid email or password") {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }
    return res.status(DEFAULT).send({ message: errors.message });
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
