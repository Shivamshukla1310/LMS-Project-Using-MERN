import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "features/apis/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    { isLoading: updateUserIsLoading },
  ] = useUpdateUserMutation();

  const user = data?.user;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    if (!name && !profilePhoto) {
      toast.error("Please provide a new name or profile photo.");
      return;
    }

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    try {
      await updateUser(formData).unwrap();
      toast.success("Profile updated successfully.");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) return <h1 className="text-center mt-10">Loading profile...</h1>;
  if (!user) return <h1 className="text-center mt-10">No profile data found.</h1>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 my-18">
      {/* Profile Header */}
      <h1 className="font-extrabold text-3xl text-center md:text-left mb-10">
        My Profile
      </h1>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 mb-4 ring-4 ring-primary/10">
            <AvatarImage
              src={user.photoUrl || "https://github.com/shadcn.png"}
              alt={user.name || "User"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Name:{" "}
            <span className="font-normal text-gray-700 dark:text-gray-300">
              {user.name || "N/A"}
            </span>
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Email:{" "}
            <span className="font-normal text-gray-700 dark:text-gray-300">
              {user.email || "N/A"}
            </span>
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Role:{" "}
            <span className="font-normal text-gray-700 dark:text-gray-300">
              {user.role ? user.role.toUpperCase() : "N/A"}
            </span>
          </p>

          {/* Edit Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-4">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile details below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={user.name || "Name"}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <h2 className="font-semibold text-2xl mb-6 text-center md:text-left">
          Courses You're Enrolled In
        </h2>

        {user.enrolledCourses?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            You haven’t enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
            {user.enrolledCourses.map((course) => (
              <div key={course._id} className="w-full flex justify-center">
                <Course course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
