/* 
NOTES:
 - LIMIT THE AMOUNT OF ADDRESSES FOR ONLY TWO WORK AND HOME



*/

const router = require("express").Router();
const User = require("../Models/User");
const Address = require("../Models/Address");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../Middleware/verifyToken");
const { addressValidation } = require("../Validation/address");

// ADD NEW ADDRESS INDIVIDUALLY *************************************************************************************

router.post("/register/:id/:token", verify, async (req, res) => {
     // GET THE RIGTH USER BASED IN HIS EMAIL SENDED BY BODY
     const user = await User.findById({ _id: req.params.id });
     if (!user) return res.status(400).json({ message: "We could not find the user informed" });

     // LETS VALIDATE THE DATA BEFORE CREATE A NEW USER ADDRESS INSTANCE
     const { error } = addressValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     try {
          if (user != null) {
               // CREATE A NEW USER ADDRESS
               const newAddress = Address({
                    user_id: req.params.id,
                    address_type: req.body.address_type,
                    street: req.body.street,
                    city: req.body.city,
                    code: req.body.code,
                    area: req.body.area,
               });
               const saveAddress = await newAddress.save();
               res.status(200).json({ message: "Address registered successfully" });
          } else {
               res.status(400).json({ message: "User does not exist" });
          }
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// GET A ADDRESS LIST BY USER ID ***********************************************************************************************

router.get("/:id/:token", verify, async (req, res) => {
     try {
          const address = await Address.find({ user_id: req.params.id });

          let addressList = [];

          for (let i = 0; i < address.length; i++) {
               const element = address[i];
               addressList.push(element);
          }

          res.json(addressList);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// GET A UNIC ADDRESS FROM  AN INDIVIDUAL USER BY ADDRESS ID ***********************************************************************************************

router.get("/:id", async (req, res) => {
     try {
          const address = await Address.findOne({ _id: req.params.id });

          res.status(201).json(address);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// UPDATE ADDRESS INDIVIDUALLY *************************************************************************************

router.patch("/update/:id/:token", verify, async (req, res) => {
     // GET THE RIGHT ADDRESS TO CHANGE
     const address = await Address.findOne({ user_id: req.params.id }).findOne({
          address_type: req.body.address_type,
     });
     if (address == null) return res.status(404).json({ message: "There is no address related to this userID" });

     // VALIDATE THE DATA BEFORE CREATE A NEW USER ADDRESS INSTANCE
     const { error } = addressValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     // UPDATE ADDRESS
     address.user_id = req.params.id;
     address.address_type = req.body.address_type;
     address.street = req.body.street;
     address.city = req.body.city;
     address.code = req.body.code;
     address.area = req.body.area;

     try {
          const saveAddress = await address.save();
          res.status(200).json({ message: "Address updated successfully" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// DELETE A ADDRESS BASED ON ITS ID *************************************************************************************

router.delete("/delete/:id", async (req, res) => {
     try {
          await Address.findByIdAndDelete({ _id: req.params.id });
          return res.status(201).send("The part was deleted from the data base");
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

module.exports = router;
