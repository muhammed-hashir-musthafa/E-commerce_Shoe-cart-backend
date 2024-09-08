const { Joi } = require("express-joi-validations");

const addProductValidation = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string(),
  price: Joi.number().required(),
  category: Joi.string().required().trim(),
  color: Joi.string(),
  quantity: Joi.number().min(0),
  isDeleted: Joi.boolean(),
  imageSrc: Joi.string().uri(),
  imageAlt: Joi.string(),
});

const updateProductValidation = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string(),
  price: Joi.number(),
  category: Joi.string().trim(),
  color: Joi.string(),
  quantity: Joi.number().min(0),
  isDeleted: Joi.boolean(),
  imageSrc: Joi.string().uri(),
  imageAlt: Joi.string(),
}).min(1);

module.exports = { addProductValidation, updateProductValidation };
