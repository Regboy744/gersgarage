// Create an express instance
const express = require("express");

//Require Cors
const cors = require("cors");

// We gonna run the express function and  we will use it on app to run our server.
const app = express();

// Now lets require our mongoose library and instance it for mongoose variable.
const mongoose = require("mongoose");

//Create an enviroment
const dotenv = require("dotenv");

dotenv.config();

// Server config
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

require("dotenv").config({ path: "MONGO_URI" });

//Connect to the data base using mogoose.
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Check if we are connected to the data base if not we will have a error showed
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to the database"));

// Listener and returnes if everything is working nice
app.listen(port, hostname, () => {
     console.log(`Server working fine at http://${hostname}:${port}/`);
});

app.use(cors());
// Set our server to accept jason
app.use(express.json());

// Serve our new ./public/index.html
app.use("/", express.static("./public"));

app.get("/", function (req, res) {
     res.setHeader("x-key-pey", "gzip");
});

// Starting Routers Logic
const userRouter = require("./Api/Routes/user");
const addressRouter = require("./Api/Routes/address");
const stockRouter = require("./Api/Routes/stockParts");
const vehicleRouter = require("./Api/Routes/vehicle");
const soRouter = require("./Api/Routes/serviceOrder");
const partsChangedRouter = require("./Api//Routes/partsChanged");

/* USERS PERMITIONS TOUTES  */

//USERS
app.use("/user", userRouter);

//ADDRESS
app.use("/address", addressRouter);

//STOCK PARTS
app.use("/stock", stockRouter);

//VEHICLE
app.use("/vehicles", vehicleRouter);

//SERVICES ORDER
app.use("/servicesorder", soRouter);

// PARTS CHANGED
app.use("/partschanged", partsChangedRouter);
