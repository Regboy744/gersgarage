const mongoose = require("mongoose");

const token = require("./Token").schema;
const roleSchema = require("../Models/Role").schema;

const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     phone: String,
     user_type: String,
     password: String,
     token: [token],
});

module.exports = mongoose.model("Users", userSchema);
