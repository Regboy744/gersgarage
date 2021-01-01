const router = require("express").Router();
const User = require("../Models/User");
const Vehicle = require("../Models/Vehicles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../Middleware/verifyToken");
const { vehicleValidation } = require("../Validation/vehicle");

// "node-sass": "^4.5.3",
// "sass-loader": "^6.0.6",

// ADD NEW VEHICLE  **************************************************************************************************

router.post("/register/:id/:token", verify, async (req, res) => {
     console.log(req.params.id);
     // VALIDATE THE DATA BEFORE CREATE A NEW USER
     const { error } = vehicleValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     // CHECK IF THE VEHICLE EXISTS IN THE DB
     const vehicle = await Vehicle.findOne({ register: req.body.register });
     if (vehicle) return res.status(400).json({ message: "This vehicle already existe in the data base" });

     const newVehicle = Vehicle({
          user_id: req.params.id,
          make: req.body.make,
          model: req.body.model,
          year: req.body.year,
          register: req.body.register,
          engine: req.body.engine,
     });
     try {
          const vehicle = await newVehicle.save();
          res.status(201).json({ message: "Vehicle registered" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// GET A SIGLE VEHICLES BY ITS ID  ************************************************************************************************
// HERE I NEEDED TO USER VEHICLE ID = :vid and USER ID = :id FOR SECURITY PROPOSES
router.get("/edit/:vid/:token/:id", verify, async (req, res) => {
     try {
          const vehicles = await Vehicle.findOne({ _id: req.params.vid });
          res.status(201).json(vehicles);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// GET LIST OF VEHICLES BY USER  *****************************************************************************************

router.get("/:id/:token", verify, async (req, res) => {
     try {
          const vehicles = await Vehicle.find({ user_id: req.params.id });
          if (!vehicles) return res.status(400).send("There is now a car for this user");

          let vehiclesArray = [];
          for (let i = 0; i < vehicles.length; i++) {
               vehiclesArray.push(vehicles[i]);
          }

          res.json(vehiclesArray);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// UPDATE A VEHICLE BY ID ********************************************************************************************

router.patch("/update/:id/:token", verify, async (req, res) => {
     // GET THE RIGHT VEHICLE
     const vehicle = await Vehicle.find({ user_id: req.params.id });
     if (!vehicle) return res.status(400).json({ message: "There is now a car for this user" });
     console.log(vehicle);
     try {
          for (let i = 0; i < vehicle.length; i++) {
               if (vehicle[i]._id == req.body.vid) {
                    // UPDATE THE VEHICLE WITH THE DATA FROM THE BODY

                    vehicle[i].make = req.body.make;
                    vehicle[i].model = req.body.model;
                    vehicle[i].year = req.body.year;
                    vehicle[i].register = req.body.register;
                    vehicle[i].engine = req.body.engine;

                    const updateVehicle = await vehicle[i].save();
                    res.send(updateVehicle);
               }
          }
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// DELETE A VEHICLE BASED ON ITS ID *************************************************************************************

router.delete("/delete/:id", async (req, res) => {
     try {
          await Vehicle.findByIdAndDelete({ _id: req.params.id });
          return res.status(201).send("The vehicle was deleted from the data base");
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

module.exports = router;
