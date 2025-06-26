const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
// const { celebrate, Joi } = require("celebrate");
const { validateUserUpdate } = require("../middlewares/validation");
// const { validate } = require("../models/user");

// Validation middleware for updating user profile
// const validateUpdateUser = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30).required(),
//     avatar: Joi.string().uri().required(),
//   }),
// });

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
