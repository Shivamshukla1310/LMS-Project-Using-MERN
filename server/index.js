import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

dotenv.config({});

// call database connection here
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173", "https://learning-project-moodle-application.vercel.app/"
];

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (like Postman) and check deployed origin
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// routes...
// app.post("/api/v1/user/register", (req, res) => {
//   res.json({ message: "User registered successfully" });
// });

// apis
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);


app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
})

