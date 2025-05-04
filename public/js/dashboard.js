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
    // Profile form AJAX submission
    document.addEventListener('DOMContentLoaded', function() {
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
    });

    // Handle payment button click
    document.querySelectorAll('.btn-success').forEach(btn => {
        if (btn.textContent.includes('Pay Now')) {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const bookingId = btn.closest('.card').querySelector('.card-subtitle').textContent.split('#')[1].trim();
                
                try {
                    const response = await fetch(`/bookings/${bookingId}/pay`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        try {
                            const errorJson = JSON.parse(errorText);
                            throw new Error(errorJson.error || 'Payment initiation failed');
                        } catch (jsonError) {
                            throw new Error('Server error: ' + errorText);
                        }
                    }

                    const result = await response.json();
                    if (result.success) {
                        // Initialize Razorpay payment
                        const options = {
                            key: result.razorpayKey,
                            amount: result.amount,
                            currency: result.currency,
                            order_id: result.orderId,
                            name: 'TripNest Booking',
                            description: 'Booking Payment',
                            handler: function(response) {
                                window.location.reload();
                            }
                        };
                        const rzp = new Razorpay(options);
                        rzp.open();
                    } else {
                        throw new Error(result.error || 'Payment initiation failed');
                    }
                } catch (error) {
                    console.error('Payment error:', error);
                    alert(error.message);
                }
            });
        }
    });
});