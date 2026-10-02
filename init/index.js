require("dotenv").config();        
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");   

const MONGO_URL = process.env.ATLASDB_URL; 

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  const user = await User.findOne({ username: "kushagragoyal" }); 
  if (!user) {
    console.log("User nahi mila, username check karo");
    return;
  }

  await Listing.deleteMany({});

  const defaultGeometry = {
    type: "Point",
    coordinates: [72.8777, 19.0760] // Mumbai
  };

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
    category: obj.category || "Trending",
    geometry: obj.geometry || defaultGeometry
  }));

  await Listing.insertMany(initData.data);

  console.log("data was initialized");
};

initDB().then(() => mongoose.connection.close()); 