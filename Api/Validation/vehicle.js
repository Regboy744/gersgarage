const Joi = require("@hapi/joi");

//REGISTER VALIDATION
const vehicleValidation = (data) => {
  const schema = {
    make: Joi.string().min(2).required(),
    model: Joi.string().min(2).required(),
    year: Joi.string().min(4).required(),
    register: Joi.string().min(5).required(),
    engine: Joi.string().min(2).required(),
  };
  return Joi.validate(data, schema);
};
module.exports.vehicleValidation = vehicleValidation;
