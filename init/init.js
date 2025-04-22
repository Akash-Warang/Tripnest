const mongoose = require("mongoose");
const Listing = require("../Models/listing.js");
const Reviews = require("../Models/review.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/tripnest";
//Connection
main()
  .then(() => {
    console.log("Connected for sample data");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//initialization
const initDB = async () => {
  await Reviews.deleteMany({});
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67fe81d56e08f1f0b1b4d163",
  }));
  await Listing.insertMany(initData.data);
  console.log("data saved");
};

initDB();
