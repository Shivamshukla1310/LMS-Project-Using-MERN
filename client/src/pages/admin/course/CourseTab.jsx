import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  usePublishCourseMutation,
  useGetCourseByIdQuery,
} from "features/apis/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params = useParams();
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
    useGetCourseByIdQuery(courseId);

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();
  const [publishCourse] = usePublishCourseMutation();

  // ✅ Populate state when course data is fetched
  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData.course;
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice || "",
        courseThumbnail: "",
      });
      if (course.thumbnail) {
        setPreviewThumbnail(course.thumbnail);
      }
    }
  }, [courseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) =>
    setInput((prev) => ({ ...prev, category: value }));
  const selectCourseLevel = (value) =>
    setInput((prev) => ({ ...prev, courseLevel: value }));

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save changes handler
  const updateCourseHandler = async () => {
    try {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      // await editCourse({ id: courseId, body: formData }).unwrap();
      await editCourse({ courseId, formData }).unwrap();

      toast.success("Course updated successfully!");
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update course");
    }
  };


  // ✅ Publish / Unpublish course
  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action }).unwrap();
      toast.success(response.message);
      refetch();
    } catch {
      toast.error("Failed to change publish status");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully!");
      refetch();
    }
    if (error) toast.error(error?.data?.message || "Failed to update course");
  }, [isSuccess, error, data]);

  if (courseByIdLoading)
    return <h1 className="text-center mt-10 text-lg">Loading course data...</h1>;

  return (
    <Card className="max-w-4xl mx-auto mt-8 shadow-lg rounded-xl">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your course details here. Click save when done.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={courseByIdData?.course?.lectures.length === 0}
            variant="outline"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course?.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course?.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="destructive">Remove Course</Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 mt-4">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Course Title</Label>
            <Input
              className="mt-2"
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack Developer"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              className="mt-2"
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack Developer in 2 months"
            />
          </div>

          {/* Description Section */}
          <div className="w-full">
            <Label>Description</Label>
            <div className="mt-2 border border-gray-700 rounded-md overflow-hidden">
              <RichTextEditor input={input} setInput={setInput} />
            </div>
          </div>

          {/* Course Info Row */}
          <div className="flex flex-wrap gap-5 items-center mt-6 ">
            <div>
              <Label className="mb-2">Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {[
                      "Next JS",
                      "Data Science",
                      "Frontend Development",
                      "Fullstack Development",
                      "MERN Stack Development",
                      "Javascript",
                      "Python",
                      "Docker",
                      "MongoDB",
                      "HTML",
                    ].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    {["Beginner", "Medium", "Advance"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Price (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2">Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={selectThumbnail}
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="Course Thumbnail"
                className="h-40 w-auto mt-2 rounded-md shadow-sm"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              onClick={updateCourseHandler}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Please wait
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
