import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import { ArrowRight } from "lucide-react";

const EditCourse = () => {
  return (
    <div className="flex-1 p-6 sm:p-10 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Course Details
          </h1>
          <p className="text-gray-500 text-sm">
            Add or update course information before publishing your course.
          </p>
        </div>

        <Link to="lecture">
          <Button
            variant="outline"
            className="group flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all"
          >
            Go to Lectures
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </div>

      {/* Course Details Form Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <CourseTab />
      </div>
    </div>
  );
};

export default EditCourse;
