import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Base URL for the API
const link = `https://staging.api.tellyoudoc.com`;
// const link = `https://staging.api.tellyoudoc.com`;

// Environment-specific configuration
const ENV = {
  dev: {
    // Use localhost for emulators, use your machine's actual IP for physical devices
    // 10.0.2.2 is the special IP for Android emulators to reach host machine
    // For iOS simulator, localhost works fine
    baseURL:
      Platform.OS === "android" && !__DEV__
        ? `${link}/api/v1` // For Android emulator
        : Platform.select({
            ios: `${link}/api/v1`, // For iOS simulator
            android: `${link}/api/v1`, // Use your actual IP address here
            // android: "https://c007-14-139-197-66.ngrok-free.app/api/v1", // Use your actual IP address here
            android: `${link}/api/v1`, // Use your actual IP address here
          }),
  },
  prod: {
    baseURL: "https://api.tellyoudoc.com/api/v1", // Production URL
  },
};

// Use development environment when running locally
const environment = __DEV__ ? ENV.dev : ENV.prod;

// console.log("API Base URL:", environment.baseURL);
// console.log("Platform:", Platform.OS);
// console.log("Is iOS:", Platform.OS === "ios");
// console.log("Is Android:", Platform.OS === "android");
// console.log("Is Physical Device:", Platform.OS === "android" && __DEV__);

// Create API client instance
export const apiClient = axios.create({
  baseURL: environment.baseURL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Platform: Platform.OS,
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    // Log API call details
    // console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    // console.log(`📡 Full URL: ${config.baseURL}${config.url}`);
    // if (config.data) {
    //   console.log("📦 Request Data:", config.data);
    // }

    // Add authentication token to headers if available

    // Print the full URL with method
    console.log("Full URL:", config.method?.toUpperCase(), config.baseURL + config.url);

    try {
      const token = await AsyncStorage.getItem("AccessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  error => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Log successful API response
    // console.log(
    //   `✅ API Success: ${response.config.method?.toUpperCase()} ${
    //     response.config.url
    //   } - Status: ${response.status}`
    // );
    // console.log("📥 Response Data:", response.data);

    // Success handler
    return response;
  },
  async error => {
    // Log API error
    // const method = error.config?.method?.toUpperCase() || "UNKNOWN";
    // const url = error.config?.url || "UNKNOWN";
    // const status = error.response?.status || "NO_STATUS";
    // console.error(`❌ API Error: ${method} ${url} - Status: ${status}`);
    // console.error("🔥 Error Details:", error.response?.data || error.message);

    const originalRequest = error.config;

    // Handle token refresh for 401 errors (if needed)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = await AsyncStorage.getItem("RefreshToken");
        if (refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(`${environment.baseURL}/auth/refresh`, {
            refreshToken,
          });

          // Save new tokens
          await AsyncStorage.setItem("AccessToken", response.data.accessToken);
          await AsyncStorage.setItem("RefreshToken", response.data.refreshToken); // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return apiClient(originalRequest);
        } else {
          // No refresh token available, handle token expiration
          await handleTokenExpiration();
        }
      } catch (refreshError) {
        // If refresh fails, handle token expiration
        console.error("Error refreshing token:", refreshError);
        await handleTokenExpiration();
      }
    }

    // TODO: Transform error for consistent handling
    const errorResponse = {
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || "Unknown error occurred",
      data: error.response?.data || null,
      originalError: error,
    };

    return Promise.reject(errorResponse);
  }
);

