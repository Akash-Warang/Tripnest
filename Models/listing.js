const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Hotel', 'Resort', 'Villa', 'Apartment', 'Cottage', 'Home', 'Other'],
    required: true
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Parking', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Air Conditioning', 'Room Service']
  }],
  numberOfRooms:{
    type: Number,
    required: true,
    min: 1
  },
  numberOfGuests:{
    type:Number
  },
  contactPhone:{
    type:String
  },
  contactEmail:{
    type:String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationMessage: {
    type: String,
    default: ''
  },
  privacyPolicy:{
    type:String,
  },
  terms:{
    type:String,
  },
  agreeToPolicy: {
    type: Boolean,
    required: true,  // This ensures the user has agreed to the policy
  },
  rating:{
    default: 1,
    type : Number,
        min : 1,
        max : 5,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationMessage: {
    type: String,
    default: ''
  }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
  }
});

listingSchema.methods.calculateAvgRating = async function () {
  await this.populate('reviews');
  if (this.reviews.length) {
    let sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.rating = sum / this.reviews.length;
  } else {
    this.rating = 0;
  }
  await this.save();
};

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
