document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tab.classList.add('active');
            const target = document.querySelector(tab.getAttribute('href'));
            target.classList.add('show', 'active');

            // Remove active class from other tabs
            tabs.forEach(t => {
                if (t !== tab) {
                    t.classList.remove('active');
                    const tTarget = document.querySelector(t.getAttribute('href'));
                    tTarget.classList.remove('show', 'active');
                }
            });
        });
    });

    // Handle booking cancellation
    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to cancel this booking?')) {
                e.preventDefault();
            }
        });
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    const updateStatus = document.getElementById('updateStatus');

    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(profileForm);
                const response = await fetch('/users/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                const result = await response.json();
                
                updateStatus.style.display = 'block';
                if (response.ok) {
                    updateStatus.className = 'alert alert-success';
                    updateStatus.textContent = result.message;
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    updateStatus.className = 'alert alert-danger';
                    updateStatus.textContent = result.error;
                }
            } catch (error) {
                updateStatus.style.display = 'block';
                updateStatus.className = 'alert alert-danger';
                updateStatus.textContent = 'An error occurred while updating profile';
            }
        });
    }

    // Handle payment button click
    document.querySelectorAll('[id^="pay-button-"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const bookingId = btn.id.split('pay-button-')[1];
            try {
                const response = await fetch('/payments/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ bookingId })
                });
                const result = await response.json();
                
                if (response.ok) {
                    // Load Razorpay script if not already present
                    if (!document.querySelector('script[src*="checkout.razorpay.com"]')) {
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.async = true;
                        script.onerror = () => {
                            console.error('Failed to load Razorpay script');
                            alert('Payment system failed to load. Please try again later.');
                        };
                        document.body.appendChild(script);
                        
                        // Wait for script to load
                        await new Promise((resolve, reject) => {
                            script.onload = resolve;
                            script.onerror = reject;
                        });
                    }

                    // Initialize Razorpay payment
                    const options = {
                        key: result.key,
                        amount: result.amount,
                        currency: result.currency,
                        order_id: result.orderId,
                        name: 'TripNest Booking',
                        description: 'Booking Payment',
                        handler: function(response) {
                            // Verify payment on server
                            fetch('/payment/verify', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                    bookingId: bookingId
                                })
                            })
                            .then(response => response.json())
                            .then(result => {
                                if (result.success) {
                                    window.location.reload();
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
                                console.log('Payment cancelled by user');
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
                    throw new Error(result.error || 'Payment initiation failed');
                }
            } catch (error) {
                console.error('Payment error:', error);
                alert(error.message);
            }
        });
    });
});