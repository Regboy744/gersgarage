const router = require("express").Router();
const User = require("../Models/User");
const Vehicle = require("../Models/Vehicles");
const Parts = require("../Models/StockParts");
const PartsChanged = require("../Models/PartsChanged");
const SO = require("../Models/ServiceOrders");
const verify = require("../Middleware/verifyToken");
const { partsChengedValidation } = require("../Validation/serviceOrder");
const { count } = require("../Models/PartsChanged");

// ADD NEW PART CHANGED/SOLD ON ORDER SERVICE *******************************************************************

router.post("/create/:register", verify, async (req, res) => {
     // CHECK IF THE VEHICLE EXISTS IN THE DB
     const vehicle = await Vehicle.findOne({ register: req.params.register });
     if (!vehicle) return res.status(400).json({ message: "This vehicle does not existe in the data base" });

     // CHECK IF THE PART EXISTS IN THE DB
     const part = await Parts.findById({ _id: req.body.id });
     if (!part) return res.status(400).json({ message: "This part does not existe in the data base" });

     // CHECK IF THERE IS A OPENED SERVICE ORDER FOR THIS CAR REGISTER
     const vehicle2 = await Vehicle.findOne({ register: req.params.register }).find();
     let counter;
     for (let i = 0; i < vehicle2.length; i++) {
          for (let j = 0; j < vehicle2[i].service_orders.length; j++) {
               let isOpen = vehicle2[i].service_orders[j].status;

               if (isOpen == "Open") {
                    counter = j;
               }
          }
     }

     // IF THERE IS NO ANY OPENED SERVICE ORDER SO THE SYSTEM DOES NOT CREATE A NEW LIST OF SOLD PARTS
     if (counter == null) return res.status(400).json({ message: "There is no Service Ordem opened to this Vehicle" });

     console.log(counter);
     // CREATE A NEW LIST OF PARTS TO CHANGED
     const partsChanged = PartsChanged({
          name: part.name,
          quantity: req.body.quantity,
          price: part.price,
     });

     try {
          vehicle.service_orders[counter].partsChanged.push(partsChanged);
          vehicle.save();
          res.status(200).json({ message: "Part registered successfully" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

module.exports = router;
