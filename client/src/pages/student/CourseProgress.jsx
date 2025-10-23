import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "features/apis/courseProgressApi";
import { CheckCircle2, CirclePlay, Video } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: completeData, isSuccess: completeSuccess }] =
    useCompleteCourseMutation();
  const [inCompleteCourse, { data: inCompleteData, isSuccess: inCompleteSuccess }] =
    useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  // ✅ Toast & refetch after marking course complete/incomplete
  useEffect(() => {
    if (completeSuccess) {
      refetch();
      toast.success(completeData?.message || "Course marked as completed!");
    }
    if (inCompleteSuccess) {
      refetch();
      toast.success(inCompleteData?.message || "Course marked as incomplete!");
    }
  }, [completeSuccess, inCompleteSuccess, completeData, inCompleteData, refetch]);

  // ✅ Conditional returns
  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading course progress...</p>;
  if (isError || !data?.data)
    return <p className="text-center text-red-500 mt-10">Failed to load course progress</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, lectures = [] } = courseDetails;

  const initialLecture = currentLecture || lectures[0];

  // ✅ Check if lecture completed
  const isLectureCompleted = useCallback(
    (lectureId) => progress.some((p) => p.lectureId === lectureId && p.viewed),
    [progress]
  );

  // ✅ Handle lecture progress
  const handleLectureProgress = useCallback(
    async (lectureId) => {
      try {
        await updateLectureProgress({ courseId, lectureId });
        refetch();
      } catch {
        toast.error("Failed to update lecture progress");
      }
    },
    [courseId, updateLectureProgress, refetch]
  );

  // ✅ Select lecture
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  // ✅ Toggle course completion
  const handleCompleteToggle = async () => {
    if (completed) await inCompleteCourse(courseId);
    else await completeCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3">
        <h1 className="text-2xl md:text-3xl font-bold">{courseTitle}</h1>
        <Button
          onClick={handleCompleteToggle}
          variant={completed ? "outline" : "default"}
          className="mt-3 md:mt-0 flex items-center gap-2"
        >
          {completed ? (
            <>
              <CheckCircle2 size={18} className="text-green-600" />
              <span>Completed</span>
            </>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Video Player */}
        <div className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md overflow-hidden p-4">
          {initialLecture?.videoUrl ? (
            <video
              key={initialLecture._id}
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-[300px] md:h-[400px] rounded-lg shadow-sm"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-[300px] text-gray-500">
              <Video size={36} className="mb-2" />
              <p>No video available for this lecture</p>
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              Lecture{" "}
              {lectures.findIndex(
                (l) => l._id === (currentLecture?._id || initialLecture._id)
              ) + 1}
              :{" "}
              {currentLecture?.lectureTitle || initialLecture?.lectureTitle || "Untitled"}
            </h3>
          </div>
        </div>

        {/* Lecture Sidebar */}
        <div className="w-full lg:w-[35%] bg-white dark:bg-[#181818] rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          {lectures.length === 0 ? (
            <p className="text-gray-500">No lectures available.</p>
          ) : (
            <div className="max-h-[480px] overflow-y-auto pr-2 space-y-3">
              {lectures.map((lecture) => {
                const completed = isLectureCompleted(lecture._id);
                const isActive = lecture._id === (currentLecture?._id || initialLecture._id);
                return (
                  <Card
                    key={lecture._id}
                    onClick={() => handleSelectLecture(lecture)}
                    className={`cursor-pointer transition-transform hover:scale-[1.02] ${isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                  >
                    <CardContent className="flex justify-between items-center p-3">
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <CheckCircle2 size={20} className="text-green-500" />
                        ) : (
                          <CirclePlay size={20} className="text-gray-500" />
                        )}
                        <CardTitle className="text-base font-medium truncate">
                          {lecture.lectureTitle}
                        </CardTitle>
                      </div>
                      {completed && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 text-xs"
                        >
                          Done
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
