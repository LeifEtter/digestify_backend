const Joi = require("joi");

//Validating for correctness of input

exports.signUpValidation = Joi.object({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().required(),
})

exports.loginValidation = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
})