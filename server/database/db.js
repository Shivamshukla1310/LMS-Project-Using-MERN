import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // stop the server if connection fails
  }
};

export default connectDB;
