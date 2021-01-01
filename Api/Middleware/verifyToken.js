// THIS IS THE MIDDLEWARE WICH WILL VERIFY THE TOKEN THAT WAS GENERATED WHEN LOGGED IN

const jwt = require("jsonwebtoken");
const Users = require("../Models/User");

module.exports = async function (req, res, next) {
     // WEBTOKEN IS THE TOKEN FRO THE LOCALSTORAGE ON THE BROWSER
     // LOCALTOKEN IS THE TOKEN IN THE DATA BASE USER > TOKEN
     const user = await Users.findById({ _id: req.params.id });
     const webToken = req.params.token;
     const localToken = user.token[0].token;
     // console.log(req.params.token);

     // THE IA MA CHECKING IF THE TOKEN IN THE LOCAL STORAGE WEBBROWSER IS EQUAL THE ONE THAT IS IN THE DATABASE
     if (webToken != localToken) return res.status(401).json("Acces denied. Please login fisrt");

     try {
          const verified = jwt.verify(localToken, process.env.ACCESS_TOKEN_SECRET);
          req.user = verified;
          next();
     } catch (error) {
          res.status(403).send("invalid token");
     }
};
