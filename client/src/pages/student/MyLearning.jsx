import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "features/apis/authApi";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();

  const myLearning = data?.user.enrolledCourses || [];
  return (
    <div className="max-w-6xl mx-auto my-16 px-4 md:px-6">
      <h1 className="font-extrabold text-3xl text-center md:text-left mb-8">
        My Learning
      </h1>

      <div className="my-8">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            You are not enrolled in any course.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
            {myLearning.map((course, index) => (
              <div key={index} className="w-full flex justify-center">
                <Course course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-xl w-full h-44 animate-pulse"
      ></div>
    ))}
  </div>
);
