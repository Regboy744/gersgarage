const router = require("express").Router();
const User = require("../Models/User");
const Vehicle = require("../Models/Vehicles");
const SO = require("../Models/ServiceOrders");
const verify = require("../Middleware/verifyToken");
const verifyAvaibility = require("../Middleware/verifyAvaibility");
const dateFormat = require("dateformat");

const { serviceOrderValidation } = require("../Validation/serviceOrder");

// CREATE A NEW SERVICE ORDER BASED ON THE REGISTER NUMBER **********************************************************

router.post("/register", verifyAvaibility, async (req, res) => {
     // VALIDATE IF THERE IS A VEHICLE WITH THE SAME REGISTER ON THE DATA BASE
     const vehicle = await Vehicle.findById({ _id: req.body.v_id });
     if (!vehicle) return res.status(400).json({ message: "This vehicle does not existe in the data base" });

     // VALIDATE IF THERE IS A OPEN SERVICE ORDEM FOR THIS CAR REGISTER
     const vehicle2 = await Vehicle.findById({ _id: req.body.v_id }).find();

     for (let i = 0; i < vehicle2.length; i++) {
          for (let j = 0; j < vehicle2[i].service_orders.length; j++) {
               let count;

               let isOpen = vehicle2[i].service_orders[j].status;

               if (isOpen == "Open") {
                    count = j;
                    console.log(count);
               }

               // IF THERE IS ANY OPENED SERVICE ORDER  FOR THIS VEHICLE THE SYSTEM DOES NOT CREATE A NEW SO FOR THIS VEHICLE
               if (count >= 0) return res.status(400).json({ message: "There is Service Ordem opened to this Vehicle" });
          }
     }

     // CREATEA A NEW SERVICE ORDER
     const newSo = SO({
          status: req.body.status,
          service_type: req.body.service_type,
          mechanic_name: req.body.mechanic_name,
          issue_description: req.body.issue_description,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          service_cost: req.body.service_cost,
     });

     try {
          vehicle.service_orders.push(newSo);
          vehicle.save();
          res.status(201).json({ message: "Booking done" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// GET ALL SERVICE ORDERS (MECANICH VIEW)********************************************************************************

router.get("/:id/:token", verify, async (req, res) => {
     try {
          const vehicle = await Vehicle.find();

          let serviceOrdersArray = [];

          for (let i = 0; i < vehicle.length; i++) {
               for (let j = 0; j < vehicle[i].service_orders.length; j++) {
                    serviceOrdersArray.push(vehicle[i].service_orders[j]);
               }
          }

          res.json(serviceOrdersArray);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// GET ALL DATE TO SHOW AVAIBILITY ********************************************************************************

router.get("/availability", async (req, res) => {
     try {
          const vehicle = await Vehicle.find();
          if (!vehicle) return res.status(400).send({ message: "There is now a car for this user" });

          let bookingDates = [];

          for (let i = 0; i < vehicle.length; i++) {
               for (let j = 0; j < vehicle[i].service_orders.length; j++) {
                    bookingDates.push(vehicle[i].service_orders[j].start_date);
               }
          }
          console.log(bookingDates);
          res.json(bookingDates);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// GET A SIGLE SERVICE ORDER BY ITS ID (MECHANIC VIEW) ************************************************************************************************
router.get("/:s_id/:token/:id", async (req, res) => {
     try {
          const vehicle = await Vehicle.find();

          let serviceOrdersArray = [];

          for (let i = 0; i < vehicle.length; i++) {
               for (let j = 0; j < vehicle[i].service_orders.length; j++) {
                    if (vehicle[i].service_orders[j]._id == req.params.s_id) {
                         serviceOrdersArray.push(vehicle[i].service_orders[j]);
                    }
               }
          }

          console.log(serviceOrdersArray);
          res.status(201).json(serviceOrdersArray[0]);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// UPDATE SERVICE ORDER BY VEHICLE REGISTER NUMBER *******************************************************************

router.patch("/update/:userid/:token", async (req, res) => {
     try {
          const vehicle = await Vehicle.find({});

          for (let i = 0; i < vehicle.length; i++) {
               for (let j = 0; j < vehicle[i].service_orders.length; j++) {
                    if (req.body.serviceOrderId == vehicle[i].service_orders[j]._id) {
                         console.log(vehicle[i].service_orders[j]._id);
                         vehicle[i].service_orders[j].status = req.body.status;
                         vehicle[i].service_orders[j].service_type = req.body.service_type;
                         vehicle[i].service_orders[j].mechanic_name = req.body.mechanic_name;
                         vehicle[i].service_orders[j].start_date = req.body.start_date;
                         vehicle[i].service_orders[j].end_date = req.body.end_date;
                         vehicle[i].service_orders[j].service_cost = req.body.service_cost;

                         const updateSo = await vehicle[i].save();
                    }
               }
          }
          res.status(200).json({ message: "Vehicle registered successfully" });
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

module.exports = router;
