const Joi = require("@hapi/joi");

//REGISTER VALIDATION
const partsChengedValidation = (data) => {
  const schema = {
    name: Joi.string().min(2).required(),
    quantity: Joi.string().min(1).required(),
    price: Joi.string().min(1).required(),
    total: Joi.string().min(1).required(),
  };
  return Joi.validate(data, schema);
};
module.exports.partsChengedValidation = partsChengedValidation;
