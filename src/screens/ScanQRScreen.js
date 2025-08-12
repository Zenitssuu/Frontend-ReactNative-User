import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Image,
  ToastAndroid,
  Linking,
} from "react-native";
import Modal from "react-native-modal";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addDoctor, getSavedDoctors } from "../utils/storage";
import apiService from "../services/api";
import QRCodeService from "../services/qrCodeService";
import { useSelector, useDispatch } from "react-redux";
import { addBehalfUser } from "../Redux/Slices/UserSlice";
import { BehalfUserSelector } from "./appointments/OtherScreen";
import { handleApiMutation } from "../services/apiUtils";
import { Color } from "../constants/GlobalStyles";
import { useRoute } from "@react-navigation/native";
// Assuming PrimaryButton, LoadingSpinner are used elsewhere, keeping import.
// import { PrimaryButton, LoadingSpinner } from "../components/UIComponents"

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCANNER_SIZE = SCREEN_WIDTH * 0.7;

const ScanQRScreen = ({ navigation }) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user) || {};

  console.log("ScanQRScreen: Profile data:", JSON.stringify(profile, null, 2));

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [processingQR, setProcessingQR] = useState(false);
  const [doctorData, setDoctorData] = useState(null);

  console.log("ScanQRScreen: Initial doctorData state:", JSON.stringify(doctorData, null, 2));

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loadingDoctorData, setLoadingDoctorData] = useState(false);

  // New state variables for the choice modal flow
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Track if deep link doctor ID has been processed to prevent loops
  const [processedDoctorId, setProcessedDoctorId] = useState(null);

  // Gallery QR scanning state
  const [processingGalleryImage, setProcessingGalleryImage] = useState(false);

  // Camera reinitialization state
  const [cameraKey, setCameraKey] = useState(0);

  // Animation values
  const scannerLineAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanSuccessOpacity = useRef(new Animated.Value(0)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const resetFlashAnimation = useRef(new Animated.Value(0)).current;

  // Memoize animations to prevent re-creation on every render
  const startAnimations = useCallback(() => {
    if (!scanning) return;

    // Scanner line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scannerLineAnimation, {
          toValue: SCANNER_SIZE,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scannerLineAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for the scan area
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanning, scannerLineAnimation, pulseAnim]);

  const animateModalIn = useCallback(() => {
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [modalAnimation]);

  const animateModalOut = useCallback(
    callback => {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (callback) callback();
      });
    },
    [modalAnimation]
  );

  const resetScanner = useCallback(() => {
    // Stop all running animations first
    scannerLineAnimation.stopAnimation();
    pulseAnim.stopAnimation();
    scanSuccessOpacity.stopAnimation();

    // Reset animation values to initial state
    scannerLineAnimation.setValue(0);
    pulseAnim.setValue(1);
    scanSuccessOpacity.setValue(0);

    // Reset all scanner states to enable camera scanning
    setScanned(false);
    setScanning(true);
    setProcessingQR(false);
    setProcessingGalleryImage(false);

    // Add a brief flash effect to indicate reset
    resetFlashAnimation.setValue(1);
    Animated.timing(resetFlashAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Start fresh animations immediately after reset
    startAnimations();
  }, [startAnimations, scannerLineAnimation, pulseAnim, scanSuccessOpacity, resetFlashAnimation]);

  const closeDoctorInfo = useCallback(() => {
    animateModalOut(() => {
      setShowInfoModal(false);
      setDoctorData(null);
      setLoadingDoctorData(false);

      // Reset scanner and ensure animations restart
      resetScanner();

      // Show a brief feedback to user that scanner is ready
      if (Platform.OS === "android") {
        ToastAndroid.show("Scanner ready - scan another QR code", ToastAndroid.SHORT);
      }
    });
  }, [animateModalOut, resetScanner]);

  // Extracts doctorId from a QR/link string
  function extractDoctorIdFromUrl(data) {
    try {
      // If it's a URL, parse it
      if (typeof data === "string" && data.startsWith("http")) {
        const url = new URL(data);
        return url.searchParams.get("doctorId") || data;
      }
      // If it's already just the ID, return as is
      return data;
    } catch {
      // Fallback: try regex
      const match = data.match(/doctorId=([A-Za-z0-9]+)/);
      return match ? match[1] : data;
    }
  }

  const handleBarCodeScanned = useCallback(
    async ({ type, data }) => {
      try {
        if (scanned || processingQR) return;

        // Validate QR data
        if (!data || data.trim() === "") {
          ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
          return;
        }

        setScanned(true);
        setScanning(false);
        setProcessingQR(true);

        // Animate success indicator
        Animated.sequence([
          Animated.timing(scanSuccessOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.timing(scanSuccessOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          fetchDoctorData(data);
        });
      } catch (error) {
        ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
        resetScanner();
        setProcessingQR(false);
      }
    },
    [scanned, processingQR, scanSuccessOpacity, resetScanner]
  );

  const fetchDoctorData = useCallback(
    async data => {
      setLoadingDoctorData(true);

      try {
        let doctorInfo;
        const doctorId = extractDoctorIdFromUrl(data);
        try {
          // Get details
          const response = await apiService.profile.getDoctorDetails(doctorId, true);

          // Validate API response
          if (!response || !response.data) {
            ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
            resetScanner();
            setProcessingQR(false);
            setLoadingDoctorData(false);
            return;
          }

          // Use the API response data instead of parsing QR code data
          const apiData = response.data;

          // Transform API response to match expected doctor info structure
          doctorInfo = {
            id: data,
            doctorId: apiData.doctorId, // Assuming the API returns a unique ID for the doctor
            name: `${apiData.firstName} ${
              apiData.middleName ? apiData.middleName + " " : ""
            }${apiData.lastName}`.trim(),
            specialty: apiData.professionalDetails?.specialization?.[0] || "General Practice",
            location: apiData.practiceInfo?.[0]?.practiceAddress || "",
            phone: apiData.contactDetails?.alternatePhoneNumber || "",
            email: apiData.practiceInfo?.[0]?.email || "",
            experience: apiData.professionalDetails?.yearsOfExperience || "",
            qualification: apiData.professionalDetails?.qualification || [],
            areaOfExpertise: apiData.professionalDetails?.areaOfExpertise || [],
            languages: apiData.languages || {},
            isVerified: apiData.isVerified || false,
            gender: apiData.gender || "",
            dob: apiData.dob || "",
            profileImage: apiData.profileImage || null,
            registrationNumber: apiData.professionalDetails?.registrationNumber || "",
            medicalCouncil: apiData.professionalDetails?.medicalCouncil || "",
            yearOfRegistration: apiData.professionalDetails?.yearOfRegistration || "",
            hospitalName: apiData.practiceInfo?.[0]?.hospitalName || "",
            address: apiData.currentAddress || {},
          };

          // Validate that doctor has at least a first name
          if (!apiData.firstName || apiData.firstName.trim() === "") {
            ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
            resetScanner();
            setProcessingQR(false);
            setLoadingDoctorData(false);
            return;
          }
        } catch (error) {
          // console.error("API Error:", error);

          // Check for specific error types that indicate invalid QR
          if (
            error.response?.status === 404 ||
            error.response?.status === 400 ||
            error.message?.includes("not found") ||
            error.message?.includes("invalid") ||
            error.message?.includes("No doctor found")
          ) {
            ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
          } else {
            // For network errors or server issues, show a different message
            ToastAndroid.show("Network error, please try again", ToastAndroid.SHORT);
          }

          resetScanner();
          setProcessingQR(false);
          setLoadingDoctorData(false);
          return;
        }

        if (!doctorInfo.id || !doctorInfo.name) {
          ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
          resetScanner();
          setProcessingQR(false);
          setLoadingDoctorData(false);
          return;
        }

        // Check if doctor is already saved using profile's savedDoctors array
        const isDoctorSaved = profile?.savedDoctors?.includes(doctorInfo.doctorId) || false;

        // Add the saved status to doctor info for easier access
        doctorInfo.isDoctorSaved = isDoctorSaved;

        setDoctorData(doctorInfo);
        setShowInfoModal(true);
        animateModalIn();
      } catch (error) {
        // console.error("Error fetching doctor data:", error);
        ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
        resetScanner();
      } finally {
        setProcessingQR(false);
        setLoadingDoctorData(false);
      }
    },
    [animateModalIn, resetScanner]
  );

  const handleAddDoctor = useCallback(async () => {
    if (!doctorData) return;

    try {
      setProcessingQR(true);

      const doctorId = extractDoctorIdFromUrl(doctorData.id);

      const response = await apiService.profile.saveDoctor(doctorId);

      if (response.status === 200 || response.status === 201) {
        ToastAndroid.show("Doctor saved successfully", ToastAndroid.SHORT);
        closeDoctorInfo();
        navigation.navigate("My Doctors");
      }
    } catch (error) {
      // console.error("Error adding doctor:", error);
      Alert.alert("Error", "Failed to add doctor");
      setProcessingQR(false);
    }
  }, [doctorData, closeDoctorInfo, navigation]);

  // New functions for handling the choice modal flow
  const showChoiceModalWithAnimation = useCallback(() => {
    setShowChoiceModal(true);
    Animated.spring(modalScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [modalScale]);

  const hideChoiceModalWithAnimation = useCallback(() => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowChoiceModal(false);
    });
  }, [modalScale]);

  const handleOtherSubmit = useCallback(
    async otherFormData => {
      try {
        // If this is a new user (no behalfUserId), save to database first
        if (!otherFormData.behalfUserId) {
          setLoadingSubmit(true);

          // Convert form data to the format expected by the API
          const [day, month, year] = otherFormData.birthdate.split("/");
          const dateOfBirth = new Date(year, month - 1, day);

          // Extract names from the full name
          const nameParts = otherFormData.name.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts[nameParts.length - 1] || "";
          const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

          const userData = {
            firstName,
            middleName,
            lastName,
            gender: otherFormData.gender,
            dateOfBirth: dateOfBirth.toISOString(),
            relationship: otherFormData.relation,
            ...(otherFormData.parentalConsent !== undefined && {
              parentalConsent: otherFormData.parentalConsent,
            }),
          };

          await handleApiMutation(apiService.profile.addBehalfUser, {
            args: [userData],
            successMessage: "Profile created successfully",
            onSuccess: response => {
              const modifiedData = {
                ...response.data.newBehalfUser,
                dateOfBirth: new Date(response.data.newBehalfUser.dateOfBirth).toISOString(),
              };

              dispatch(addBehalfUser(modifiedData));

              // Update otherFormData with the new behalfUserId
              otherFormData.behalfUserId = response.data.newBehalfUser._id;
            },
          });
        }

        // Close the modals
        setShowOtherModal(false);
        setShowInfoModal(false);

        // Navigate to Survey Details with the form data and doctor info
        navigation.navigate("SurveyDetails", {
          form: { name: "Other", ...otherFormData },
          doctor: doctorData,
        });
      } catch (error) {
        console.log("Error in handleOtherSubmit:", error);
        // Keep modal open if there's an error
      } finally {
        setLoadingSubmit(false);
      }
    },
    [doctorData, dispatch, navigation]
  );

  const handleBookAppointmentFlow = useCallback(() => {
    // Close the doctor info modal first
    animateModalOut(() => {
      setShowInfoModal(false);
      // Reset scanner to ensure animations are ready for next scan
      resetScanner();
      // Show the choice modal
      showChoiceModalWithAnimation();
    });
  }, [animateModalOut, showChoiceModalWithAnimation, resetScanner]);

  const handleNavigateToSavedDoctors = useCallback(() => {
    // Close the doctor info modal first
    animateModalOut(() => {
      setShowInfoModal(false);
      // Reset the navigation stack and navigate to My Doctors
      navigation.reset({
        index: 0,
        routes: [
          { name: "MainDrawer" }, // Reset to main drawer
          { name: "My Doctors" }, // Navigate to My Doctors
        ],
      });
    });
  }, [animateModalOut, navigation]);

  const toggleFlash = useCallback(() => {
    setIsTorchOn(prev => !prev);
  }, []);

  const getInitials = useCallback(name => {
    if (!name) return "";
    const names = name.split(" ");
    const initials = names.map(n => n[0]).join("");
    return initials.toUpperCase();
  }, []);

  const handleImageSelection = useCallback(async () => {
    try {
      setProcessingGalleryImage(true);

      // Use the QR code service to pick and process image
      const qrData = await QRCodeService.pickAndProcessImage();

      if (qrData && QRCodeService.isValidQRData(qrData)) {
        // Process the QR code data similar to camera scanning
        await handleBarCodeScanned({ type: "qr", data: qrData });
      } else if (qrData === null) {
        // User cancelled the image picker
        console.log("User cancelled image selection");
      } else {
        // Show invalid QR toast for gallery images
        ToastAndroid.show("Invalid QR", ToastAndroid.SHORT);
      }
    } catch (error) {
      // console.error("Error processing gallery image:", error);

      if (error.message === "Media library permission not granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your media library to scan QR codes from images. Please grant permission in your device settings.",
          [
            { text: "Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
      } else {
        ToastAndroid.show("Error processing image", ToastAndroid.SHORT);
      }
    } finally {
      setProcessingGalleryImage(false);
    }
  }, [handleBarCodeScanned]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      try {
        // First check existing permission status
        const existingPermission = await Promise.race([
          Camera.getCameraPermissionsAsync(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Permission check timeout")), 5000)
          ),
        ]);

        if (existingPermission.status === "granted") {
          setHasPermission(true);
          return;
        }

        // If not granted, request permission
        const permissionResult = await Promise.race([
          Camera.requestCameraPermissionsAsync(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Permission request timeout")), 10000)
          ),
        ]);
        setHasPermission(permissionResult.status === "granted");
      } catch (error) {
        // If there's a timeout or error, assume permission is denied and let user retry
        setHasPermission(false);
      }
    };

    // Only request permissions on initial load
    getCameraPermissions();

    const focusListener = navigation.addListener("focus", () => {
      // Check if we have route params with doctorId (deep link scenario)
      const hasDoctorIdParam = route.params?.doctorId;

      // For focus events, only check existing permissions, don't request again
      const checkExistingPermissions = async () => {
        try {
          const existingPermission = await Camera.getCameraPermissionsAsync();
          setHasPermission(existingPermission.status === "granted");
        } catch (error) {
          console.log("Error checking existing permissions:", error);
          setHasPermission(false);
        }
      };

      checkExistingPermissions();

      // Only reset state if we're not processing a deep link
      if (!hasDoctorIdParam && !processingQR && !loadingDoctorData) {
        setScanned(false);
        setScanning(true);
        setShowInfoModal(false);
        setDoctorData(null);
        // Force camera reinitialization by changing the key
        setCameraKey(prev => prev + 1);
        // Reset scanner to ensure clean state and animations
        setTimeout(() => {
          resetScanner();
        }, 100);
      } else if (hasDoctorIdParam) {
        console.log("Focus listener: Deep link detected, preserving state");
      }
    });

    const blurListener = navigation.addListener("blur", () => {
      if (isTorchOn) {
        setIsTorchOn(false);
      }
    });

    return () => {
      focusListener();
      blurListener();
      scannerLineAnimation.stopAnimation();
      pulseAnim.stopAnimation();
      scanSuccessOpacity.stopAnimation();
      resetFlashAnimation.stopAnimation();
    };
  }, [
    navigation,
    isTorchOn,
    startAnimations,
    isFocused,
    resetScanner,
    route.params?.doctorId,
    processingQR,
    loadingDoctorData,
    scannerLineAnimation,
    pulseAnim,
    scanSuccessOpacity,
    resetFlashAnimation,
  ]);

  useEffect(() => {
    startAnimations();
  }, [scanning, startAnimations, isTorchOn]);

  useEffect(() => {
    const currentDoctorId = route.params?.doctorId;

    // Only process if we have a doctor ID and haven't processed this one yet
    if (
      currentDoctorId &&
      currentDoctorId !== processedDoctorId &&
      !processingQR &&
      !loadingDoctorData
    ) {
      setProcessedDoctorId(currentDoctorId);
      setScanned(true);
      setScanning(false);
      setProcessingQR(true);

      // Extract and fetch doctor data
      const doctorIdValue = extractDoctorIdFromUrl(currentDoctorId);
      fetchDoctorData(doctorIdValue);
    }
  }, [route.params?.doctorId, processedDoctorId, processingQR, loadingDoctorData, fetchDoctorData]);

  // --- Render Functions ---

  const _renderPermissionRequesting = () => (
    <View style={styles.permissionContainer}>
      <ActivityIndicator size="large" color="#0077B6" />
      <Text style={styles.permissionText}>Requesting camera permission...</Text>
      <Text style={styles.permissionSubText}>If this takes too long, tap below to try again</Text>
      <TouchableOpacity
        style={[styles.permissionButton, { marginTop: 16, backgroundColor: "#f0f0f0" }]}
        onPress={async () => {
          try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
            if (status !== "granted") {
              Alert.alert(
                "Permission Required",
                "Camera permission is needed to scan QR codes. Please enable it in your device settings.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Settings", onPress: () => Linking.openSettings() },
                ]
              );
            }
          } catch (error) {
            console.log("ScanQR: Manual permission retry error:", error);
            setHasPermission(false);
          }
        }}
      >
        <Text style={[styles.permissionButtonText, { color: "#0077B6" }]}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const _renderPermissionDenied = () => (
    <View style={styles.permissionContainer}>
      <MaterialCommunityIcons name="camera-off" size={80} color="#aaa" />
      <Text style={styles.permissionText}>Camera access is required to scan QR codes</Text>
      <TouchableOpacity
        style={styles.permissionButton}
        onPress={async () => {
          try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
            if (status !== "granted") {
              Alert.alert(
                "Permission Required",
                "Camera permission is needed to scan QR codes. Please enable it in your device settings.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Settings", onPress: () => Linking.openSettings() },
                ]
              );
            }
          } catch (error) {
            console.log("Error requesting camera permission:", error);
            setHasPermission(false);
          }
        }}
      >
        <Text style={styles.permissionButtonText}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );

  const _renderHeader = () => (
    <LinearGradient
      colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.5)", "transparent"]}
      style={styles.headerAbsolute}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.headerSide} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Scan Doctor QR Code</Text>
        </View>
        <View style={styles.headerSide} />
        {/* Empty right spacer to center the title */}
      </View>
    </LinearGradient>
  );

  const _renderScannerOverlay = () => (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.scanWindow,
          {
            transform: [{ scale: pulseAnim }],
            borderColor: scanning ? "#0077B6" : "#fff",
          },
        ]}
      >
        <View style={[styles.corner, styles.topLeftCorner]} />
        <View style={[styles.corner, styles.topRightCorner]} />
        <View style={[styles.corner, styles.bottomLeftCorner]} />
        <View style={[styles.corner, styles.bottomRightCorner]} />

        {scanning && (
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY: scannerLineAnimation }] }]}
          />
        )}

        <Animated.View style={[styles.successIndicator, { opacity: scanSuccessOpacity }]}>
          <MaterialCommunityIcons name="check-circle" size={80} color="#4CAF50" />
        </Animated.View>
      </Animated.View>

      {/* Reset flash overlay */}
      <Animated.View
        style={[
          styles.resetFlashOverlay,
          {
            opacity: resetFlashAnimation,
          },
        ]}
      />
    </View>
  );

  const _renderFlashButton = () => (
    <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
      <MaterialCommunityIcons
        name={isTorchOn ? "flashlight" : "flashlight-off"}
        size={24}
        color={isTorchOn ? "#ffeb3b" : "#fff"}
      />
    </TouchableOpacity>
  );

  const _renderGalleryButton = () => (
    <TouchableOpacity
      style={[styles.galleryButton, processingGalleryImage && styles.galleryButtonDisabled]}
      onPress={handleImageSelection}
      disabled={processingGalleryImage}
    >
      {processingGalleryImage ? (
        <ActivityIndicator size="small" color="#0077B6" />
      ) : (
        <>
          <MaterialCommunityIcons
            name="image-multiple"
            size={24}
            color="#0077B6"
            style={styles.galleryButtonIcon}
          />
          <Text style={styles.galleryButtonText}>Upload from gallery</Text>
        </>
      )}
    </TouchableOpacity>
  );

  const _renderInstructions = () => (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsText}>
        {scanning && !processingQR && !processingGalleryImage
          ? "Position the QR code inside the frame to scan, or tap the gallery icon to select an image"
          : "Ready to scan another QR code"}
      </Text>
      {processingQR && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
      {processingGalleryImage && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.processingText}>Processing image...</Text>
        </View>
      )}
    </View>
  );

  const _renderProcessingOverlay = () => {
    if (!processingGalleryImage && !processingQR) return null;

    return (
      <View style={styles.processingOverlay}>
        <View style={styles.processingCard}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={styles.processingCardTitle}>
            {processingGalleryImage ? "Processing Image" : "Processing QR Code"}
          </Text>
          <Text style={styles.processingCardSubtitle}>
            {processingGalleryImage
              ? "Analyzing your image for QR codes..."
              : "Extracting information from QR code..."}
          </Text>
        </View>
      </View>
    );
  };

  const _renderDoctorInfoModal = () => {
    if (!showInfoModal || !doctorData) return null;

    const modalTranslateY = modalAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    const modalOpacity = modalAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Modal
        transparent={true}
        visible={showInfoModal}
        animationType="none"
        onRequestClose={closeDoctorInfo}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeDoctorInfo}
          />

          <Animated.View
            style={[
              styles.doctorInfoContainer,
              {
                opacity: modalOpacity,
                transform: [{ translateY: modalTranslateY }],
              },
            ]}
          >
            <View style={styles.doctorInfoHeader}>
              <Text style={styles.doctorInfoTitle}>Doctor Information</Text>
              <TouchableOpacity onPress={closeDoctorInfo}>
                <MaterialCommunityIcons name="close-circle" size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            {loadingDoctorData ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0077B6" />
                <Text style={styles.loadingText}>Loading doctor information...</Text>
              </View>
            ) : (
              <>
                <View style={styles.doctorProfileSection}>
                  {doctorData.profileImage ? (
                    <Image
                      source={{ uri: doctorData.profileImage }}
                      style={styles.doctorPhoto}
                      defaultSource={require("../../assets/icon.png")}
                    />
                  ) : (
                    <View style={styles.doctorPhotoPlaceholder}>
                      <Text style={styles.initialsText}>{getInitials(doctorData.name)}</Text>
                    </View>
                  )}

                  <View style={styles.doctorNameContainer}>
                    <Text style={styles.doctorName}>Dr. {doctorData.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctorData.specialty}</Text>
                    {doctorData.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <MaterialCommunityIcons name="check-decagram" size={16} color="#4CAF50" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.doctorDetailsSection}>
                  {doctorData.qualification && doctorData.qualification.length > 0 && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="school" size={16} color="#0077B6" />
                      <Text style={styles.detailLabel}>Qualification:</Text>
                      <Text style={styles.detailText}>{doctorData.qualification.join(", ")}</Text>
                    </View>
                  )}

                  {doctorData.experience && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="clock-outline" size={16} color="#0077B6" />
                      <Text style={styles.detailLabel}>Experience:</Text>
                      <Text style={styles.detailText}>{doctorData.experience} years</Text>
                    </View>
                  )}

                  {doctorData.areaOfExpertise && doctorData.areaOfExpertise.length > 0 && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="star-outline" size={16} color="#0077B6" />
                      <Text style={styles.detailLabel}>Expertise:</Text>
                      <Text style={styles.detailText}>{doctorData.areaOfExpertise.join(", ")}</Text>
                    </View>
                  )}

                  {doctorData.hospitalName && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="hospital-building" size={16} color="#0077B6" />
                      <Text style={styles.detailLabel}>Hospital:</Text>
                      <Text style={styles.detailText}>{doctorData.hospitalName}</Text>
                    </View>
                  )}

                  {doctorData.location && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="map-marker" size={16} color="#0077B6" />
                      <Text style={styles.detailLabel}>Location:</Text>
                      <Text style={styles.detailText}>{doctorData.location}</Text>
                    </View>
                  )}

                  {doctorData.languages && Object.keys(doctorData.languages).length > 0 && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="translate" size={16} color="#0077B6" />
                      <Text style={styles.detailLabel}>Languages:</Text>
                      <View style={styles.languagesContainer}>
                        {doctorData.languages.speak && doctorData.languages.speak.length > 0 && (
                          <Text style={styles.languageText}>
                            Speaks: {doctorData.languages.speak.join(", ")}
                          </Text>
                        )}
                        {doctorData.languages.readWrite &&
                          doctorData.languages.readWrite.length > 0 && (
                            <Text style={styles.languageText}>
                              Read/Write: {doctorData.languages.readWrite.join(", ")}
                            </Text>
                          )}
                      </View>
                    </View>
                  )}
                </View>

                {doctorData.isDoctorSaved ? (
                  <>
                    <Text style={styles.scannedInfoText}>Doctor already saved!</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.bookAppointmentButton]}
                        onPress={handleBookAppointmentFlow}
                      >
                        <Text style={styles.bookAppointmentButtonText}>Book Appointment</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.savedDoctorsButton]}
                        onPress={handleNavigateToSavedDoctors}
                      >
                        <Text style={styles.savedDoctorsButtonText}>Saved Doctors</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.scannedInfoText}>Do you want to save this doctor?</Text>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.bookAppointmentButton]}
                        onPress={handleBookAppointmentFlow}
                      >
                        <Text style={styles.bookAppointmentButtonText}>Book Appointment</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.addButton]}
                        onPress={handleAddDoctor}
                        disabled={processingQR}
                      >
                        {processingQR ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.addButtonText}>Save Doctor</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    );
  };

  // --- Main Render Logic ---
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {hasPermission === null && _renderPermissionRequesting()}
      {hasPermission === false && _renderPermissionDenied()}

      {hasPermission === true && (
        <SafeAreaView style={styles.fullScreen}>
          {/* This wrapper holds the CameraView and all its absolute overlays */}
          <View style={styles.cameraAndOverlayWrapper}>
            <CameraView
              key={`camera-view-${cameraKey}`}
              barcodeScannerEnabled={!scanned && !processingQR && isFocused}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={[StyleSheet.absoluteFillObject, { backgroundColor: "transparent" }]}
              enableTorch={hasPermission && isTorchOn}
            />

            {_renderScannerOverlay()}
            {_renderFlashButton()}
            {_renderGalleryButton()}
            {_renderInstructions()}
            {_renderProcessingOverlay()}
          </View>
        </SafeAreaView>
      )}

      {/* Header needs to be outside the SafeAreaView to stretch to top edge if desired,
          but is still absolutely positioned over everything else. */}
      {_renderHeader()}

      {_renderDoctorInfoModal()}

      {/* Choice Modal - Who are these symptoms for? */}
      <Modal
        visible={showChoiceModal}
        animationType="fade"
        transparent={true}
        onRequestClose={hideChoiceModalWithAnimation}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.choiceModalOverlay}>
          <Animated.View
            style={[
              styles.choiceModal,
              {
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.choiceModalTitle}>Symptoms For</Text>
              <Text style={styles.choiceModalSubtitle}>Choose Person</Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  hideChoiceModalWithAnimation();
                  setTimeout(() => {
                    navigation.navigate("SurveyDetails", {
                      form: { name: "Self" },
                      doctor: doctorData,
                    });
                  }, 200);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.optionImageContainer}>
                  <Image source={require("../../assets/self.png")} style={styles.optionImage} />
                  <View style={styles.optionBadge}>
                    <MaterialCommunityIcons name="account" size={16} color={Color.white} />
                  </View>
                </View>
                <Text style={styles.optionText}>For Myself</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  hideChoiceModalWithAnimation();
                  setTimeout(() => {
                    setShowOtherModal(true);
                  }, 200);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.optionImageContainer}>
                  <Image source={require("../../assets/other.png")} style={styles.optionImage} />
                  <View style={styles.optionBadge}>
                    <MaterialCommunityIcons name="account-multiple" size={16} color={Color.white} />
                  </View>
                </View>
                <Text style={styles.optionText}>For Others</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={hideChoiceModalWithAnimation}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Other Person Modal */}
      <Modal
        visible={showOtherModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOtherModal(false)}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.otherModalOverlay}>
          <View style={styles.otherModal}>
            <BehalfUserSelector
              profile={profile}
              onSubmit={handleOtherSubmit}
              onCancel={() => setShowOtherModal(false)}
              loading={loadingSubmit}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullScreen: {
    // New style to make SafeAreaView cover the whole screen
    flex: 1,
    backgroundColor: "#000",
  },
  cameraAndOverlayWrapper: {
    // New wrapper for CameraView and its overlays
    flex: 1,
    backgroundColor: "transparent",
  },
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSide: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  // headerButton: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: "rgba(0, 0, 0, 0.3)",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   borderColor: "rgba(255, 255, 255, 0.2)",
  // },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Ensures it covers the entire parent wrapper (cameraAndOverlayWrapper)
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanWindow: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: "#0077B6",
    overflow: "hidden",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#0077B6",
    position: "absolute",
    top: 0,
    shadowColor: "#0077B6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#FFF",
    backgroundColor: "transparent",
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 10,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 10,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 10,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 10,
  },
  successIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // more transparent background for the checkmark
    width: "100%",
    height: "100%",
  },
  flashButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 120 : 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 5,
  },
  galleryButton: {
    position: "absolute",
    bottom: "24%",
    alignSelf: "center",
    minWidth: 200,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    zIndex: 5,
    flexDirection: "row",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  galleryButtonDisabled: {
    opacity: 0.5,
  },
  galleryButtonIcon: {
    marginRight: 8,
  },
  galleryButtonText: {
    color: "#0077B6",
    fontSize: 16,
    fontWeight: "600",
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 100, // Moved up to make room for the gallery button
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 5,
  },
  instructionsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  processingText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  permissionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "500",
  },
  permissionSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "400",
  },
  permissionButton: {
    backgroundColor: "#0077B6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  doctorInfoContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    maxHeight: "80%",
  },
  doctorInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  doctorInfoTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  doctorProfileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  doctorPhotoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0077B6",
  },
  doctorPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#0077B6",
  },
  initialsText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#0077B6",
  },
  doctorNameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  doctorSpecialty: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4CAF50",
    marginLeft: 4,
  },
  doctorDetailsSection: {
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginLeft: 8,
    minWidth: 80,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
    flex: 1,
  },
  languagesContainer: {
    marginLeft: 8,
    flex: 1,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
    marginBottom: 2,
  },
  scannedInfoText: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  bookAppointmentButton: {
    backgroundColor: "#f0f0f0",
  },
  bookAppointmentButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  addButton: {
    backgroundColor: "#0077B6",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  savedDoctorsButton: {
    backgroundColor: "#4CAF50",
  },
  savedDoctorsButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#0077B6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  // New styles for choice modal
  choiceModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  choiceModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: "hidden",
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: Color.lightBlue,
    width: "100%",
  },
  choiceModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Color.headingColor,
    marginBottom: 8,
    textAlign: "center",
  },
  choiceModalSubtitle: {
    fontSize: 14,
    color: Color.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  option: {
    alignItems: "center",
    padding: 20,
    backgroundColor: Color.white,
    borderRadius: 16,
    flex: 1,
    borderWidth: 2,
    borderColor: Color.lightBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1 }],
  },
  optionImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  optionImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Color.lightBlue,
    borderWidth: 3,
    borderColor: Color.headingColor,
  },
  optionBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: Color.headingColor,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Color.white,
  },
  optionText: {
    fontSize: 16,
    color: Color.headingColor,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: Color.lightBlue,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Color.headingColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Color.headingColor,
    fontWeight: "600",
    textAlign: "center",
  },
  // Other modal styles
  otherModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  otherModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "50%",
    overflow: "hidden",
  },

  // New styles for processing overlay
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  processingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    width: "80%",
    maxWidth: 350,
  },
  processingCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Color.headingColor,
    marginTop: 20,
    marginBottom: 8,
  },
  processingCardSubtitle: {
    fontSize: 14,
    color: Color.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  // Reset flash overlay style
  resetFlashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 5,
  },
});

export default ScanQRScreen;
