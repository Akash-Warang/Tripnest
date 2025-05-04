// Form Validation Script

document.addEventListener('DOMContentLoaded', function() {
    // Get all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');

    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Phone validation regex
    const phoneRegex = /^[0-9]{10}$/;

    // Custom validation for password
    function validatePassword(input) {
        const password = input.value;
        const feedback = input.nextElementSibling;

        if (!passwordRegex.test(password)) {
            input.setCustomValidity('Password must contain at least 8 characters, including uppercase, lowercase, number and special character');
            feedback.textContent = 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character';
            return false;
        } else {
            input.setCustomValidity('');
            return true;
        }
    }

    // Custom validation for email
    function validateEmail(input) {
        const email = input.value;
        const feedback = input.nextElementSibling;

        if (!emailRegex.test(email)) {
            input.setCustomValidity('Please enter a valid email address');
            feedback.textContent = 'Please enter a valid email address';
            return false;
        } else {
            input.setCustomValidity('Send Otp');
            feedback.textContent = 'Send Otp';
            return true;
        }
    }

    // Custom validation for phone
    function validatePhone(input) {
        const phone = input.value;
        const feedback = input.nextElementSibling;

        if (!phoneRegex.test(phone)) {
            input.setCustomValidity('Please enter a valid 10-digit phone number');
            feedback.textContent = 'Please enter a valid 10-digit phone number';
            return false;
        } else {
            input.setCustomValidity('');
            return true;
        }
    }

    // Custom validation for listing price
    function validatePrice(input) {
        const price = Number(input.value);
        const feedback = input.nextElementSibling;

        if (isNaN(price) || price <= 0) {
            input.setCustomValidity('Please enter a valid price greater than 0');
            feedback.textContent = 'Please enter a valid price greater than 0';
            return false;
        } else {
            input.setCustomValidity('');
            return true;
        }
    }

    // Custom validation for listing title
    function validateTitle(input) {
        const title = input.value;
        const feedback = input.nextElementSibling;

        if (title.length < 5 || title.length > 100) {
            input.setCustomValidity('Title must be between 5 and 100 characters');
            feedback.textContent = 'Title must be between 5 and 100 characters';
            return false;
        } else {
            input.setCustomValidity('');
            return true;
        }
    }

    // Custom validation for description
    function validateDescription(input) {
        const description = input.value;
        const feedback = input.nextElementSibling;

        if (description.length < 20 || description.length > 1000) {
            input.setCustomValidity('Description must be between 20 and 1000 characters');
            feedback.textContent = 'Description must be between 20 and 1000 characters';
            return false;
        } else {
            input.setCustomValidity('');
            return true;
        }
    }

    // Add validation to all forms
    forms.forEach(form => {
        // Validate on submit
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                switch(input.id) {
                    case 'password':
                        validatePassword(input);
                        break;
                    case 'email':
                        validateEmail(input);
                        break;
                    case 'phone':
                        validatePhone(input);
                        break;
                    case 'price':
                        validatePrice(input);
                        break;
                    case 'title':
                        validateTitle(input);
                        break;
                    case 'description':
                        validateDescription(input);
                        break;
                }
            });
        });
    });
});