const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: String,
});

module.exports = mongoose.model("Roles", roleSchema);
