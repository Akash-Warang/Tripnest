// Handle filter form submission and reset
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filterForm');
    const categoryFilter = document.getElementById('categoryFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const capacityFilter = document.getElementById('capacityFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const amenityCheckboxes = document.querySelectorAll('#amenityFilter input[type="checkbox"]');

    // Set initial values from URL params
    const urlParams = new URLSearchParams(window.location.search);
    categoryFilter.value = urlParams.get('category') || '';
    minPrice.value = urlParams.get('minPrice') || '';
    maxPrice.value = urlParams.get('maxPrice') || '';
    capacityFilter.value = urlParams.get('capacity') || '';
    ratingFilter.value = urlParams.get('rating') || '';
    
    // Set amenities from URL
    const urlAmenities = urlParams.getAll('amenities');
    amenityCheckboxes.forEach(checkbox => {
        checkbox.checked = urlAmenities.includes(checkbox.value);
    });

    // Update hidden inputs before form submission
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous hidden inputs
        const amenitiesContainer = document.getElementById('amenitiesInputContainer');
        amenitiesContainer.innerHTML = '';

        // Update category input
        document.getElementById('categoryInput').value = categoryFilter.value;

        // Update price inputs
        document.getElementById('minPriceInput').value = minPrice.value;
        document.getElementById('maxPriceInput').value = maxPrice.value;

        // Update capacity input
        document.getElementById('capacityInput').value = capacityFilter.value;

        // Update rating input
        document.getElementById('ratingInput').value = ratingFilter.value;

        // Add selected amenities
        const selectedAmenities = Array.from(amenityCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        selectedAmenities.forEach(amenity => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'amenities';
            input.value = amenity;
            amenitiesContainer.appendChild(input);
        });

        // Submit the form
        filterForm.submit();
    });

    // Add reset functionality
    window.resetFilters = () => {
        categoryFilter.value = '';
        minPrice.value = '';
        maxPrice.value = '';
        capacityFilter.value = '';
        ratingFilter.value = '';
        amenityCheckboxes.forEach(checkbox => checkbox.checked = false);
        filterForm.submit();
    };
});