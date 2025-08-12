import React, { useState, useEffect, useCallback } from "react";
import { ToastAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//CUSTOM Hooks

/**
 * Custom hook for API data fetching with loading, error, and data states.
 *
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} loadOnMount - Whether to fetch data when component mounts
 * @param {Array} deps - Dependencies array that triggers refetch when changed
 * @param {Array} args - Arguments to pass to the API function
 * @returns {Object} Object containing {data, loading, error, refetch}
 */
export const useApiRequest = (apiFunction, loadOnMount = true, deps = [], args = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(loadOnMount);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, ...args, ...deps]);

  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
  }, [fetchData, loadOnMount]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Higher-order hook for data fetching with automatic token handling
 *
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Additional options
 * @returns {Object} Object containing {data, loading, error, refetch}
 */
export const useAuthenticatedApi = (apiFunction, options = {}) => {
  const { loadOnMount = true, deps = [], args = [] } = options;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const authToken = await AsyncStorage.getItem("AccessToken");
        setToken(authToken);
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    getToken();
  }, []);

  return useApiRequest(apiFunction, token !== null && loadOnMount, [...deps, token], args);
};

/**
 * Custom hook to manage pagination for API requests.
 *
 * @param {Function} apiFunction - The API function to call
 * @param {Object} initialParams - Initial parameters for the API call
 * @returns {Object} Object containing paginated data and controls
 */
