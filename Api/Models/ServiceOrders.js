const mongoose = require("mongoose");

// Import subdocuments
const partChangedSchema = require("./PartsChanged").schema;

const serviceOrdersSchema = new mongoose.Schema({
     status: String,
     service_type: String,
     mechanic_name: String,
     issue_description: String,
     start_date: Date,
     end_date: Date,
     service_cost: Number,
     partsChanged: [partChangedSchema],
});

module.exports = mongoose.model("Order_Service", serviceOrdersSchema);
