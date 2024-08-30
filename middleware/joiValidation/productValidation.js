const { Joi } = require("express-joi-validations");

const productValidation = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string(),
  price: Joi.number().required(),
  category: Joi.string().required().trim(),
  color: Joi.string(),
  quantity: Joi.number().min(0),
  isDeleted: Joi.boolean(),
  imageSrc: Joi.string().uri(),
});

module.exports = productValidation;
