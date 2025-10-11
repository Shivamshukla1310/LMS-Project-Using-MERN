import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./Models/course.model.js";
import Lecture from "./Models/lecture.model.js";
import { uploadMedia } from "./utils/cloudinary.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

try {
  // Upload the video file once
  console.log("📤 Uploading Sample.mp4 to Cloudinary...");
  const uploadResponse = await uploadMedia("./assets/lectures/Sample.mp4");
  console.log("✅ Video uploaded:", uploadResponse.secure_url);

  // Get all available courses
  const courses = await Course.find({});
  if (courses.length === 0) {
    console.log("⚠️ No courses found! Run seedCourse.js first.");
    process.exit(1);
  }

  // Add the same lecture to each course
  for (const course of courses) {
    const lecture = await Lecture.create({
      lectureTitle: `${course.courseTitle} - Sample Lecture`,
      videoUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      isPreviewFree: true,
    });

    course.lectures.push(lecture._id);
    await course.save();

    console.log(`🎥 Sample lecture added to: ${course.courseTitle}`);
  }

  console.log("✅ All courses now have the same Sample.mp4 lecture!");
} catch (error) {
  console.error("❌ Error seeding lectures:", error);
} finally {
  mongoose.connection.close();
}
