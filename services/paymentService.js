const Booking = require('../Models/booking.js');
const razorpay = require('../services/razorpayInstance');

class PaymentService {
    static async processPayment(bookingId, paymentDetails) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        try {//payment logic
            const options = {
                amount: booking.totalPrice * 100, // Razorpay amount is in paise
                currency: 'INR',
                receipt: `receipt_order_${bookingId}`,
                notes: {
                    bookingId: booking._id.toString(),
                }
            };
            
            const order = await razorpay.orders.create(options);

            // if (paymentResult.success) {
            //     booking.paymentStatus = 'paid';
            //     booking.paymentId = paymentResult.paymentId;
            //     booking.status = 'confirmed';
            //     await booking.save();
            //     return { success: true, booking };
            // }

            return {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                bookingId: booking._id
            };
        } catch (error) {
            console.error('Payment processing error:', error);
            return { success: false, error: error.message };
        }
    }

    static async refundPayment(bookingId) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        try {
            
            const refundResult = {
                success: true,
                refundId: 'refund_' + Date.now()
            };

            if (refundResult.success) {
                booking.paymentStatus = 'refunded';
                booking.status = 'cancelled';
                await booking.save();
                return { success: true, booking };
            }

            return { success: false, error: 'Refund failed' };
        } catch (error) {
            console.error('Refund processing error:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = PaymentService;