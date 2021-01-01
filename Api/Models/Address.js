const mongoose = require("mongoose");

//Import relational Schema
const userSchema = require("./User").schema;

const addressSchema = new mongoose.Schema({
  user_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: userSchema }],
  address_type: String,
  street: String,
  city: String,
  code: String,
  area: String,
});

module.exports = mongoose.model("Addresses", addressSchema);
