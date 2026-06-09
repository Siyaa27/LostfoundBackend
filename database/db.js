// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const uri="mongodb+srv://siyanarula27_db_user:password%40123@cluster0.32efd4y.mongodb.net/LostAndFound?retryWrites=true&w=majority&appName=Cluster0";
    console.log(uri);
    const conn = await mongoose.connect("mongodb+srv://siyanarula27_db_user:password%40123@cluster0.32efd4y.mongodb.net/LostAndFoundDb?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
