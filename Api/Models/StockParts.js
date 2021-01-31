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
     price: String,
     quantity: String,
});

module.exports = mongoose.model("StockParts", stockPartsSchema);
