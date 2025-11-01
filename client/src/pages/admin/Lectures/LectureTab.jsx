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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "features/apis/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const params = useParams();
  const navigate = useNavigate();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  // RTK Query mutations
  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  // Populate form on load
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsFree(lecture.isPreviewFree || false);
      setUploadVideoInfo(lecture.videoInfo || null);
    }
  }, [lecture]);

  // ✅ Handle video upload
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setMediaProgress(true);

    try {
      const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
        onUploadProgress: ({ loaded, total }) =>
          setUploadProgress(Math.round((loaded * 100) / total)),
      });

      // ✅ Adjust based on backend response shape
      const videoData = res.data?.data;
      if (videoData?.url) {
        setUploadVideoInfo({
          videoUrl: videoData.url,
          publicId: videoData.public_id,
        });
        toast.success(res.data?.message || "Video uploaded successfully!");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  // ✅ Update lecture handler
  const editLectureHandler = async () => {
    try {
      await editLecture({
        lectureTitle,
        videoInfo: uploadVideoInfo,
        isPreviewFree: isFree,
        courseId,
        lectureId,
      }).unwrap();

      toast.success("Lecture updated successfully!");
      navigate(`/admin/course/${courseId}/lectures`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update lecture");
    }
  };

  // ✅ Remove lecture handler
  const removeLectureHandler = async () => {
    try {
      await removeLecture(lectureId).unwrap();
      toast.success("Lecture removed successfully");
      navigate(`/admin/course/${courseId}/lectures`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove lecture");
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Edit Lecture
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Make changes and click <span className="font-medium">Update Lecture</span> when done.
          </CardDescription>
        </div>
        <Button
          disabled={removeLoading}
          variant="destructive"
          onClick={removeLectureHandler}
          className="text-white font-medium"
        >
          {removeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 mt-4">
        {/* Lecture Title */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Lecture Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
            className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        {/* Video Upload */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="cursor-pointer w-fit border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition"
          />
          {uploadVideoInfo?.videoUrl && (
            <video
              src={uploadVideoInfo.videoUrl}
              controls
              className="rounded-lg border mt-2 w-full max-h-64 shadow-sm"
            />
          )}
        </div>

        {/* Free Preview Switch */}
        <div className="flex items-center gap-3 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="free-video" />
          <Label htmlFor="free-video" className="text-gray-700 font-medium">
            Make this video free to preview
          </Label>
        </div>

        {/* Upload Progress */}
        {mediaProgress && (
          <div className="space-y-2 my-4">
            <Progress value={uploadProgress} />
            <p className="text-sm text-gray-500 font-medium text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            disabled={isLoading}
            onClick={editLectureHandler}
            className="px-6 py-2 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
