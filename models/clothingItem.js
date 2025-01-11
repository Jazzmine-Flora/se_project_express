const mongoose = require("mongoose");
// const validator = require("validator");
const clothingItemSchema = new mongoose.Schema();

module.exports = mongoose.model("item", clothingItemSchema);
