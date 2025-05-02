const { bookingSchema, bookingUpdateSchema } = require('../schemas/bookingSchema.js');
const ExpressErr = require('../utils/ExpressErr.js');
const Booking = require('../Models/booking.js');

module.exports.validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressErr(400, msg);
    }
    next();
};

module.exports.validateBookingUpdate = (req, res, next) => {
    const { error } = bookingUpdateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressErr(400, msg);
    }
    next();
};

module.exports.isBookingOwner = async (req, res, next) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
        req.flash('error', 'Booking not found!');
        return res.redirect('/bookings');
    }
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        req.flash('error', 'You don\'t have permission to do that!');
        return res.redirect('/bookings');
    }
    next();
};