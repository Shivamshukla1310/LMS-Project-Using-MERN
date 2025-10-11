import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./Models/course.model.js";
import User from "./Models/user.model.js";
import { uploadMedia } from "./utils/cloudinary.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

try {
  const instructor = await User.findOne({ role: "instructor" });
  if (!instructor) throw new Error("No instructor found!");

  const courses = [
    { title: "Learn React", file: "learn react.jpeg", category: "Web Development" },
    { title: "Python Crash Course", file: "Python Crash Course.jpeg", category: "Programming" },
    { title: "Master MongoDB", file: "mongodb course.png", category: "Database" },
    { title: "AI & ML Essentials", file: "AIML Course.jpeg", category: "Machine Learning" },
    { title: "Java Spring Boot", file: "Java Springboot course.png", category: "Backend Development" },
  ];

  for (const c of courses) {
    const uploadResponse = await uploadMedia(`./assets/thumbnails/${c.file}`);

    await Course.create({
      courseTitle: c.title,
      subTitle: `A complete guide to ${c.title}`,
      description: `Learn ${c.title} from scratch with hands-on projects and exercises.`,
      category: c.category,
      courseLevel: "Beginner",
      coursePrice: 0,
      courseThumbnail: uploadResponse.secure_url,
      creator: instructor._id,
      isPublished: true,
    });

    console.log(`✅ ${c.title} uploaded!`);
  }
} catch (error) {
  console.error("❌ Error seeding courses:", error);
} finally {
  mongoose.connection.close();
}
