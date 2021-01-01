const Joi = require("@hapi/joi");

//REGISTER VALIDATION
const registerValidation = (data) => {
     const schema = {
          name: Joi.string().min(3).required(),
          email: Joi.string().min(8).required().email(),
          phone: Joi.string().min(7).required(),
          user_type: Joi.string().min(5).required(),
          password: Joi.string().min(5).required(),
     };
     return Joi.validate(data, schema);
};

// LOGIN VALIDATION
const mainValidation = (data) => {
     const schema = {
          email: Joi.string().min(6).required().email(),
          password: Joi.string().min(6).required(),
     };
     return Joi.validate(data, schema);
};

// UPDATE USER
const userUpdateValidation = (data) => {
     const schema = {
          id: Joi.string().required(),
          name: Joi.string().min(3).required(),
          email: Joi.string().min(8).required().email(),
          phone: Joi.string().min(7).required(),
          user_type: Joi.string().min(5).required(),
          password: Joi.string().min(5).required(),
     };
     return Joi.validate(data, schema);
};

// REFRESH TOKEN VALIDATION
const refresTokenValidation = (data) => {
     const schema = {
          refreshToken: Joi.string().min(149).max(149).required(),
     };
     return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.mainValidation = mainValidation;
module.exports.userUpdateValidation = userUpdateValidation;
module.exports.refresTokenValidation = refresTokenValidation;
