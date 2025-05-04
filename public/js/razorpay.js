// Trigger Razorpay payment modal
document.getElementById("pay-button-<%= booking._id %>").onclick = function() {
    const bookingId = "<%= booking._id %>";

    fetch(`/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())  // Make sure response is parsed as JSON
    .then(data => {
        if (data.success) {
            var options = {
                key: 'your_razorpay_key',  // Replace with your Razorpay key
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
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
                            alert('Payment successful and booking confirmed!');
                        } else {
                            alert('Payment verification failed. Please try again.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred during payment verification.');
                    });
                },
                prefill: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    contact: '9999999999'
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
        } else {
            alert('Error creating payment order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing payment.');
    });
};
