const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },

  likeItem: {
    type: Number,
    default: 0,
  },

  dislikeItem: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
