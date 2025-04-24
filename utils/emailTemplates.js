const approvalTemplate = (listing) => {
    return `
Dear ${listing.owner.username},

Great news! Your listing "${listing.title}" has been approved and is now live on TripNest.

Your property is now visible to potential guests and ready to receive bookings. You can view your listing at any time by logging into your TripNest account.

Listing Details:
- Title: ${listing.title}
- Location: ${listing.location}, ${listing.country}
- Price: $${listing.price} per night

Thank you for choosing TripNest as your hosting platform!

Best regards,
The TripNest Team
`;
};

const rejectionTemplate = (listing, message) => {
    return `
Dear ${listing.owner.username},

We have reviewed your listing "${listing.title}" on TripNest and unfortunately, we cannot approve it at this time.

Reason for rejection: ${message}

You can make the necessary adjustments and resubmit your listing for review. If you have any questions, please don't hesitate to contact our support team.

Listing Details:
- Title: ${listing.title}
- Location: ${listing.location}, ${listing.country}

Thank you for your understanding.

Best regards,
The TripNest Team
`;
};

module.exports = {
    approvalTemplate,
    rejectionTemplate
};