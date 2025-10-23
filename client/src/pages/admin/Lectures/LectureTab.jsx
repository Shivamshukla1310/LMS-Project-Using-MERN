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
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [setBtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [edtiLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await edtiLecture({
      lectureTitle,
      videoInfo: uploadVideInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) toast.success(data.message);
    if (error) toast.error(error.data.message);
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) toast.success(removeData.message);
  }, [removeSuccess]);

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
          {uploadVideInfo?.videoUrl && (
            <video
              src={uploadVideInfo.videoUrl}
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
