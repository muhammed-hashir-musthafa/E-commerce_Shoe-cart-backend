const { Joi } = require("express-joi-validations");

const signUpValidation = Joi.object({
  username: Joi.string().required().min(3).max(25),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6)
});

module.exports = signUpValidation;
