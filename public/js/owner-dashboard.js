// Initialize Revenue Chart
function initRevenueChart(data) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Monthly Revenue',
                data: data.values,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
}

// Handle Booking Status Updates
function updateBookingStatus(bookingId, status) {
    fetch(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update UI to reflect new status
            const statusBadge = document.querySelector(`#booking-${bookingId} .status-badge`);
            statusBadge.textContent = status;
            statusBadge.className = `badge ${status === 'confirmed' ? 'bg-success' : 'bg-warning'}`;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Delete Listing Confirmation
function confirmDelete(listingId) {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        document.querySelector(`#delete-listing-${listingId}`).submit();
    }
}

// Initialize Tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize revenue chart if element exists
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        // Fetch revenue data and initialize chart
        fetch('/api/revenue-data')
            .then(response => response.json())
            .then(data => initRevenueChart(data))
            .catch(error => console.error('Error loading revenue data:', error));
    }

    // Add event listeners for booking status updates
    document.querySelectorAll('.booking-status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const bookingId = e.target.dataset.bookingId;
            updateBookingStatus(bookingId, e.target.value);
        });
    });

    // Add event listeners for delete confirmation
    document.querySelectorAll('.delete-listing-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const listingId = e.target.dataset.listingId;
            confirmDelete(listingId);
        });
    });
});