const Joi = require('joi');

module.exports.listingsSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string().valid('Hotel', 'Resort', 'Villa', 'Apartment', 'Cottage', 'Home', 'Other').required(),
        amenities: Joi.array().items(Joi.string().valid('WiFi', 'Parking', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Air Conditioning', 'Room Service')),
        numberOfRooms: Joi.number().required().min(1),
        numberOfGuests: Joi.number().min(1),
        contactPhone: Joi.string(),
        contactEmail: Joi.string().email(),
        privacyPolicy: Joi.string().optional(),
        terms:Joi.string().optional(),
        agreeToPolicy: Joi.valid('on').required(),
    }).required()
});

module.exports.reviewsSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
