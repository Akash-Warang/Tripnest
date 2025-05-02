const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending"
  },
  paymentId: {
    type: String
  },
  specialRequests: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updatedAt timestamp
bookingSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if dates are available for booking
bookingSchema.statics.checkAvailability = async function(listingId, checkIn, checkOut) {
  const overlappingBookings = await this.find({
    listing: listingId,
    status: { $nin: ["cancelled"] },
    $or: [
      { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
    ]
  });
  return overlappingBookings.length === 0;
};

// Method to calculate total price
bookingSchema.methods.calculateTotalPrice = async function() {
  await this.populate("listing");
  const numberOfNights = Math.ceil(
    (this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24)
  );
  this.totalPrice = this.listing.price * numberOfNights;
  return this.totalPrice;
};

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;