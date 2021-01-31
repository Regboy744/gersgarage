const Joi = require("@hapi/joi");

//REGISTER VALIDATION
const stockPartsValidation = (data) => {
     const schema = {
          factory_ref: Joi.string().min(2).required(),
          category: Joi.string().min(5).required(),
          make: Joi.string().min(4).required(),
          model: Joi.string().min(3).required(),
          variante: Joi.string().min(2).required(),
          engine: Joi.string().min(5).required(),
          name: Joi.string().min(3).required(),
          description: Joi.string().min(10).required(),
          price: Joi.string().min(1).required(),
          quantity: Joi.string().min(1).required(),
     };
     return Joi.validate(data, schema);
};
module.exports.stockPartsValidation = stockPartsValidation;
