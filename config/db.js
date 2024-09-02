const mongoose = require("mongoose");

const connectDB = async () => {
  const MongoDBURI = process.env.MongoDBURI;
  try {
    await mongoose.connect(MongoDBURI);
    console.log(`Mongodb Connected ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error :", error.message);
  }
};

module.exports = connectDB;
