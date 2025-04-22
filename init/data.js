const sampleListings = [
  {
    title: "Luxury Mountain Resort",
    description: "Experience ultimate luxury in our 5-star mountain resort with panoramic views and premium amenities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    price: 3500,
    location: "Aspen",
    country: "United States",
    category: "Resort",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
    numberOfRooms: 50,
    bedrooms: 25,
    bathrooms: 30,
    guests: 100,
    contactPhone: "+1-555-0123",
    contactEmail: "luxury@mountain-resort.com",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    roomType: "Suite",
    geometry: {
      type: "Point",
      coordinates: [-106.8222, 39.1911]
    }
  },
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    category: "Cottage",
    amenities: ["WiFi", "Parking", "Air Conditioning"],
    numberOfRooms: 2,
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    contactPhone: "+1-555-0124",
    contactEmail: "cozy@beachfront.com",
    checkIn: "4:00 PM",
    checkOut: "10:00 AM",
    roomType: "Cottage",
    geometry: {
      type: "Point",
      coordinates: [-118.6919, 34.0259]
    }
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    category: "Apartment",
    amenities: ["WiFi", "Gym", "Air Conditioning"],
    numberOfRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    contactPhone: "+1-555-0125",
    contactEmail: "modern@cityloft.com",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    roomType: "Loft",
    geometry: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    }
  },
  {
    title: "Mountain Retreat",
    description: "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    category: "Cottage",
    amenities: ["WiFi", "Parking", "Air Conditioning"],
    numberOfRooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    guests: 6,
    contactPhone: "+1-555-0126",
    contactEmail: "retreat@mountain.com",
    checkIn: "4:00 PM",
    checkOut: "10:00 AM",
    roomType: "Cabin",
    geometry: {
      type: "Point",
      coordinates: [-106.8182, 39.1911]
    }
  },
  {
    title: "Historic Villa in Tuscany",
    description: "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    category: "Villa",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
    numberOfRooms: 8,
    bedrooms: 6,
    bathrooms: 5,
    guests: 12,
    contactPhone: "+39-555-0127",
    contactEmail: "villa@tuscany.com",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    roomType: "Villa",
    geometry: {
      type: "Point",
      coordinates: [11.2558, 43.7696]
    }
  },
  {
    title: "Secluded Treehouse Getaway",
    description: "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 800,
    location: "Portland",
    country: "United States",
    category: "Other",
    amenities: ["WiFi", "Parking", "Air Conditioning"],
    numberOfRooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    contactPhone: "+1-555-0128",
    contactEmail: "treehouse@nature.com",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    roomType: "Treehouse",
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231]
    }
  },
  {
    title: "Beachfront Paradise",
    description: "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    category: "Resort",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
    numberOfRooms: 30,
    bedrooms: 15,
    bathrooms: 20,
    guests: 60,
    contactPhone: "+52-555-0129",
    contactEmail: "paradise@beach.com",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    roomType: "Suite",
    geometry: {
      type: "Point",
      coordinates: [-86.7537, 21.1619]
    }
  },
  {
    title: "Rustic Cabin by the Lake",
    description: "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    category: "Cottage",
    amenities: ["WiFi", "Pool", "Air Conditioning"],
    numberOfRooms: 2,
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    contactPhone: "+1-555-0130",
    contactEmail: "cabin@laketahoe.com",
    checkIn: "4:00 PM",
    checkOut: "10:00 AM",
    roomType: "Cabin",
    geometry: {
      type: "Point",
      coordinates: [-120.0324, 39.0968]
    }
  }
];

module.exports = { data: sampleListings };