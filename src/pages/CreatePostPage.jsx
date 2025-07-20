 //import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  updatePostText,
  updatePostImage,
  resetCreatePostForm,
  createPost,
} from "../store/Slices/PostSlices";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";
import UploadImages from "./UploadImages";
import CloudinaryUploadWidget from '../components/cloudinaryUploadWidget';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import Footer from "../components/layout/Footer";

function CreatePostPage() {

  const dispatch = useDispatch();
  const { status, error, createPostForm } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth.userInfo);
  const [imageFile, setImageFile] = useState(null);
  const [Preview, setImagePreview] = useState(null);

  const charLimit = 280;

  const cloudName = 'doa9xmvsa';
  const uploadPreset = 'connecthub';

   const [publicId, setPublicId] = useState('')

 const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

    // Upload Widget Configuration

 const uwConfig = {
    cloudName,
    uploadPreset,
    // Uncomment and modify as needed:
    // cropping: true,
    // showAdvancedOptions: true,
    // sources: ['local', 'url'],
    // multiple: false,
    // folder: 'user_images',
    // tags: ['users', 'profile'],
    // context: { alt: 'user_uploaded' },
    // clientAllowedFormats: ['images'],
    // maxImageFileSize: 2000000,
    // maxImageWidth: 2000,
    // theme: 'purple',
  };
  

  // Handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!createPostForm.text.trim()) return;
    const imageUrl = publicId ? cld.image(publicId).toURL() : "";
    dispatch(createPost({ text: createPostForm.text, imageUrl }))
      .unwrap()
      .then(() => {
        dispatch(resetCreatePostForm());
        setImagePreview(null);
      })
      .catch((err) => {
        console.error("Post creation failed:", err);
      });
  };

  return (

    <div className="flex flex-row mt-10 md:ml-48 max-w-7xl ">

      <Sidebar />
      
      <div className="max-w-xl mx-auto p-4 w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-4 space-y-4"
        >
          <div className="flex items-start gap-4">
            <img
              src={user?.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <textarea
              rows="3"
              value={createPostForm.text}
              onChange={(e) => dispatch(updatePostText(e.target.value))}
              maxLength={charLimit}
              placeholder="What's on your mind?"
              className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={status === "loading"}
              required
            />
          </div>
      
          {Preview && (
            <div className="relative">
              <img
                src={Preview}
                alt="Preview"
                className="max-h-60 w-full object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800">
              
              <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
            </label>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {createPostForm.text.length}/{charLimit}
              </span>
              <button
                type="submit"
                disabled={status === "loading" || !createPostForm.text.trim()}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}
        </form>
      </div>
      {publicId && (
        <div
          className="image-preview"
          style={{ width: '800px', margin: '20px auto' }}
        >
          <AdvancedImage
            style={{ maxWidth: '100%' }}
            cldImg={cld.image(publicId)}
            plugins={[responsive(), placeholder()]}
          />
        </div>
      )}
      <div className="flex-grow"></div>
      {/* Footer is only visible on mobile devices */}
      <Footer />
    </div>
  );
}

export default CreatePostPage;
