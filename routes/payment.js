const express = require('express');
const router = express.Router();
const PaymentService = require('./services/PaymentService');

// POST /bookings/:id/pay
// POST route to create a Razorpay order and return the order details
router.post('/:bookingId/pay', async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        const options = {
            amount: booking.totalPrice * 100, // Razorpay amount is in paise
            currency: 'INR',
            receipt: `receipt_order_${bookingId}`,
            notes: {
                bookingId: booking._id.toString(),
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingId: booking._id
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
module.exports = router;