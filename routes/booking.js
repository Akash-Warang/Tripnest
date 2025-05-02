const express = require('express');
const router = express.Router(); 
const bookings = require('../controllers/booking');
const { isLoggedIn} = require('../middleware.js');
const { validateBooking, validateBookingUpdate, isBookingOwner } = require('../middleware/bookingMiddleware.js');

// List user's bookings
router.get('/', isLoggedIn, bookings.listUserBookings);

// Create new booking
router.post('/:id/book', 
    isLoggedIn,
    validateBooking,
    bookings.createBooking
);

// Show booking details
router.get('/:id',
    isLoggedIn,
    isBookingOwner,
    bookings.showBooking
);

// Update booking
router.put('/:id',
    isLoggedIn,
    isBookingOwner,
    validateBookingUpdate,
    bookings.updateBooking
);

// Cancel booking
router.delete('/:id',
    isLoggedIn,
    isBookingOwner,
    bookings.cancelBooking
);

module.exports = router;