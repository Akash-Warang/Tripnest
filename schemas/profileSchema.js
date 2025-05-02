const Joi = require('joi');

module.exports.profileSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
            'any.required': 'Username is required'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/) // International phone number format
        .allow('') // Make phone optional
        .messages({
            'string.pattern.base': 'Please enter a valid phone number'
        })
});