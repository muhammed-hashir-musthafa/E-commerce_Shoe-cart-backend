const mongoose = require("mongoose");

const connectDB = () => {
  const MongoDBURI = process.env.MongoDBURI;

  try {
    mongoose.connect(MongoDBURI);
    console.log("Mongodb Connected");
  } catch (error) {
    console.error("Error :", error.message);
  }
};

module.exports = connectDB;
