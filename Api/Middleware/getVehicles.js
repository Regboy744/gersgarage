const Vehicle = require("../Models/Vehicles");
const User = require("../Models/User");
const dateFormat = require("dateformat");

module.exports = async function (req, res, next) {
     // VARIABLES

     let numberOfMechanics = 0;
     let majorService = 0;
     let standardService = 0;
     let serviceCapacity = 4; // 4 SERVICES PER DAY   -  MAJOR REPAIR IS DOUBLE

     // COUNT THE NUMBER OF MECHANICS
     const user = await User.find();

     for (let i = 0; i < user.length; i++) {
          if (user[i].user_type === "mechanic") {
               numberOfMechanics = numberOfMechanics + 1;
          }
     }

     // GET ALL VEHICLES IN THE SYSTEM
     const vehicle = await Vehicle.find();
     if (!vehicle) return res.status(401).json("Vehicle not Found");

     // COUNT THE SERVICES IN THE REQUESTED DAY
     // MAJOR SERVICE HAS 2 AS A VALUE THE OTHER HAVE 1

     for (let i = 0; i < vehicle.length; i++) {
          for (let j = 0; j < vehicle[i].service_orders.length; j++) {
               let serviceType = vehicle[i].service_orders[j].service_type;
               let bookingDate = dateFormat(vehicle[i].service_orders[j].start_date, "yy, mm, dd");
               let requiredDate = dateFormat(req.body.start_date, "yy, mm, dd");

               if (serviceType === "major_repair" && bookingDate === requiredDate) {
                    majorService = majorService + 2;
               }
          }
     }

     for (let i = 0; i < vehicle.length; i++) {
          for (let j = 0; j < vehicle[i].service_orders.length; j++) {
               let serviceType = vehicle[i].service_orders[j].service_type;
               let bookingDate = dateFormat(vehicle[i].service_orders[j].start_date, "yy, mm, dd");
               let requiredDate = dateFormat(req.body.start_date, "yy, mm, dd");

               if (serviceType !== "major_repair" && bookingDate === requiredDate) {
                    standardService = standardService + 1;
               }
          }
     }

     // // CHECK AVAILABILITY
     console.log(majorService + standardService);
     console.log(serviceCapacity * numberOfMechanics);

     try {
          if (majorService + standardService >= serviceCapacity * numberOfMechanics)
               return res.status(400).json({ message: "Day totally booked, pick another day" });

          next();
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
};
