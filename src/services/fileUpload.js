import { useSelector } from "react-redux";
import apiService from "../services/api";
import * as FileSystem from "expo-file-system";

export const getUploadUrl = async (fileName, fileType, folderName) => {
  try {
    const response = await apiService.uploadFile.getUploadPreSignedURL(
      fileName,
      fileType,
      folderName
    );
    if (response.status === 200) {
      const data = response.data.data;
      return data.uploadUrl;
    }
  } catch (error) {
    console.error("Error getting upload URL:", error);
  }
  return null;
};

export const deletePreviousFile = async ({ key, folderName }) => {
  try {
    const response = await apiService.uploadFile.deleteFile({
      key,
      folderName,
    });
    if (!response.data.success) {
      console.error("Failed to delete previous file:", response.data.message);
      throw new Error("Failed to delete previous file");
    }
    return response;
  } catch (error) {
    console.error("Error deleting previous file:", error);
  }
  return null; // Updated to return null in case of error
};

// Helper function to upload a file to S3
export const uploadToS3 = async (
  fileUri,
  fileName,
  mimeType,
  folderName = "uploads",
  setUploading
) => {
  try {
    setUploading(true);

    // Generate a unique file name
    const uniqueFileName = `${Date.now()}_${fileName}`;
    // Get the pre-signed URL
    const uploadUrl = await getUploadUrl(uniqueFileName, mimeType, folderName);
    if (!uploadUrl) {
      throw new Error("Failed to get upload URL");
    }
    // console.log("Upload URL:", uploadUrl);
    // Create a fetch request to upload the file directly to S3
    // Using the fetch API directly with the file URI

    // Use expo-file-system to read the file and upload it directly
    // const info = await FileSystem.getInfoAsync(fileUri);
    // console.log("File info:", info, info.size);
    // console.log("mime type:", mimeType);

    const response = await FileSystem.uploadAsync(uploadUrl, fileUri, {
      httpMethod: "PUT",
      headers: {
        "Content-Type": "image/*",
      },
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });
    // console.log("Upload response:", response);

    // if (response.status !== 200) {
    //   console.error("Upload failed with status:", response.status);
    //   throw new Error("Failed to upload file");
    // }

    // // Extract the S3 URL from the response
    const s3Url = uploadUrl.split("?")[0]; // Remove query params to get the base URL

    return s3Url;
    // Delete previous file if needed
    if (s3Url) {
      const key = s3Url.split("/").pop(); // Extract file name from URL
      await deletePreviousFile({ key: `${folderName}/${key}`, folderName });
    }

    return s3Url;
  } catch (error) {
    console.error("Error in uploadToS3:", error);
    Alert.alert("Upload Failed", "Could not upload file to server.");
    return null;
  } finally {
    setUploading(false);
  }
};
