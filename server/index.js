import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.routes.js";

dotenv.config({});

// Call Database connection Here
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http//localhost:8080",
  credentials: true
}));

// Apis
app.use("/api/v1/user", userRoute);

app.get("/home", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Hello i am coming from backend"
  })
})

app.listen(PORT, () => {
  console.log(`Server listen at Port ${PORT}`);
})
