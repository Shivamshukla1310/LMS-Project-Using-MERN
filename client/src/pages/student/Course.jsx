import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  // Fallbacks for safety
  const thumbnail =
    course.courseThumbnail ||
    "https://via.placeholder.com/300x200.png?text=No+Image";
  const creatorImage = course.creator?.photoUrl || "https://github.com/shadcn.png";
  const creatorName = course.creator?.name || "Unknown Instructor";
  const level = course.courseLevel || "Beginner";
  const price = course.coursePrice ?? 0;

  return (
    <Link
      to={`/course-detail/${course._id}`}
      className="block transform hover:scale-[1.03] transition-transform duration-300"
    >
      <Card className="overflow-hidden rounded-2xl dark:bg-[#111827] bg-white shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-800 transition-shadow duration-300">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={thumbnail}
            alt={course.courseTitle || "Course thumbnail"}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
          <Badge
            className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm"
            variant="outline"
          >
            {level}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="px-5 py-4 space-y-3">
          {/* Title */}
          <h1 className="font-bold text-lg truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            {course.courseTitle || "Untitled Course"}
          </h1>

          {/* Instructor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={creatorImage} alt={creatorName} />
                <AvatarFallback>
                  {creatorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {creatorName}
              </h1>
            </div>
          </div>

          {/* Price */}
          <div className="pt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
            ₹{price}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
