const router = require("express").Router();
const User = require("../Models/User");
const Vehicle = require("../Models/Vehicles");
const SO = require("../Models/ServiceOrders");
const verify = require("../Middleware/verifyToken");
const verifyAvaibility = require("../Middleware/verifyAvaibility");
const { serviceOrderValidation } = require("../Validation/serviceOrder");

// CREATE A NEW SERVICE ORDER BASED ON THE REGISTER NUMBER **********************************************************

router.post("/register", verifyAvaibility, async (req, res) => {
     // // VALIDATE THE DATA BEFORE CREATE A NEW SERVICE ORDER
     // const { error } = serviceOrderValidation(req.body);
     // if (error) return res.status(400).json({ message: error.details[0].message });

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

// GET ALL SERVICE ORDERS BY ITS USER ********************************************************************************

router.get("/", verify, async (req, res) => {
     try {
          const vehicle = await Vehicle.findOne({ user_id: req.user._id }).find();

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
          if (!vehicle) return res.status(400).send("There is now a car for this user");

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

// UPDATE SERVICE ORDER BY VEHICLE REGISTER NUMBER *******************************************************************

router.patch("/update/:register", verify, async (req, res) => {
     try {
          // VALIDATE THE DATA BEFORE CREATE A NEW SERVICE ORDER
          const { error } = serviceOrderValidation(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const vehicle = await Vehicle.findOne({ register: req.params.register }).find();

          for (let i = 0; i < vehicle.length; i++) {
               for (let j = 0; j < vehicle[i].service_orders.length; j++) {
                    // UPDATE THE SERVICE ORDER BASED ON THE CAR REGISTER NUMBER
                    vehicle[i].service_orders[j].status = req.body.status;
                    vehicle[i].service_orders[j].mechanic_name = req.body.mechanic_name;
                    vehicle[i].service_orders[j].issue_description = req.body.issue_description;
                    vehicle[i].service_orders[j].start_date = req.body.start_date;
                    vehicle[i].service_orders[j].end_date = req.body.end_date;
                    vehicle[i].service_orders[j].service_cost = req.body.service_cost;

                    const updateSo = await vehicle[i].save();

                    res.send(updateSo);
                    console.log(vehicle[i].service_orders[j]);
               }
          }
          res.status(200).json({ message: "Vehicle registered successfully" });
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

module.exports = router;
