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

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).send(userWithoutPassword); // Return the created user
  } catch (errors) {
    if (errors.code === 11000) {
      // Handle duplicate email error
      return res.status(409).send({ message: "Email already exists" });
    }
    console.error(errors);
    res.status(400).send({ message: errors.message });
  }
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  console.log("User ID:", userId);
  User.findById(userId)
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
      return res.status(DEFAULT).send({ message: errors.message });
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

    res.status(200).send({ data: updatedUser });
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

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (errors) {
    console.error(errors);
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Invalid email or password" });
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
