const Joi = require("@hapi/joi");

//   VALIDATION
const serviceOrderValidation = (data) => {
     const schema = {
          // v_id: Joi.string().min(2).required(),
          status: Joi.string().min(2).required(),
          service_type: Joi.string().min(2).required(),
          mechanic_name: Joi.string().min(2).required(),
          issue_description: Joi.string().min(10).required(),
          start_date: Joi.string().min(8).required(),
          end_date: Joi.string().min(8).required(),
          service_cost: Joi.string().min(1).required(),
     };
     return Joi.validate(data, schema);
};

module.exports.serviceOrderValidation = serviceOrderValidation;
