const mongoose = require("mongoose");

const partChangedSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
});

module.exports = mongoose.model("PartsChanged", partChangedSchema);
