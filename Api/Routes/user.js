const router = require("express").Router();
const Users = require("../Models/User");
const Addresss = require("../Models/Address");
const Vehicles = require("../Models/Vehicles");
const Roles = require("../Models/Role");
const Token = require("../Models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../Middleware/verifyToken");

const { registerValidation, mainValidation, userUpdateValidation } = require("../Validation/user");
const Role = require("../Models/Role");

// ADD NEW USER INDIVIDUALLY ************************************************************************************

router.post("/signup", async (req, res) => {
     // LETS VALIDATE THE DATA BEFORE CREATE A NEW USER
     const { error } = registerValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     // CHECK IF EMAIL IS ALREADY IN THE DATABASE
     const emailExist = await Users.findOne({ email: req.body.email });
     if (emailExist) return res.status(400).json({ message: "The email " + req.body.email + " is not available" });

     // HASH PASSWORDS
     const salt = await bcrypt.genSalt(10);
     const hashedPassord = await bcrypt.hash(req.body.password, salt);

     // CREATE A NEW USER
     const user = Users({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          user_type: req.body.user_type,
          password: hashedPassord,
     });
     try {
          const saveUser = await user.save();
          res.status(200).json({ message: "User registered successfully" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// LOGIN  *******************************************************************************************************

router.post("/signin", async (req, res) => {
     try {
          // LETS VALIDATE THE DATA BEFORE LOGIN
          const { error } = mainValidation(req.body);
          if (error) return res.status(400).json({ message: error.details[0].message });

          // CHECK IF EMAIL IS ALREADY IN THE DATABASE
          const user = await Users.findOne({ email: req.body.email });
          if (!user) return res.status(400).send({ message: "The email " + req.body.email + " was not found" });
          // CHECK PASSOWRD IS CORRECT
          const validPass = await bcrypt.compare(req.body.password, user.password);
          if (!validPass) return res.status(400).json({ message: " Password Incorrect" });

          // CHECK IF IS THERE ANY TOKEN

          // if (checktokens) return res.status(400).json({ message: " Tokens deleted" });

          //CREATE AND ASIGN A TOKEN

          const newToken = Token({
               token: jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET),
          });

          // EREASE THE TOKEN

          for (let i = 0; i <= user.token.length; i++) {
               const element = user.token[i];

               user.token.pull(element);
          }

          res.send({
               id: user._id,
               user_type: user.user_type,
               accessToken: newToken.token,
               name: user.name,
          });

          user.token.push(newToken);
          user.save();
     } catch (error) {
          res.status(401).send({ message: error.message });
     }
});

// LOG OUT  *****************************************************************************************************

router.post("/signout/:id", async (req, res) => {
     // CHECK IF EMAIL IS ALREADY IN THE DATABASE

     const user = await Users.findOne({ _id: req.params.id });
     if (!user) return res.status(400).send("User not found");

     for (let i = 0; i <= user.token; i++) {
          user.token.pull("");
     }

     console.log("Erase token data base");
});

// GET ALL USERS *************************************************************************************************

router.get("/all", async (req, res) => {
     try {
          const users = await Users.find();
          res.json(users);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// GET USER BY ID *************************************************************************************************

router.get("/:id/:token", verify, async (req, res) => {
     // console.log(req.params.id);
     // console.log(req.params.token);
     try {
          const users = await Users.findById({ _id: req.params.id });
          res.json(users);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// GET ROLES *************************************************************************************************

router.get("/roles", async (req, res) => {
     console.log("hey there");
     try {
          const roles = await Roles.find();
          res.json(roles);
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
});

// UPDATE A USER *************************************************************************************************

router.patch("/update/", async (req, res) => {
     // GET THE RIGTH USER BASED IN HIS EMAIL SENDED BY BODY
     const user = await Users.findById({ _id: req.body.id });
     if (!user) return res.status(401).json({ message: "User informed was not found" });

     // VALIDATE THE DATA BEFORE UPDATE
     const { error } = userUpdateValidation(req.body);
     if (error) return res.status(400).json({ message: error.details[0].message });

     // HASH PASSWORDS
     const salt = await bcrypt.genSalt(10);
     const hashedPassord = await bcrypt.hash(req.body.password, salt);

     // UPDATE USER

     user.name = req.body.name;
     user.email = req.body.email;
     user.phone = req.body.phone;
     user.user_type = req.body.user_type;
     user.password = hashedPassord;

     try {
          const updateUser = await user.save();
          res.status(200).json({ message: "User updated successfully" });
     } catch (error) {
          res.status(400).json({ message: error.message });
     }
});

// DELETE ACCOUNT  ***********************************************************************************************

router.delete("/accountdelete", verify, async (req, res) => {
     try {
          // LETS VALIDATE THE DATA BEFORE PROCEED
          const { error } = mainValidation(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          // CHECK IF EMAIL IS iN THE DATABASE
          const user = await Users.findOne({ email: req.body.email });
          if (!user) return res.status(400).send("Email not found");

          // CHECK PASSOWRD IS CORRECT
          const validPass = await bcrypt.compare(req.body.password, user.password);
          if (!validPass) return res.status(400).send("Invalid password");

          // REMOVE ADDRESS
          const address = await Addresss.findOneAndDelete({ user_id: req.user._id });
          if (!address) return res.status(400).send("Address not found");

          // REMOVE VEHICLES
          const vehicles = await Vehicles.findOneAndDelete({ user_id: req.user._id });
          if (!vehicles) return res.status(400).send("Vehicle not found");

          // REMOVE USER
          const userRemove = await Users.findOneAndDelete({ _id: req.user._id });
          if (!userRemove) return res.status(400).send("User not found");

          userRemove.save();
          vehicles.save();
          address.save();

          return res.status(200).json(vehicles);
     } catch (error) {
          res.status(400).send({ message: error.message });
     }
});

module.exports = router;
