import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (filePath) => {
  try {
    if (!filePath) throw new Error("No file path provided for upload.");

    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // remove file from local storage after upload
    fs.unlinkSync(filePath);

    console.log("✅ Uploaded successfully:", uploadResponse.secure_url);
    return uploadResponse;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    return null;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("No publicId provided for deletion.");
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Deleted media:", result);
  } catch (error) {
    console.error("❌ Error deleting media:", error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("No publicId provided for video deletion.");
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    console.log("🗑️ Deleted video:", result);
  } catch (error) {
    console.error("❌ Error deleting video:", error);
  }
};
