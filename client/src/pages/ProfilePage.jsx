import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useNavigate } from "react-router-dom";
import { Camera, Mail, User } from "lucide-react";
import axios from "../axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { setCurrentUser } from "../redux/currentUserSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const { loggedUser } = useSelector((store) => store.currentUser);
  const [previewImage, setPreviewImage] = useState(null); // Separate state for preview
  const [mimeType, setMimeType] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  //console.log(loggedUser);
  //console.log(imageBase64);
  //console.log(previewImage?.split(",")[1]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      //console.log(reader);
      setPreviewImage(base64Image);
    };
  };

  const updateProfile = async () => {
    console.log("In function enter 1");
    try {
      setIsUpdating(true);
      console.log(previewImage?.split(",")[1]);
      let requestBody = {
        image_data: previewImage.split(",")[1],
        image_mime_type: mimeType,
      };
      console.log(requestBody);
      const { data } = await axios.post(
        `/users/update`,
        JSON.stringify(requestBody)
      );
      console.log(data);
      dispatch(setCurrentUser(data));
      Cookies.set("user", JSON.stringify(data));
      setIsUpdating(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewImage || loggedUser?.prof_img_url || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdating ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdating}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdating
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {loggedUser?.full_name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {loggedUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{loggedUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={updateProfile}
              className="bg-slate-500 px-6 py-2 rounded-md text-yellow-50 hover:bg-slate-900"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
