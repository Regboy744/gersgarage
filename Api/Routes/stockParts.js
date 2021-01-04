const router = require("express").Router();
const User = require("../Models/User");
const Parts = require("../Models/StockParts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../Middleware/verifyToken");
const { stockPartsValidation } = require("../Validation/stockParts");

// ADD NEW PART  *************************************************************************************

router.post("/create", async (req, res) => {
     // VALIDATE THE DATA BEFORE CREATE A NEW USER
     const { error } = stockPartsValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     // CHECK IF A PART IF SAME FACTORY CODE EXISTS IN THE DB
     const parts = await Parts.findOne({ factory_ref: req.body.factory_ref });
     if (parts) return res.status(400).json({ message: "This part already existe in the data base" });

     const newPart = Parts({
          factory_ref: req.body.factory_ref,
          category: req.body.category,
          make: req.body.make,
          model: req.body.model,
          variante: req.body.variante,
          engine: req.body.engine,
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          quantity: req.body.quantity,
     });
     try {
          const part = await newPart.save();
          res.status(200).json({ message: "New Part registered successfully" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// GET ALL PARTS FROM THE DB  *************************************************************************************

router.get("/", async (req, res) => {
     try {
          const parts = await Parts.find();
          if (!parts) return res.status(400).send("There is no parts in the Stock");
          res.status(201).json(parts);
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// GET A PART BASED ON ITS ID *************************************************************************************

router.get("/:id", async (req, res) => {
     try {
          const part = await Parts.findOne({ _id: req.params.id });
          if (!part) return res.status(400).send("This part doe not existe in the data base");
          res.status(201).json(part);
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// UP DATE A PART BY ITS ID  *************************************************************************************

router.patch("/update/:id", async (req, res) => {
     // VALIDATE THE DATA BEFORE UPDATE THE PART
     const { error } = stockPartsValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     //GET THE RIGHT PART BASE ON ITS ID
     const part = await Parts.findOne({ _id: req.params.id });
     if (!part) return res.status(400).json({ message: "This part does not existe in the data base" });

     // UPDATE PART

     part.factory_ref = req.body.factory_ref;
     part.category = req.body.category;
     part.make = req.body.make;
     part.model = req.body.model;
     part.variante = req.body.variante;
     part.engine = req.body.engine;
     part.name = req.body.name;
     part.description = req.body.description;
     part.price = req.body.price;
     part.quantity = req.body.quantity;

     try {
          const updatePart = await part.save();
          res.status(200).json({ message: "Part updated successfully" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// DELETE A PART BASED ON ITS ID *************************************************************************************

router.delete("/delete/:id", async (req, res) => {
     try {
          const part = await Parts.findOneAndDelete({ _id: req.params.id });
          return res.status(201).send("The part was deleted from the data base");
          part.save();
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

module.exports = router;
