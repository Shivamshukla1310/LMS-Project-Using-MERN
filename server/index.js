import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.routes.js";

dotenv.config({});

// Call Database connection Here
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Apis
app.use("api/v1/user", userRoute);

app.get("/home", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Hello i am coming from backend"
  })
})

app.listen(PORT, () => {
  console.log(`Server listen at Port ${PORT}`);
})
