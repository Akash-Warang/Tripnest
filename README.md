# TripNest - Your Travel Companion

## Overview
TripNest is a web application designed to help users discover unique accommodations and experiences across India. Built with a focus on supporting local businesses and celebrating Indian culture, TripNest provides a seamless platform for travelers and property owners.

## Features
- **Property Listings**: Browse and book unique accommodations
- **Reviews & Ratings**: Read and leave reviews for properties
- **User Profiles**: Manage your bookings and preferences
- **Admin Dashboard**: Manage properties and users

## Technology Stack
- **Frontend**: EJS, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js

## Project Structure
```
TripNest/
├── Models/              # Database models
│   ├── listing.js       # Listing model schema
│   ├── review.js        # Review model schema
│   └── user.js          # User model schema
├── controllers/         # Application controllers
│   ├── admin.js         # Admin controller
│   ├── info.js          # Info controller
│   ├── listing.js       # Listing controller
│   ├── review.js        # Review controller
│   └── users.js         # User controller
├── public/              # Static assets (CSS, JS)
│   ├── css/             # CSS files
│   │   ├── about.css
│   │   ├── admin.css
│   │   ├── rating.css
│   │   ├── review.css
│   │   ├── show-dark.css
│   │   ├── show.css
│   │   └── style.css
│   └── js/              # JavaScript files
│       ├── map.js
│       └── script.js
├── routes/              # Application routes
│   ├── admin.js         # Admin routes
│   ├── info.js          # Info routes
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   └── user.js          # User routes
├── utils/               # Utility functions
│   ├── ExpressErr.js    # Custom error handler
│   ├── emailTemplates.js# Email templates
│   └── wrapAsync.js     # Async wrapper
├── views/               # EJS templates
│   ├── admin/           # Admin views
│   │   ├── dashboard.ejs
│   │   ├── listings.ejs
│   │   └── pending-listings.ejs
│   ├── err.ejs          # Error view
│   ├── includes/        # Partial views
│   │   ├── flash.ejs
│   │   ├── foot.ejs
│   │   └── nav.ejs
│   ├── info/            # Info views
│   │   ├── about.ejs
│   │   ├── contact.ejs
│   │   ├── faq.ejs
│   │   ├── help-center.ejs
│   │   ├── privacy.ejs
│   │   └── terms.ejs
│   ├── layouts/         # Layouts
│   │   └── boilerplate.ejs
│   ├── listings/        # Listing views
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   └── users/           # User views
│       ├── login.ejs
│       └── signup.ejs
├── app.js               # Main application file
├── cloudConfig.js       # Cloud configuration
├── middleware.js        # Custom middleware
├── package.json         # Dependencies
└── package-lock.json    # Dependency lock file
```

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the application: `npm start`

## Contributing
We welcome contributions! Please follow our contribution guidelines in CONTRIBUTING.md
