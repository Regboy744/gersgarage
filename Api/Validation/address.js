const Joi = require("@hapi/joi");

// ADDRESS REGISTER VALIDATION
const addressValidation = (data) => {
     const schema = {
          address_type: Joi.string().min(4).required(),
          street: Joi.string().min(5).required(),
          city: Joi.string().min(4).required(),
          code: Joi.string().min(7).required(),
          area: Joi.string().min(2).required(),
     };
     return Joi.validate(data, schema);
};

module.exports.addressValidation = addressValidation;
