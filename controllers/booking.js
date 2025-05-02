const Booking = require('../Models/booking.js');
const Listing = require('../Models/listing.js');
const ExpressErr = require('../utils/ExpressErr.js');
const wrapAsync = require('../utils/wrapAsync.js');
const PaymentService = require('../services/paymentService.js');

// Create a new booking
module.exports.createBooking = wrapAsync(async (req, res) => {
    console.log("in booking 1");//.........................................
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressErr(404, 'Listing not found');
    }

    const isAvailable = await Booking.checkAvailability(
        id,
        new Date(req.body.booking.checkIn),
        new Date(req.body.booking.checkOut)
    );

    if (!isAvailable) {
        throw new ExpressErr(400, 'Selected dates are not available');
    }

    const booking = new Booking({
        ...req.body.booking,
        listing: id,
        user: req.user._id,
        checkIn: new Date(req.body.booking.checkIn),
        checkOut: new Date(req.body.booking.checkOut)
    });

    await booking.calculateTotalPrice();
    await booking.save();

    // Process payment and confirm booking
    const paymentResult = await PaymentService.processPayment(booking._id, req.body.payment);
    if (paymentResult.success) {
        req.flash('success', 'Booking confirmed! Payment processed successfully.');
    } else {
        req.flash('error', 'Booking created but payment pending. Please complete payment.');
    }
    res.redirect(`/bookings/${booking._id}`);
});

// Show booking details
module.exports.showBooking = wrapAsync(async (req, res) => {
    console.log("in booking 2");//.........................................
    const booking = await Booking.findById(req.params.id)
        .populate('listing')
        .populate('user');
    
    if (!booking) {
        throw new ExpressErr(404, 'Booking not found');
    }

    res.render('./bookings/show.ejs', { booking });
});

// List user's bookings
module.exports.listUserBookings = wrapAsync(async (req, res) => {
    console.log("in booking 3");//.........................................
    const bookings = await Booking.find({ user: req.user._id })
        .populate('listing')
        .sort('-createdAt');
    
    res.render('bookings/index', { bookings });
});

// Update booking status
module.exports.updateBooking = wrapAsync(async (req, res) => {
    console.log("in booking 4");//.........................................
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
        throw new ExpressErr(404, 'Booking not found');
    }

    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        throw new ExpressErr(403, 'You do not have permission to update this booking');
    }

    Object.assign(booking, req.body.booking);
    await booking.save();

    req.flash('success', 'Successfully updated booking!');
    res.redirect(`/bookings/${id}`);
});

// Cancel booking
module.exports.cancelBooking = wrapAsync(async (req, res) => {
    console.log("in booking 5");//.........................................
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
        throw new ExpressErr(404, 'Booking not found');
    }

    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        throw new ExpressErr(403, 'You do not have permission to cancel this booking');
    }

    const refundResult = await PaymentService.refundPayment(booking._id);
    if (refundResult.success) {
        req.flash('success', 'Booking cancelled and payment refunded successfully!');
    } else {
        req.flash('error', 'Booking cancelled but refund failed. Please contact support.');
    }
    res.redirect('/bookings');
});