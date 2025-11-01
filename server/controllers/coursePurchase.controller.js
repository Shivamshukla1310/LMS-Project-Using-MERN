// import Stripe from "stripe"; // ❌ Disabled Stripe for now
import Course from "../Models/course.model.js";
import CoursePurchase from "../Models/coursePurchase.model.js";
import Lecture from "../Models/lecture.model.js";
import User from "../Models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ❌ Temporarily disabled

// ✅ TEMP VERSION: No Stripe, just simulates checkout success
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Simulate creating a purchase without Stripe
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "completed", // mark directly as completed for testing
    });

    await newPurchase.save();

    // Also simulate adding course to user’s enrolled list
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    console.log("💡 Stripe skipped — simulated payment success");

    // Respond as if Stripe checkout succeeded
    return res.status(200).json({
      success: true,
      message: "Stripe temporarily disabled — purchase simulated successfully",
      url: `http://localhost:5173/course-progress/${courseId}`, // redirect for testing
    });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ❌ Completely disable stripeWebhook since Stripe isn't in use
export const stripeWebhook = async (req, res) => {
  console.log("⚠️ Stripe webhook disabled temporarily");
  return res.status(200).send("Stripe disabled");
};

// ✅ Leave these as they are
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }

    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
