import { useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";

console.log ("uploadImageClicked")
const CloudinaryUploadWidget = ({ uwConfig, setPublicId, setUploadResult }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result) {
              console.log("Upload event:", result.event, result.info);
              
              if (result.event === "success") {
                console.log("Upload successful:", result.info);
                setPublicId(result.info.public_id);
                setUploadResult(result.info);
              } else if (result.event === "progress") {
                console.log("Upload progress:", result.data.percent);
              } else if (result.event === "source-changed") {
                console.log("File selected:", result.info);
                // File has been selected, show uploading state
                setUploadResult({ event: "source-changed" });
              } else if (result.event === "upload-added") {
                console.log("Upload added to queue:", result.info);
              } else if (result.event === "upload-started") {
                console.log("Upload started:", result.info);
              } else if (result.event === "error") {
                console.error("Upload error:", result);
              }
            } else if (error) {
              console.error("Upload failed:", error);
            }
          }
        );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener("click", handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener("click", handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setPublicId, setUploadResult]);

  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
      title="Upload Image"
    >
      <FaCamera className="text-lg" />
      <span>Add Photo</span>
    </button>
  );
};

export default CloudinaryUploadWidget;