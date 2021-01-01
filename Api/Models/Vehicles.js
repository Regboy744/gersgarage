const mongoose = require("mongoose");

// Import subdocuments
const serviceOrdersSchema = require("./ServiceOrders").schema;
const userSchema = require("./User").schema;

const vehicleSchema = new mongoose.Schema({
  user_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: userSchema }],
  make: String,
  model: String,
  year: String,
  register: String,
  engine: String,
  service_orders: [serviceOrdersSchema],
});

module.exports = mongoose.model("Vehicles", vehicleSchema);