export const usePaginatedApi = (apiFunction, initialParams = { page: 1, limit: 10 }) => {
  const [params, setParams] = useState(initialParams);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, refetch } = useApiRequest(apiFunction, true, [params], [params]);

  useEffect(() => {
    if (data) {
      const isFirstPage = params.page === 1;
      const newItems = data.results || data.items || data;

      setAllData(prev => (isFirstPage ? newItems : [...prev, ...newItems]));

      // Check if there are more items to load
      const total = data.total || 0;
      const loadedCount = isFirstPage ? newItems.length : allData.length + newItems.length;
      setHasMore(loadedCount < total);
    }
  }, [data, params.page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const refresh = () => {
    setParams(initialParams);
    setAllData([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

/**
 * Custom hook for managing infinite scrolling lists.
 *
 * @param {Function} fetchFunction - Function to fetch the next page of data
 * @param {number} threshold - How close to the end of the list to trigger next page (0-1)
 * @returns {Object} Object with scroll handler and loading state
 */
export const useInfiniteScroll = (fetchFunction, threshold = 0.8) => {
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(
    ({ nativeEvent }) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 20;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom - layoutMeasurement.height * (1 - threshold);

      if (isCloseToBottom && !loading) {
        setLoading(true);
        fetchFunction().finally(() => setLoading(false));
      }
    },
    [fetchFunction, loading, threshold]
  );

  return {
    handleScroll,
    isLoadingMore: loading,
  };
};

/**
 * Custom hook for handling form data with validation.
 *
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validateFn = () => ({}), onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = name => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field on blur
    const fieldErrors = validateFn({ [name]: values[name] });
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateFn(values);
    setErrors(formErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
};

// Helper Functions

/**
 * Helper function to handle API mutations with consistent error handling.
 *
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options including args, onSuccess, onError, and successMessage
 * @returns {Promise} The result of the API call
 */
export const handleApiMutation = async (apiFunction, options = {}) => {
  const { args = [], onSuccess, onError, successMessage = "Operation successful" } = options;

  try {
    const response = await apiFunction(...args);
    // console.log(response)

    // Show success message if provided
    if (successMessage) {
      if (Platform.OS === "android") {
        ToastAndroid.show(successMessage, ToastAndroid.SHORT);
      } else {
        // You can add iOS-specific toast implementation here if needed
        // console.log(successMessage);
      }
    }

    // Call success callback if provided
    if (onSuccess && typeof onSuccess === "function") {
      onSuccess(response);
    }

    return response;
  } catch (error) {
    // Handle error
    const errorMessage = error.message || "Something went wrong";

    if (Platform.OS === "android") {
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    } else {
      // You can add iOS-specific toast implementation here if needed
      console.log(errorMessage);
    }

    // Call error callback if provided
    if (onError && typeof onError === "function") {
      onError(error);
    }

    throw error; // Re-throw for further handling if needed
  }
};

/**
 * Creates FormData for multiple file uploads compatible with Multer.
 *
 * @param {Array} files - Array of file objects with uri, name, and type
 * @param {Object} additionalFields - Additional form fields to include
 * @returns {FormData} The FormData object
 *
 * @example
 * // Example usage with multiple files
 * const files = [
 *   { uri: 'file://path/to/image.jpg', name: 'image.jpg', type: 'image' },
 *   { uri: 'file://path/to/doc.pdf', name: 'doc.pdf', type: 'document' }
 * ];
 *
 * const formData = createMultipleFileFormData(files, {
 *   note: 'Patient report',
 *   doctorId: '12345'
 * });
 *
 * // This creates FormData structure like:
 * // files: [File object 1]
 * // files: [File object 2]
 * // note: 'Patient report'
 * // doctorId: '12345'
 */
export const createMultipleFileFormData = (files = [], additionalFields = {}) => {
  const formData = new FormData();

  // Add each file individually (this is what Multer expects)
  files.forEach((file, index) => {
    // Determine proper MIME type
    let mimeType = "application/octet-stream"; // Default fallback

    if (file.type === "image" || file.name?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      // For images, try to determine specific type
      const extension = file.name?.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "gif":
          mimeType = "image/gif";
          break;
        case "bmp":
          mimeType = "image/bmp";
          break;
        case "webp":
          mimeType = "image/webp";
          break;
        default:
          mimeType = "image/jpeg"; // Default for images
      }
    } else if (file.type === "document" || file.name?.match(/\.(pdf|doc|docx|txt)$/i)) {
      // For documents, try to determine specific type
      const extension = file.name?.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "pdf":
          mimeType = "application/pdf";
          break;
        case "doc":
          mimeType = "application/msword";
          break;
        case "docx":
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case "txt":
          mimeType = "text/plain";
          break;
        default:
          mimeType = "application/octet-stream";
      }
    }

    // Create file object for FormData
    const fileObject = {
      uri: file.uri,
      name: file.name || `file_${index}`,
      type: mimeType,
    };

    // Append each file with the same field name "files"
    // This allows Multer's upload.array("files", 5) to work correctly
    formData.append("files", fileObject);
  });

  // Add additional fields
  Object.keys(additionalFields).forEach(key => {
    const value = additionalFields[key];
    if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  return formData;
};

/**
 * Example of how to use the FormData with fetch for file uploads
 *
 * @example
 * const uploadFiles = async (files, appointmentId) => {
 *   const formData = createMultipleFileFormData(files, {
 *     note: 'Medical report',
 *     doctorId: '12345'
 *   });
 *
 *   try {
 *     const response = await fetch(`/api/prescription/${appointmentId}`, {
 *       method: 'POST',
 *       body: formData,
 *       headers: {
 *         'Content-Type': 'multipart/form-data',
 *         'Authorization': `Bearer ${token}`
 *       }
 *     });
 *
 *     if (!response.ok) {
 *       throw new Error(`HTTP error! status: ${response.status}`);
 *     }
 *
 *     const result = await response.json();
 *     console.log('Upload successful:', result);
 *     return result;
 *   } catch (error) {
 *     console.error('Upload failed:', error);
 *     throw error;
 *   }
 * };
 */

/**
 * Creates FormData for file uploads.
 *
 * @param {Object} data - Object containing data to convert to FormData
 * @param {Array} fileFields - Array of field names that should be treated as files
 * @returns {FormData} The FormData object
 */
export const createFormData = (data, fileFields = []) => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (fileFields.includes(key) && data[key]) {
      // Handle file fields
      const fileUri = data[key];
      const fileUriParts = fileUri.split(".");
      const fileType = fileUriParts[fileUriParts.length - 1];

      formData.append(key, {
        uri: fileUri,
        name: `${key}.${fileType}`,
        type: `image/${fileType}`,
      });
    } else {
      // Handle regular fields
      formData.append(key, data[key]);
    }
  });

  return formData;
};
