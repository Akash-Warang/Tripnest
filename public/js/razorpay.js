// Function to initialize payment
function initializePayment(bookingId) {
    fetch('/payments/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then((data) => {
        if (data.success) {
            const options = {
                key: data.key_id, // Get key from server
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
                name: 'TripNest',
                description: 'Property Booking Payment',
                handler: function(response) {
                    const paymentDetails = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingId: data.bookingId
                    };

                    fetch('/payments/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(paymentDetails)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            window.location.reload(); // Reload to update booking status
                        } else {
                            alert('Payment verification failed: ' + (result.error || 'Please try again'));
                        }
                    })
                    .catch(error => {
                        console.error('Verification error:', error);
                        alert('Payment verification failed. Please contact support.');
                    });
                },
                modal: {
                    ondismiss: function() {
                        console.log('Payment modal closed');
                    }
                },
                theme: {
                    color: '#007bff'
                }
            };
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function(response) {
                alert('Payment failed: ' + response.error.description);
            });
            rzp.open();
        } else {
            throw new Error(data.error || 'Failed to create payment order');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        alert('Error: ' + (error.message || 'Failed to initialize payment'));
    });
}

// Attach click handlers to all payment buttons
document.querySelectorAll('[id^="pay-button-"]').forEach(button => {
    button.addEventListener('click', () => {
        const bookingId = button.getAttribute('data-booking-id');
        initializePayment(bookingId);
    });
});