const mongoose = require("mongoose");
const Listing = require("../Models/listing.js");
const {data} = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/tripnest";
//Connection
main().then(()=>{
    console.log("Connected for sample data");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


//initialization
const initData = async()=> {
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("data saved");
}

initData();