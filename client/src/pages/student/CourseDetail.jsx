import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "features/apis/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg font-semibold">
        Loading course details...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 font-semibold">
        Failed to load course details.
      </div>
    );
  }

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-[#1E1F20] text-white shadow-inner">
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 flex flex-col gap-3">
          <h1 className="font-bold text-3xl md:text-4xl">{course?.courseTitle}</h1>
          <p className="text-base md:text-lg text-gray-300">
            {course?.subTitle || "Learn from scratch with hands-on examples"}
          </p>

          <p className="text-sm text-gray-400">
            Created by{" "}
            <span className="text-indigo-300 font-medium underline">
              {course?.creator?.name}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <BadgeInfo size={16} />
              <span>Last updated {course?.createdAt?.split("T")[0]}</span>
            </div>
            <span>•</span>
            <span>Students enrolled: {course?.enrolledStudents?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        {/* Left: Course Details */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p
              className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            />
          </div>

          {/* Course Content */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Course Content</CardTitle>
              <CardDescription>
                {course?.lectures?.length || 0} Lectures Included
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {course?.lectures?.length > 0 ? (
                course.lectures.map((lecture, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>
                      {purchased ? (
                        <PlayCircle className="text-green-600" size={16} />
                      ) : (
                        <Lock className="text-gray-500" size={16} />
                      )}
                    </span>
                    <p className="truncate">{lecture.lectureTitle}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No lectures added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Video + Buy Section */}
        <div className="w-full lg:w-1/3">
          <Card className="sticky top-20 shadow-lg border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course?.lectures?.[0]?.videoUrl}
                  controls
                />
              </div>
              <h1 className="text-lg font-semibold mb-1">
                {course?.lectures?.[0]?.lectureTitle || "Course Preview"}
              </h1>
              <Separator className="my-3" />
              <h1 className="text-xl font-bold mb-4">
                Price: ₹{course?.coursePrice}
              </h1>
            </CardContent>

            <CardFooter className="p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full font-semibold">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
