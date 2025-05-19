const Booking = require('../Models/booking.js');
const razorpay = require('../services/razorpayInstance');

class PaymentService {
    static async processPayment(bookingId, paymentDetails) {
        console.log(bookingId);
        const booking = await Booking.findById(bookingId).populate('listing');
        console.log("Booking : ", booking);
        if (!booking) {
            throw new Error('Booking not found');
        }

        try {
            const options = {
                amount: booking.totalPrice * 100, // Razorpay amount is in paise
                currency: 'INR',
                receipt: `receipt_order_${bookingId}`,
                notes: {
                    bookingId: booking._id.toString(),
                    propertyName: booking.listing.title || 'Property Booking',
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut
                }
            };
            
            const order = await razorpay.orders.create(options);
            
            // Update booking with order ID
            booking.razorpayOrderId = order.id;
            await booking.save();

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

    static async verifyPayment(paymentDetails) {
        try {
            const booking = await Booking.findOne({ razorpayOrderId: paymentDetails.razorpay_order_id });
            if (!booking) {
                throw new Error('Booking not found');
            }

            // Verify payment signature
            const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
            shasum.update(`${paymentDetails.razorpay_order_id}|${paymentDetails.razorpay_payment_id}`);
            const digest = shasum.digest('hex');

            if (digest !== paymentDetails.razorpay_signature) {
                throw new Error('Invalid payment signature');
            }

            // Update booking status
            booking.paymentStatus = 'paid';
            booking.paymentId = paymentDetails.razorpay_payment_id;
            booking.status = 'confirmed';
            await booking.save();

            return { success: true, booking };
        } catch (error) {
            console.error('Payment verification error:', error);
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