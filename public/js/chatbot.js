document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Initialize chat container display state
    chatContainer.style.display = 'none';
    chatContainer.style.transition = 'all 0.3s ease-in-out';

    // Predefined responses for common questions and general topics
    const responses = {
        // Booking Related
        'how to book': 'To book a hotel, you can use our website or mobile app. Simply enter your destination, dates, and number of guests to see available options.',
        'booking process': 'Our booking process is simple: 1. Select destination and dates 2. Choose your room 3. Enter guest details 4. Make payment 5. Receive confirmation.',
        'minimum booking': 'The minimum booking duration is 1 night. For extended stays, we offer special weekly and monthly rates.',
        'group booking': 'For group bookings (5 rooms or more), please contact our group reservations desk for special rates.',
        'advance booking': 'You can book up to 365 days in advance. Early booking often gets you better rates.',
        
        // Payment Related
        'payment methods': 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. Cash payments are accepted at check-in.',
        'deposit required': 'A one-night deposit or credit card guarantee is required for all bookings.',
        'refund policy': 'Refunds are processed within 5-7 business days, depending on your bank.',
        'price include': 'Room rates include basic amenities, WiFi, and taxes. Some premium services may have additional charges.',
        'best price guarantee': 'We offer a best price guarantee. If you find a lower rate elsewhere, we\'ll match it and give you an additional 10% off.',
        
        // Check-in/Check-out
        'check in time': 'Standard check-in time is 2:00 PM. Early check-in is subject to availability.',
        'check out time': 'Standard check-out time is 11:00 AM. Late check-out can be arranged for an additional fee.',
        'early check in': 'Early check-in is possible based on availability. Please contact us in advance to arrange this.',
        'late check out': 'Late check-out until 2:00 PM is available for an additional 25% of the room rate.',
        'id required': 'Valid government-issued photo ID and credit card are required at check-in.',
        
        // Room Related
        'room types': 'We offer Standard, Deluxe, Suite, and Family rooms. Each type has different amenities and space configurations.',
        'room capacity': 'Standard rooms accommodate 2 adults. Extra beds are available for children at additional cost.',
        'connecting rooms': 'Connecting rooms are available on request, subject to availability.',
        'smoking policy': 'We have designated smoking and non-smoking rooms. Please specify your preference while booking.',
        'pet policy': 'Select properties are pet-friendly. Additional charges and restrictions apply.',
        
        // Amenities
        'free wifi': 'Complimentary high-speed WiFi is available in all rooms and public areas.',
        'parking': 'Free parking is available for hotel guests. Valet parking is available at select locations.',
        'breakfast included': 'Breakfast is included in select room rates. Please check your room package details.',
        'restaurant hours': 'Our restaurant operates from 6:30 AM to 10:30 PM daily.',
        'room service': 'Room service is available 24/7 at most properties.',
        
        // Cancellation
        'cancellation policy': 'Free cancellation is available up to 24 hours before check-in. Later cancellations may incur charges.',
        'modify booking': 'Bookings can be modified online or through our customer service, subject to availability.',
        'no show policy': 'No-shows will be charged the full amount of the reservation.',
        'cancellation charges': 'Cancellation within 24 hours of check-in incurs one night\'s charge.',
        'refund process': 'Refunds for eligible cancellations are processed within 5-7 business days.',

        // General Topics
        'weather': 'I can help you check the weather at your destination. Please specify the city and dates of your stay.',
        'local attractions': 'I can provide information about popular tourist attractions, restaurants, and activities near your hotel.',
        'transportation': 'We can assist with arranging airport transfers, car rentals, or providing directions to local transportation options.',
        'special requests': 'We accommodate special requests like room preferences, dietary restrictions, or accessibility needs. Please let us know in advance.',
        'covid policy': 'We follow strict health and safety protocols. All rooms are thoroughly sanitized, and we provide contactless check-in options.',
        'internet speed': 'Our properties offer high-speed WiFi with average speeds of 100Mbps, suitable for streaming and video calls.',
        'gym facilities': 'Most of our properties have 24/7 fitness centers equipped with cardio machines and free weights.',
        'spa services': 'We offer various spa treatments and wellness services. Advance booking is recommended.',
        'business facilities': 'Our business centers provide printing, scanning, and meeting rooms with video conferencing capabilities.',
        'laundry service': 'Same-day laundry and dry-cleaning services are available at most properties.',
        'currency exchange': 'Currency exchange services are available at the front desk with competitive rates.',
        'medical assistance': 'We can arrange medical assistance and have partnerships with nearby healthcare facilities.',
        'tour packages': 'We offer customized tour packages and can help plan your sightseeing itinerary.',
        'child care': 'Babysitting services can be arranged with certified childcare professionals.',
        'airport shuttle': 'We provide airport shuttle services. Please book at least 24 hours in advance.'
    };

    function toggleChat() {
        const isHidden = chatContainer.style.display === 'none';
        
        if (isHidden) {
            chatContainer.style.display = 'flex';
            requestAnimationFrame(() => {
                chatContainer.style.opacity = '1';
            });
        } else {
            chatContainer.style.opacity = '0';
            chatContainer.addEventListener('transitionend', function hideContainer() {
                chatContainer.style.display = 'none';
                chatContainer.removeEventListener('transitionend', hideContainer);
            });
        }
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    function getBotResponse(message) {
        const userQuestion = message.toLowerCase().trim();
        let bestMatch = null;
        let highestSimilarity = 0;

        // Find the best matching predefined question
        for (const question in responses) {
            const similarity = calculateSimilarity(userQuestion, question);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = question;
            }
        }

        // Return the matching response or a default message
        return highestSimilarity > 0.3 ? responses[bestMatch] : 
            'I apologize, but I don\'t have specific information about that. Please contact our support team for more detailed assistance.';
    }

    function calculateSimilarity(str1, str2) {
        // Normalize strings: remove punctuation, convert to lowercase
        const normalize = (str) => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        str1 = normalize(str1);
        str2 = normalize(str2);

        // Split into words and remove duplicates
        const words1 = [...new Set(str1.split(' '))];
        const words2 = [...new Set(str2.split(' '))];

        // Calculate common words
        const commonWords = words1.filter(word => words2.includes(word));

        // Calculate Jaccard similarity coefficient
        const union = new Set([...words1, ...words2]);
        return commonWords.length / union.size;
    }

    function handleUserInput(message) {
        if (!message.trim()) return;
        
        addMessage(message, true);
        userInput.value = '';

        const typingIndicator = showTypingIndicator();
        
        setTimeout(() => {
            chatMessages.removeChild(typingIndicator);
            const response = getBotResponse(message);
            addMessage(response);
        }, 1000);
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    sendButton.addEventListener('click', () => handleUserInput(userInput.value));
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput(userInput.value);
    });

    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => handleUserInput(chip.textContent));
    });
});