// Handle token expiration - log out the user
const handleTokenExpiration = async () => {
  try {
    await AsyncStorage.removeItem("AccessToken");
    await AsyncStorage.removeItem("AsUser");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// API service methods
const apiService = {
  // Auth endpoints
  auth: {
    login: data => apiClient.post("/users/login", data),
    register: data => apiClient.post("/users/register", data),
    forgotPassword: email => apiClient.post("/users/forgot-password", { email }),
    resetPassword: data => apiClient.post("/users/reset-password", data),
    logout: () => apiClient.post("/users/logout"),
    refreshToken: refreshToken => apiClient.post("/auth/refresh", { refreshToken }),
    verifyOTP: (phoneNumber, otp) =>
      apiClient.post("/auth/verify-otp-patient", { phoneNumber, otp }),
    resendOTP: (countryCode, phoneNumber) =>
      apiClient.post("/auth/generate-otp", { countryCode, phoneNumber }),
  },

  // User profile endpoints
  profile: {
    getProfile: () => apiClient.get("/patient/profile"),
    updateProfile: data => apiClient.patch("/patient/profile", data),
    updateProfileImage: formData =>
      apiClient.patch("/patient/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    deleteProfileImage: () => apiClient.patch("/patient/deleteProfileImage", {}),
    updateAddress: data => apiClient.patch("/patient/profile", data),
    updateContact: data => apiClient.patch("/patient/profile", data),

    // Saved Doctors
    getDoctorDetails: (doctorUDI_id, scan = false) =>
      apiClient.get(`/patient/getDoctorDetails/${doctorUDI_id}/${scan}`),
    saveDoctor: id => apiClient.post(`/patient/saveDoctorId/${id}`),
    removeDoctor: doctorId => apiClient.post(`/patient/remove-doctor`, { doctorId }),
    getDoctors: () => apiClient.get("/patient/saved-doctors"),
    createProfile: data => apiClient.post("/patient/create-profile", data),
    // Send OTP to Contact Number
    sendContactNumberOTP: data => apiClient.post("/patient/phone-number/request-change-otp", data),
    // Verify OTP for Contact Number
    verifyContactNumberOTP: data => apiClient.post("/patient/phone-number/update", data),
    // Change Email
    // Send OTP to Email
    sendEmailOTP: data => apiClient.post("/patient/email/add", data),
    // Verify Email OTP
    verifyUpdateOTP: data => apiClient.post("/patient/email/verify", data),
    //Symptoms
    addSymptoms: formData =>
      apiClient.post("/patient/addSymptoms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    // add other users
    addBehalfUser: userData => apiClient.post("/patient/addBehalfUser", userData),
    deleteBehalfUser: userId => apiClient.delete(`/patient/deleteBehalfUser/${userId}`),
  },

  // Health records endpoints
  healthRecords: {
    getPrescriptions: appointmentId =>
      apiClient.get(`/patient/prescriptions?appointmentId=${appointmentId}`),
    getPrescriptionsForPatient: () => apiClient.get("/patient/prescriptions-for-patient"),
    getReportsForPatient: () => apiClient.get("/patient/reports-for-patient"),
    getReports: appointmentId => apiClient.get(`/patient/reports?appointmentId=${appointmentId}`),
    uploadPrescription: (formData, appointmentId) =>
      apiClient.post(`/patient/prescription/${appointmentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    uploadReport: (formData, appointmentId) =>
      apiClient.post(`/patient/report/${appointmentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    createNote: data => apiClient.post("/health-records/notes", data),
    updateNote: (id, data) => apiClient.put(`/health-records/notes/${id}`, data),
    deleteNote: id => apiClient.delete(`/health-records/notes/${id}`),
    getRecords: params => apiClient.get("/health-records", { params }),
    getRecordById: id => apiClient.get(`/health-records/${id}`),
    uploadRecord: formData =>
      apiClient.post("/health-records", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    updateRecord: (id, recordData) => apiClient.put(`/health-records/${id}`, recordData),
    deleteRecord: id => apiClient.delete(`/health-records/${id}`),

    // Delete report
    deleteReport: id => apiClient.delete(`/patient/report/delete?reportId=${id}`),

    // deleteSpecificReport
    deleteSpecificReport: (reportId, s3Key) =>
      apiClient.delete(`/patient/report/file?reportId=${reportId}&s3Key=${s3Key}`),

    // Delete prescription
    deletePrescription: id => apiClient.delete(`/patient/prescription/delete?prescriptionId=${id}`),

    // deleteSpecificPrescription
    deleteSpecificPrescription: (prescriptionId, s3Key) =>
      apiClient.delete(
        `/patient/prescription/file?prescriptionId=${prescriptionId}&s3Key=${s3Key}`
      ),
    getSymptoms: appointmentId => apiClient.get(`/patient/getSymptoms/${appointmentId}`),

    // Get doctors, and patients from Ongoing Treatments from DB for Uploading Documents
    getDoctorsAndPatients: () => apiClient.get("/appointments/ongoing-treatments/doctors-patients"),
  },

  // Doctor-related endpoints
  doctors: {
    getMyDoctors: () => apiClient.get("/patient-doctor/show/doctors"),
    getDoctorById: UDI_id => apiClient.get(`/patient-doctor/show/doctor/${UDI_id}`),
    getDoctorSendRequests: () => apiClient.get("/patient-doctor/patient/doctor-requests"),
    cancelRequest: id => apiClient.post(`/patient-doctor/patient/cancel-request/${id}`),
    getCurrentDoctors: () => apiClient.get("/patient-doctor/my-doctor"),
    sendDoctorRequest: id => apiClient.post(`/patient-doctor/send-request/${id}`),

    addDoctor: id => apiClient.post("/patient-doctor/add", { doctorId: id }),
    removeDoctor: id => apiClient.delete(`/patient-doctor/remove/${id}`),
    searchDoctors: query => apiClient.get(`/patient-doctor/search?query=${query}`),
    getDoctorAvailability: (id, date) => apiClient.get(`/appointments/slots/${id}/${date}`),
    getAvailableDates: doctorId => apiClient.get(`/appointments/available/${doctorId}`),
  },

  // Appointments endpoints
  appointments: {
    checkOngoingTreatments: ({ doctorId, behalfUserId }) => {
      let url = `/appointments/check-ongoing-treatment/${doctorId}`;
      if (behalfUserId) {
        url += `?behalfUserId=${behalfUserId}`;
      }
      return apiClient.get(url);
    },
    bookAppointment: (doctorId, data) => apiClient.post(`/appointments/book/${doctorId}`, data),
    getAppointments: (type, page, limit, sortBy, sortOrder) =>
      apiClient.get(`/appointments/details`, {
        params: {
          type,
          page,
          limit,
          sortBy,
          sortOrder,
        },
      }),
    getDoctorAppointments: doctorId => apiClient.get(`/appointments/details?doctorId=${doctorId}`),
    getAvailableAppointments: doctorId => apiClient.get(`/appointments/available/${doctorId}`),

    getFollowupAppointments: appointmentId =>
      apiClient.get(`/appointments/followup-appointments/${appointmentId}`),

    // Get upcoming appointments
    getUpcomingAppointments: () =>
      apiClient.get("/appointments/allPatientBookedUpcomingAppointments"),

    // Get today's appointments
    getTodaysAppointments: () => apiClient.get("/appointments/allPatientBookedTodayAppointments"),

    // Get appointment requests
    getAppointmentRequests: () => apiClient.get("/appointments/allPatientPendingAppointments"),

    // Get old appointments
    getOldAppointments: () => apiClient.get("/appointments/allPatientBookedPastAppointments"),

    // Cancel appointment
    cancelAppointment: id => apiClient.post(`/appointments/cancel/${id}`),

    // Ongoing treatment
    getOngoingTreatment: () => apiClient.get("/appointments/ongoing-treatments"),

    // Previous treatments
    getPreviousTreatments: () => apiClient.get("/appointments/previous-treatments"),

    // Get completed appointments for uploading documents
    getCompletedAppointments: (doctorId, forWhat) =>
      apiClient.get(`/appointments/completed-appointments/${doctorId}/${forWhat}`),

    getNotes: appointmentId => apiClient.get(`/appointments/notes/${appointmentId}`),
  },

  // Health tracking endpoints
  healthTracking: {
    //Breast Health
    getMammaryChanges: date => apiClient.get(`/patient/questions/breast-health/date?date=${date}`),
    getMammaryDates: () =>
      apiClient.get(`/patient/questions/breast-health`, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    addMammaryChange: formData =>
      apiClient.post("/patient/questions/breast-health", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    // Mastalgia tracking
    getMastalgiaData: date => apiClient.get(`/patient/questions/mastalgia-chart?date=${date}`),
    fetchMastalgiaData: duration =>
      apiClient.get(`/patient/questions/mastalgia-chart?duration=${duration}`),
    addMastalgiaEntry: formData =>
      apiClient.post("/patient/questions/mastalgia-chart", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    // Medical history
    getMedicalHistory: () => apiClient.get("/patient/questions/health-history"),
    updateMedicalHistory: data => apiClient.post("/patient/questions/health-history/medical", data),

    // Emotional history
    getEmotionalHistory: () => apiClient.get("/patient/questions/health-history"),
    updateEmotionalHistory: data =>
      apiClient.post("/patient/questions/health-history/emotional", data),

    // Personal medical history
    getPersonalMedicalHistory: () => apiClient.get("/patient/questions/personalMedicalHistory"),
    updatePersonalMedicalHistory: data =>
      apiClient.post("/patient/questions/personalMedicalHistory", data),

    // Lifestyle history
    getLifestyleHistory: () => apiClient.get("/patient/questions/lifestyle"),
    updateLifestyleHistory: data => apiClient.post("/patient/questions/lifeStyle", data),

    // Cancer history
    getCancerHistory: () => apiClient.get("/patient/questions/familyMedicalHistory"),
    updateCancerHistory: data => apiClient.post("/patient/questions/familyMedicalHistory", data),

    // Biopsy
    getBiopsyData: () =>
      apiClient.get("/patient/questions/cancer-history/breast/testsBiopsiesSurgery"),
    updateBiopsyData: data =>
      apiClient.post("/patient/questions/cancer-history/breast/testsBiopsiesSurgery", data),

    // Comorbidities
    getComorbidities: () => apiClient.get("/patient/questions/cancer-history/comorbid"),
    updateComorbidities: data => apiClient.post("/patient/questions/cancer-history/comorbid", data),
  },

  // s3 file upload
  uploadFile: {
    getUploadPreSignedURL: (fileName, fileType, folderName) =>
      apiClient.post("/s3-files/get-upload-url", {
        fileName,
        fileType,
        folderName,
      }),
    deleteFile: ({ key, folderName }) =>
      apiClient.post("/s3-files/delete-file", { key, folderName }),

    getURL: url => apiClient.get("/s3-files/image-url?url=" + url),
  },

  // Feedback Service
  feedbackService: {
    submitFeedback: feedbackData => apiClient.post("/feedback/patient", feedbackData),
  },

  // Notification Service
  notificationService: {
    registerDevice: ({ fcmToken, deviceName, deviceId }) =>
      apiClient.post("/notification/patient/register", {
        fcmToken,
        deviceName,
        deviceId,
      }),
    unregisterDevice: ({ fcmToken }) =>
      apiClient.post("/notification/patient/unregister", {
        fcmToken,
      }),
    getAllNotifications: () => apiClient.get("/notification/patient/all-notification"),
    markAsRead: notificationId =>
      apiClient.put(`/notification/patient/mark-read/${notificationId}`),
    markAllAsRead: () => apiClient.put("/notification/patient/mark-all-read"),
    deleteNotification: notificationId =>
      apiClient.delete(`/notification/patient/${notificationId}`),
  },

  // Utilities
  utils: {
    getStates: () => apiClient.get("/utils/states"),
    getDistricts: stateId => apiClient.get(`/utils/states/${stateId}/districts`),
    getPincodeDetails: pincode => apiClient.get(`/utils/pincode/${pincode}`),
  },
};

export default apiService;
