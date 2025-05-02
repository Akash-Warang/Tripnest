const Joi = require('joi');

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.date().required().greater('now'),
        checkOut: Joi.date().required().greater(Joi.ref('checkIn')),
        numberOfGuests: Joi.number().required().min(1),
        specialRequests: Joi.string().allow('', null),
    }).required()
});

module.exports.bookingUpdateSchema = Joi.object({
    booking: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed'),
        paymentStatus: Joi.string().valid('pending', 'paid', 'refunded'),
        specialRequests: Joi.string().allow('', null),
    }).required()
});