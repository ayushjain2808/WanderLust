const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:'67a108d9f2448a36545b30b2'
    }));
    await Listing.insertMany(initData.data);
    console.log("Data is initiazed");
};

initDB();