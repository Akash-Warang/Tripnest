# TripNest - Your Travel Companion

TripNest is a comprehensive travel accommodation platform that connects travelers with unique properties while providing a seamless booking experience.

## Features

- **User Authentication**: Secure login/signup with OTP verification
- **Property Listings**: Browse and book unique accommodations with advanced filters
- **Reviews & Ratings**: Read and leave reviews for properties
- **User Profiles**: Manage your bookings and preferences
- **Booking Management**: View and manage your bookings, including cancellation and special requests
- **Payment Integration**: Secure payments through Razorpay
- **Admin Dashboard**: Manage properties, users, and bookings
- **Owner Dashboard**: Property owners can manage their listings and bookings
- **Interactive Maps**: View property locations using Mapbox integration

## Technology Stack

- **Frontend**: EJS, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Payment Gateway**: Razorpay
- **Maps**: Mapbox
- **Cloud Storage**: Cloudinary

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_secret
   
   MAP_TOKEN=your_mapbox_token
   
   EMAIL_USER=your_email
   EMAIL_APP_PASSWORD=your_email_app_password
   
   RAZORPAY_API_KEY=your_razorpay_key
   RAZORPAY_SECRET_KEY=your_razorpay_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
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
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
