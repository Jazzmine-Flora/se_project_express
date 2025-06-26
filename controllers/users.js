const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");

// CREATE user
const createUser = async (req, res, next) => {
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
      // Duplicate email error
      return next(new ConflictError("Email already exists"));
    }
    if (errors.name === "ValidationError") {
      // Validation error
      return next(new BadRequestError(errors.message));
    }
    return next(errors);
  }
};

// GET current user
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((userData) => res.status(200).send({ data: userData }))
    .catch((errors) => {
      if (errors.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (errors.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(errors);
    });
};

// UPDATE user
const updateUser = async (req, res, next) => {
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
    if (errors.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }
    if (errors.name === "ValidationError") {
      return next(new BadRequestError(errors.message));
    }
    return next(errors);
  }
};

// LOGIN user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (errors) {
    if (errors.message === "Invalid email or password") {
      return next(new UnauthorizedError("Invalid email or password"));
    }
    return next(errors);
  }
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
