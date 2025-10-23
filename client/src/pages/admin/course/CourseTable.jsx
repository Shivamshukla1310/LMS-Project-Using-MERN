import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "features/apis/courseApi";
import { Edit, PlusCircle, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseTable = () => {
  const { data, isLoading, isError } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        <span className="ml-2 text-sm text-gray-500">Loading your courses...</span>
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load courses. Please try again later.</p>;
  }

  const courses = data?.courses || [];

  return (
    <Card className="p-4 m-5 shadow-md dark:bg-gray-900 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Your Courses</CardTitle>
        <Button onClick={() => navigate(`create`)} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Create New Course
        </Button>
      </CardHeader>

      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="mb-2">You haven’t created any courses yet.</p>
            <Button onClick={() => navigate("create")}>Create Your First Course</Button>
          </div>
        ) : (
          <Table>
            <TableCaption>A list of your recently created courses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                >
                  <TableCell className="font-medium">{course.courseTitle}</TableCell>
                  <TableCell>
                    {course.coursePrice ? `₹${course.coursePrice.toLocaleString()}` : "Free"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${course.isPublished
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                        } text-white`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                      title="Edit Course"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseTable;
