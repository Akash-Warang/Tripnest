const Booking = require('../Models/booking');
const Listing = require('../Models/listing');
const Review = require('../Models/review');

class RecommendationService {
    constructor() {
        this.weights = {
            priceRange: 0.3,
            location: 0.25,
            amenities: 0.2,
            ratings: 0.15,
            bookingHistory: 0.1
        };
    }

    async getUserPreferences(userId) {
        try {
            // Get user's booking history
            const bookings = await Booking.find({ user: userId })
                .populate('listing')
                .sort({ createdAt: -1 })
                .limit(5);

            // Get user's reviews
            const reviews = await Review.find({ author: userId })
                .populate('listing')
                .sort({ createdAt: -1 })
                .limit(5);

            // Extract preferences
            const preferences = {
                priceRange: this._calculatePricePreference(bookings),
                locations: this._extractLocations(bookings),
                amenities: this._extractAmenities(bookings),
                ratings: this._calculateRatingPreference(reviews)
            };

            return preferences;
        } catch (error) {
            console.error('Error getting user preferences:', error);
            throw new Error('Failed to analyze user preferences');
        }
    }

    async getRecommendations(userId, limit = 5) {
        try {
            const preferences = await this.getUserPreferences(userId);
            
            // Get all active listings
            const listings = await Listing.find({ status: 'active' })
                .populate('owner')
                .populate('reviews');

            // Score each listing based on user preferences
            const scoredListings = listings.map(listing => ({
                listing,
                score: this._calculateListingScore(listing, preferences)
            }));

            // Sort by score and return top recommendations
            return scoredListings
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(item => item.listing);

        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw new Error('Failed to generate recommendations');
        }
    }

    async getFallbackRecommendations(limit = 5) {
        try {
            // Get top-rated listings when user preferences are not available
            return await Listing.find({ status: 'active' })
                .populate('owner')
                .populate('reviews')
                .sort({ 'rating': -1 })
                .limit(limit);
        } catch (error) {
            console.error('Error getting fallback recommendations:', error);
            throw new Error('Failed to get fallback recommendations');
        }
    }

    _calculatePricePreference(bookings) {
        if (!bookings.length) return null;
        
        const prices = bookings.map(booking => booking.listing.price);
        return {
            min: Math.min(...prices) * 0.8,
            max: Math.max(...prices) * 1.2,
            avg: prices.reduce((a, b) => a + b, 0) / prices.length
        };
    }

    _extractLocations(bookings) {
        return [...new Set(bookings.map(booking => booking.listing.location))];
    }

    _extractAmenities(bookings) {
        const amenitiesCounts = {};
        bookings.forEach(booking => {
            booking.listing.amenities.forEach(amenity => {
                amenitiesCounts[amenity] = (amenitiesCounts[amenity] || 0) + 1;
            });
        });
        return Object.entries(amenitiesCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([amenity]) => amenity);
    }

    _calculateRatingPreference(reviews) {
        if (!reviews.length) return null;
        return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }

    _calculateListingScore(listing, preferences) {
        let score = 0;

        // Price score
        if (preferences.priceRange) {
            const priceScore = this._calculatePriceScore(listing.price, preferences.priceRange);
            score += priceScore * this.weights.priceRange;
        }

        // Location score
        const locationScore = preferences.locations.includes(listing.location) ? 1 : 0;
        score += locationScore * this.weights.location;

        // Amenities score
        const amenitiesScore = this._calculateAmenitiesScore(listing.amenities, preferences.amenities);
        score += amenitiesScore * this.weights.amenities;

        // Rating score
        const ratingScore = this._calculateRatingScore(listing.rating, preferences.ratings);
        score += ratingScore * this.weights.ratings;

        return score;
    }

    _calculatePriceScore(price, priceRange) {
        if (price >= priceRange.min && price <= priceRange.max) {
            const deviation = Math.abs(price - priceRange.avg) / priceRange.avg;
            return Math.max(0, 1 - deviation);
        }
        return 0;
    }

    _calculateAmenitiesScore(listingAmenities, preferredAmenities) {
        if (!preferredAmenities.length) return 0;
        const matches = preferredAmenities.filter(amenity => 
            listingAmenities.includes(amenity)
        ).length;
        return matches / preferredAmenities.length;
    }

    _calculateRatingScore(listingRating, preferredRating) {
        if (!preferredRating) return listingRating / 5;
        const difference = Math.abs(listingRating - preferredRating);
        return Math.max(0, 1 - difference / 5);
    }
}

module.exports = new RecommendationService();