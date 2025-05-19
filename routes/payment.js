const express = require('express');
const router = express.Router();
const PaymentService = require('../services/paymentService');
const { isLoggedIn } = require('../middleware');

// POST /payments/create - Create a new payment order
router.post('/create', isLoggedIn, async (req, res) => {
    try {
        const { bookingId } = req.body;
        const result = await PaymentService.processPayment(bookingId);
        
        if (result.success) {
            res.json({
                success: true,
                orderId: result.orderId,
                amount: result.amount,
                currency: result.currency,
                bookingId: result.bookingId,
                key: process.env.RAZORPAY_API_KEY
            });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /payments/verify - Verify payment and update booking status
router.post('/verify', isLoggedIn, async (req, res) => {
    try {
        const result = await PaymentService.verifyPayment(req.body);
        
        if (result.success) {
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;