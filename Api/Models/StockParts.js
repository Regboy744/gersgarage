const mongoose = require("mongoose");

const stockPartsSchema = new mongoose.Schema({
  factory_ref: String,
  category: String,
  make: String,
  model: String,
  variante: String,
  engine: String,
  name: String,
  description: String,
  price: Number,
  quantity: Number,
});

module.exports = mongoose.model("StockParts", stockPartsSchema);
