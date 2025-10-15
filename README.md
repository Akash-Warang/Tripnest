# TripNest - Your Travel Companion

TripNest is a comprehensive travel accommodation platform that connects travelers with unique properties while providing a seamless booking experience.

- Pull repository -> npm i
- Sample Database -> cmd -> cd init -> node init.js -> cd ..
- cmd -> nodemon app.js
- Run Project as "http://localhost:8080/listings"

## Features

- User Authentication: Secure login/signup with OTP verification
- Property Listings: Browse and book unique accommodations with advanced filters
- Reviews & Ratings: Read and leave reviews for properties
- User Profiles: Manage your bookings and preferences
- Booking Management: View and manage your bookings, including cancellation and special requests
- Payment Integration: Secure payments through Razorpay
- Admin Dashboard: Manage properties, users, and bookings
- Owner Dashboard: Property owners can manage their listings and bookings
- Interactive Maps: View property locations using Mapbox integration

## Technology Stack

- Frontend: EJS, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: Passport.js
- Payment Gateway: Razorpay
- Maps: Mapbox
- Cloud Storage: Cloudinary

## Project Structure

TripNest/
├── Models/              # Database models
├── controllers/         # Application controllers
├── middleware/         # Custom middleware
├── public/             # Static assets (CSS, JS)
├── routes/             # Application routes
├── services/           # External services integration
├── utils/              # Utility functions
├── views/              # EJS templates
└── app.js             # Main application file



