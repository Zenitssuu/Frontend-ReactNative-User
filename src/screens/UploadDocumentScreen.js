import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Animated,
  Linking,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import apiService from "../services/api";
import { createMultipleFileFormData } from "../services/apiUtils";
import * as ImagePicker from "expo-image-picker";

// Add custom uploader component for this page only
const InPageUploader = ({ onUpload, uploadType, onClose }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const maxFiles = uploadType === "report" ? 5 : 1;

  const handlePickFile = async type => {
    try {
      if (files.length >= maxFiles) {
        ToastAndroid.show(
          `You can only upload ${maxFiles} file${maxFiles > 1 ? "s" : ""} for ${uploadType}s.`,
          ToastAndroid.LONG
        );
        return;
      }
      setIsLoading(true);
      let result;
      if (type === "camera" || type === "gallery") {
        const permission =
          type === "camera"
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setIsLoading(false);
          ToastAndroid.show("Please grant permission to access your device.", ToastAndroid.LONG);
          return;
        }
        const remainingSlots = maxFiles - files.length;
        result =
          type === "camera"
            ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsMultipleSelection: uploadType === "report" && remainingSlots > 1,
                selectionLimit: uploadType === "report" ? remainingSlots : 1,
              });
        if (!result.canceled && result.assets) {
          const newFiles = result.assets.map(image => ({
            uri: image.uri,
            name: image.fileName || image.uri.split("/").pop(),
            type: "image",
            id: Date.now() + Math.random(),
          }));
          const filesToAdd = newFiles.slice(0, remainingSlots);
          setFiles(prev => [...prev, ...filesToAdd]);
          if (newFiles.length > remainingSlots) {
            ToastAndroid.show(
              `Only ${remainingSlots} file${remainingSlots > 1 ? "s" : ""} could be added. Maximum ${maxFiles} files allowed for ${uploadType}s.`,
              ToastAndroid.LONG
            );
          }
        }
      }
    } catch (err) {
      console.error("File picker error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = fileId => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      ToastAndroid.show("Please select at least one file", ToastAndroid.SHORT);
      return;
    }
    setIsUploading(true);
    try {
      await onUpload({ files });
    } finally {
      setIsUploading(false);
    }
  };

  const renderFilePreview = file => (
    <View
      key={file.id}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        padding: 8,
      }}
    >
      <Image
        source={{ uri: file.uri }}
        style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }}
      />
      <Text style={{ flex: 1 }} numberOfLines={1}>
        {file.name}
      </Text>
      <TouchableOpacity onPress={() => handleRemoveFile(file.id)}>
        <MaterialCommunityIcons name="delete" size={20} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={{ marginTop: 8 }}>Loading image...</Text>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
          paddingHorizontal: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => handlePickFile("gallery")}
          style={{
            alignItems: "center",
            opacity: files.length >= maxFiles || isLoading ? 0.5 : 1,
            flex: 1,
            marginHorizontal: 4,
          }}
          disabled={files.length >= maxFiles || isLoading}
        >
          <View
            style={{ backgroundColor: "#e8f4f8", padding: 12, borderRadius: 40, marginBottom: 6 }}
          >
            <MaterialCommunityIcons name="image" size={24} color="#0077B6" />
          </View>
          <Text style={{ fontSize: 12, textAlign: "center" }}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePickFile("camera")}
          style={{
            alignItems: "center",
            opacity: files.length >= maxFiles || isLoading ? 0.5 : 1,
            flex: 1,
            marginHorizontal: 4,
          }}
          disabled={files.length >= maxFiles || isLoading}
        >
          <View
            style={{ backgroundColor: "#e8f4f8", padding: 12, borderRadius: 40, marginBottom: 6 }}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#0077B6" />
          </View>
          <Text style={{ fontSize: 12, textAlign: "center" }}>Camera</Text>
        </TouchableOpacity>
      </View>
      {files.length > 0 && <View style={{ marginBottom: 16 }}>{files.map(renderFilePreview)}</View>}
      <TouchableOpacity
        style={{
          backgroundColor: "#0077B6",
          borderRadius: 8,
          paddingVertical: 14,
          alignItems: "center",
          opacity: isUploading ? 0.7 : 1,
          marginBottom: 12,
        }}
        onPress={handleSubmit}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {`Upload ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`}
          </Text>
        )}
      </TouchableOpacity>

      {onClose && (
        <TouchableOpacity
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e0e0e0",
          }}
          onPress={onClose}
        >
          <Text style={{ color: "#666", fontWeight: "600", fontSize: 14 }}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const UploadDocumentScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Reports");
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocumentGroup, setSelectedDocumentGroup] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [skeletonAnimation] = useState(new Animated.Value(0));
  const [expandedDates, setExpandedDates] = useState(new Set());
  const [doctorPatients, setDoctorPatients] = useState({}); // doctorId -> patients array
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, [activeTab]);

  // Handle navigation parameters to set initial tab
  useEffect(() => {
    if (route?.params?.section) {
      const section = route.params.section;
      if (section === "reports") {
        setActiveTab("Reports");
      } else if (section === "prescriptions") {
        setActiveTab("Prescriptions");
      }
    }
  }, [route?.params?.section]);

  // Skeleton animation effect
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(skeletonAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (loading) {
      pulseAnimation.start();
    } else {
      pulseAnimation.stop();
      skeletonAnimation.setValue(0);
    }

    return () => pulseAnimation.stop();
  }, [loading, skeletonAnimation]);

  // Load documents for the current user
  const loadDocuments = async () => {
    try {
      setLoading(true);
      if (activeTab === "Reports") {
        await getReports();
      } else {
        await getPrescriptions();
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get doctors and patients from Ongoing Treatments from DB
  const getOngoingTreatments = async () => {
    try {
      const response = await apiService.healthRecords.getDoctorsAndPatients();

      if (response.data && Array.isArray(response.data)) {
        // Transform to doctor list and doctorPatients map
        const doctorsList = response.data.map(item => ({
          id: item.doctorId,
          doctorId: item.doctorId,
          name: item.doctorName,
          profileImage: item.doctorProfileImage,
          appointmentId: item.appointmentId,
        }));
        const patientsMap = {};
        response.data.forEach(item => {
          patientsMap[item.doctorId] = item.inTreatment;
        });
        setDoctors(doctorsList);
        setDoctorPatients(patientsMap);
      } else {
        setDoctors([]);
        setDoctorPatients({});
      }
    } catch (error) {
      console.error("Error fetching ongoing treatments:", error);
      Alert.alert("Error", "Failed to load ongoing treatments");
      setDoctors([]);
      setDoctorPatients({});
    }
  };

  useEffect(() => {
    getOngoingTreatments();
  }, []);

  // Get prescriptions from DB
  const getPrescriptions = async () => {
    try {
      const response = await apiService.healthRecords.getPrescriptionsForPatient();

      if (response.data && Array.isArray(response.data)) {
        // Transform the API response to match the expected format
        const transformedPrescriptions = [];

        response.data.forEach(doctorGroup => {
          if (doctorGroup.prescriptions && Array.isArray(doctorGroup.prescriptions)) {
            doctorGroup.prescriptions.forEach(prescription => {
              transformedPrescriptions.push({
                id: prescription._id,
                appointmentId: prescription.appointmentId,
                fileUris: prescription.fileUris,
                s3Keys: prescription.s3Keys,
                date: new Date(prescription.createdAt).toLocaleDateString(),
                createdAt: prescription.createdAt,
                description: prescription.note || "Prescription",
                doctorName: doctorGroup.doctorDetails
                  ? `${doctorGroup.doctorDetails.firstName} ${doctorGroup.doctorDetails.lastName}`.trim()
                  : "Unknown Doctor",
                doctorProfileImage: doctorGroup.doctorDetails?.profileImage || null,
              });
            });
          }
        });

        setPrescriptions(transformedPrescriptions);
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      Alert.alert("Error", "Failed to load prescriptions");
      setPrescriptions([]);
    }
  };

  // Get reports from DB
  const getReports = async () => {
    try {
      const response = await apiService.healthRecords.getReportsForPatient();

      console.log("Reports response:", JSON.stringify(response.data, null, 2));

      if (response.data && Array.isArray(response.data)) {
        // Transform the API response to match the expected format
        const transformedReports = [];

        response.data.forEach(doctorGroup => {
          if (doctorGroup.reports && Array.isArray(doctorGroup.reports)) {
            doctorGroup.reports.forEach(report => {
              transformedReports.push({
                id: report._id,
                appointmentId: report.appointmentId,
                fileUris: report.fileUris,
                s3Keys: report.s3Keys,
                date: new Date(report.createdAt).toLocaleDateString(),
                createdAt: report.createdAt,
                description: report.note || "Report",
                doctorName: doctorGroup.doctorDetails
                  ? `${doctorGroup.doctorDetails.firstName} ${doctorGroup.doctorDetails.lastName}`.trim()
                  : "Unknown Doctor",
                doctorProfileImage: doctorGroup.doctorDetails?.profileImage || null,
              });
            });
          }
        });

        setReports(transformedReports);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      Alert.alert("Error", "Failed to load reports");
      setReports([]);
    }
  };

  // useEffect to load documents when active tab changes
  useEffect(() => {
    loadDocuments();
  }, [activeTab]);

  // Handle add document button press
  const handleAddDocument = () => {
    setShowAddModal(true);
    getOngoingTreatments();
  };

  // Handle file upload
  const handleFileUpload = async file => {
    if (!selectedDoctor || !selectedPatient) {
      ToastAndroid.show("Please select a doctor and patient", ToastAndroid.SHORT);
      return;
    }
    try {
      setLoading(true);
      const files = file.files || [];
      // Create FormData with proper structure
      const formData = createMultipleFileFormData(files, {
        doctorId: selectedDoctor.id,
        patientId: selectedPatient.patientId,
        behalfUserId: selectedPatient.behalfUserId,
      });
      // Use appointmentId from selectedPatient for the API call
      const appointmentId = selectedPatient.appointmentId;
      const response =
        activeTab === "Prescriptions"
          ? await apiService.healthRecords.uploadPrescription(formData, appointmentId)
          : await apiService.healthRecords.uploadReport(formData, appointmentId);
      ToastAndroid.show(
        `${activeTab === "Prescriptions" ? "Prescription" : "Report"} uploaded successfully!`,
        ToastAndroid.SHORT
      );
      // Reset modal states
      setShowAddModal(false);
      setSelectedDoctor(null);
      setSelectedPatient(null);
      // Refresh documents
      await loadDocuments();
    } catch (error) {
      console.error("Error uploading file:", error);
      ToastAndroid.show("Failed to upload document. Please try again.", ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  // Group documents by doctor
  const groupDocumentsByDate = documents => {
    // Group both reports and prescriptions by doctor
    const grouped = {};
    documents.forEach(doc => {
      const doctorName = doc.doctorName || "Unknown Doctor";
      if (!grouped[doctorName]) {
        grouped[doctorName] = {
          doctorName,
          doctorProfileImage: doc.doctorProfileImage,
          documents: [],
        };
      }
      grouped[doctorName].documents.push(doc);
    });

    // Sort doctors alphabetically and documents by date (newest first)
    return Object.values(grouped)
      .sort((a, b) => a.doctorName.localeCompare(b.doctorName))
      .map(group => ({
        ...group,
        documents: group.documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      }));
  };

  // Toggle date expansion
  const toggleDateExpansion = date => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  // Get file type and icon
  const getFileInfo = fileUri => {
    // Handle URLs with query parameters
    const cleanUri = fileUri.split("?")[0];
    const extension = cleanUri.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "heic", "heif"].includes(extension)) {
      return { type: "image", icon: "image" };
    } else if (["pdf"].includes(extension)) {
      return { type: "pdf", icon: "file-pdf-box" };
    } else if (["doc", "docx"].includes(extension)) {
      return { type: "word", icon: "file-word-box" };
    } else if (["xls", "xlsx"].includes(extension)) {
      return { type: "excel", icon: "file-excel-box" };
    } else if (["ppt", "pptx"].includes(extension)) {
      return { type: "powerpoint", icon: "file-powerpoint-box" };
    } else if (["txt"].includes(extension)) {
      return { type: "text", icon: "file-document-outline" };
    } else {
      // If no extension or unknown extension, try to detect from URL
      if (fileUri.includes("image") || fileUri.includes("photo") || fileUri.includes("img")) {
        return { type: "image", icon: "image" };
      } else if (fileUri.includes("pdf")) {
        return { type: "pdf", icon: "file-pdf-box" };
      } else {
        return { type: "other", icon: "file-outline" };
      }
    }
  };

  // Update renderFileThumbnail to accept document context and index
  const renderFileThumbnail = (fileUri, index, totalFiles, document) => {
    const fileInfo = getFileInfo(fileUri);
    const isImage = fileInfo.type === "image";

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.fileThumbnail,
          { marginLeft: index > 0 ? -15 : 0, zIndex: totalFiles - index },
        ]}
        onPress={() => handleFileOpen(fileUri, document, index)}
      >
        {isImage ? (
          <Image
            source={{ uri: fileUri }}
            style={styles.thumbnailImage}
            onError={error => console.log("Image load error:", error)}
          />
        ) : (
          <View style={styles.fileIconContainer}>
            <MaterialCommunityIcons name={fileInfo.icon} size={28} color="#0077B6" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render date group header
  const renderDateGroupHeader = dateGroup => {
    const groupKey = dateGroup.doctorName;
    const isExpanded = expandedDates.has(groupKey);
    const totalFiles = dateGroup.documents.reduce((sum, doc) => sum + doc.fileUris.length, 0);

    return (
      <TouchableOpacity
        style={styles.dateGroupHeader}
        onPress={() => toggleDateExpansion(groupKey)}
      >
        <View style={styles.dateGroupInfo}>
          <View style={styles.doctorGroupInfo}>
            {dateGroup.doctorProfileImage && (
              <Image
                source={{ uri: dateGroup.doctorProfileImage }}
                style={styles.doctorGroupImage}
              />
            )}
            <View style={styles.doctorGroupText}>
              <Text style={styles.dateGroupTitle}>Dr. {dateGroup.doctorName}</Text>
              <Text style={styles.dateGroupSubtitle}>
                {dateGroup.documents.length} {activeTab.toLowerCase().slice(0, -1)}
                {dateGroup.documents.length > 1 ? "s" : ""} • {totalFiles} file
                {totalFiles > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.dateGroupActions}>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#0077B6"
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Update renderDocumentCard to pass document to renderFileThumbnail
  const renderDocumentCard = document => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <MaterialCommunityIcons
          name={activeTab === "Reports" ? "file-document-outline" : "pill"}
          size={24}
          color="#0077B6"
        />
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{document.description}</Text>
          <Text style={styles.documentTime}>
            {new Date(document.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.documentBadge}>
          <Text style={styles.documentBadgeText}>
            {document.fileUris.length} file{document.fileUris.length > 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <View style={styles.documentPreview}>
        {document.fileUris
          .slice(0, 4)
          .map((uri, index) => renderFileThumbnail(uri, index, document.fileUris.length, document))}
        {document.fileUris.length > 4 && (
          <View style={styles.moreIndicator}>
            <Text style={styles.moreText}>+{document.fileUris.length - 4}</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Render tab navigation
  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Reports" && styles.activeTab]}
        onPress={() => setActiveTab("Reports")}
      >
        <MaterialCommunityIcons
          name="file-document-outline"
          size={20}
          color={activeTab === "Reports" ? "#fff" : "#0077B6"}
        />
        <Text style={[styles.tabText, activeTab === "Reports" && styles.activeTabText]}>
          Reports
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Prescriptions" && styles.activeTab]}
        onPress={() => setActiveTab("Prescriptions")}
      >
        <MaterialCommunityIcons
          name="pill"
          size={20}
          color={activeTab === "Prescriptions" ? "#fff" : "#0077B6"}
        />
        <Text style={[styles.tabText, activeTab === "Prescriptions" && styles.activeTabText]}>
          Prescriptions
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Update handleFileOpen to accept document and index, and open modal with all images in group
  const handleFileOpen = (fileUri, document, index) => {
    const fileInfo = getFileInfo(fileUri);

    if (fileInfo.type === "pdf") {
      // Try to open PDF in external PDF apps using expo-intent-launcher
      const openPDFInExternalApp = async () => {
        try {
          if (Platform.OS === "android") {
            // Use expo-intent-launcher for Android to open PDF in external apps
            const result = await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
              data: fileUri,
              type: "application/pdf",
              flags: 1, // FLAG_ACTIVITY_NEW_TASK
            });

            // Check if the activity was canceled (resultCode 0 means canceled)
            if (result.resultCode === 0) {
              // User canceled or no app found
              // Alert.alert(
              //   "PDF Viewer Not Found",
              //   "No PDF viewer app is installed on your device. Please install a PDF reader app like Adobe Acrobat Reader, Google PDF Viewer, or any other PDF reader app."
              // );
            }
          } else {
            // For iOS, use Linking as fallback
            await Linking.openURL(fileUri);
          }
        } catch (error) {
          console.error("Error opening PDF:", error);

          // Fallback: try to open with default PDF handling
          try {
            await Linking.openURL(fileUri);
          } catch (fallbackError) {
            console.error("Fallback PDF opening failed:", fallbackError);
            // Alert.alert(
            //   "PDF Viewer Not Found",
            //   "No PDF viewer app is installed on your device. Please install a PDF reader app like Adobe Acrobat Reader, Google PDF Viewer, or any other PDF reader app."
            // );
          }
        }
      };

      openPDFInExternalApp();
    } else {
      // For images, show all images in the document group and start at the tapped index
      setSelectedDocumentGroup({
        ...document,
        fileUris: document.fileUris.filter(uri => getFileInfo(uri).type === "image"),
      });
      setCurrentDocumentIndex(
        document.fileUris.filter(uri => getFileInfo(uri).type === "image").indexOf(fileUri)
      );
      setShowDocumentModal(true);
    }
  };

  // Navigate to next document in the group
  const handleNextDocument = () => {
    if (selectedDocumentGroup && currentDocumentIndex < selectedDocumentGroup.fileUris.length - 1) {
      setCurrentDocumentIndex(currentDocumentIndex + 1);
    }
  };

  // Navigate to previous document in the group
  const handlePrevDocument = () => {
    if (selectedDocumentGroup && currentDocumentIndex > 0) {
      setCurrentDocumentIndex(currentDocumentIndex - 1);
    }
  };

  // Render skeleton loader for document cards
  const renderSkeletonLoader = () => {
    const skeletonOpacity = skeletonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View style={styles.skeletonContainer}>
        {[...Array(3)].map((_, index) => (
          <Animated.View key={index} style={[styles.skeletonCard, { opacity: skeletonOpacity }]}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonTextContainer}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonDate} />
              </View>
              <View style={styles.skeletonBadge} />
            </View>
            <View style={styles.skeletonPreview}>
              <View style={styles.skeletonThumbnail} />
              <View style={[styles.skeletonThumbnail, { marginLeft: -20 }]} />
              <View style={[styles.skeletonThumbnail, { marginLeft: -20 }]} />
            </View>
          </Animated.View>
        ))}
      </View>
    );
  };

  // Render document list
  const renderDocumentList = () => {
    // Show skeleton loader when loading
    if (loading && !refreshing) {
      return renderSkeletonLoader();
    }

    const documents = activeTab === "Reports" ? reports : prescriptions;
    const groupedDocuments = groupDocumentsByDate(documents);

    if (groupedDocuments.length === 0 && !loading) {
      return (
        <View style={styles.emptySection}>
          <MaterialCommunityIcons
            name={activeTab === "Reports" ? "file-document-outline" : "pill"}
            size={48}
            color="#ccc"
          />
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} available</Text>
          <Text style={styles.emptySubtext}>{activeTab} will appear here when uploaded</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={groupedDocuments}
        keyExtractor={item => item.doctorName}
        renderItem={({ item }) => (
          <View style={styles.dateGroup}>
            {renderDateGroupHeader(item)}
            {expandedDates.has(item.doctorName) && (
              <View style={styles.dateGroupContent}>
                {item.documents.map(doc => (
                  <View key={doc.id}>{renderDocumentCard(doc)}</View>
                ))}
              </View>
            )}
          </View>
        )}
        refreshing={refreshing}
        onRefresh={loadDocuments}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.documentListContainer}
      />
    );
  };

  // Remove the separate doctor and patient modals since we're using inline selection now

  // Render document viewer modal
  const renderDocumentModal = () => (
    <Modal
      isVisible={showDocumentModal}
      onBackdropPress={() => setShowDocumentModal(false)}
      style={{ margin: 0, overflow: "hidden" }}
    >
      <View style={styles.documentModalContent}>
        <View style={styles.documentModalHeader}>
          <Text style={styles.documentModalTitle}>
            {selectedDocumentGroup?.description || "Document"}
          </Text>
          <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {selectedDocumentGroup && (
          <View style={styles.documentViewer}>
            <Image
              source={{ uri: selectedDocumentGroup.fileUris[currentDocumentIndex] }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              resizeMode="contain"
            />

            {/* Navigation arrows */}
            {selectedDocumentGroup.fileUris.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={handlePrevDocument}
                  disabled={currentDocumentIndex === 0}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={30}
                    color={currentDocumentIndex === 0 ? "#ccc" : "#fff"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={handleNextDocument}
                  disabled={currentDocumentIndex === selectedDocumentGroup.fileUris.length - 1}
                >
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={
                      currentDocumentIndex === selectedDocumentGroup.fileUris.length - 1
                        ? "#ccc"
                        : "#fff"
                    }
                  />
                </TouchableOpacity>
              </>
            )}

            {/* Document counter */}
            <View style={styles.documentCounter}>
              <Text style={styles.documentCounterText}>
                {currentDocumentIndex + 1} / {selectedDocumentGroup.fileUris.length}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );

  // Render upload modal
  const renderUploadModal = () => (
    <Modal
      isVisible={showAddModal}
      onBackdropPress={() => setShowAddModal(false)}
      style={styles.enhancedModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={styles.enhancedModalContent}>
        {/* Enhanced Header */}
        <View style={styles.enhancedModalHeader}>
          <View style={styles.modalHeaderContent}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons
                name={activeTab === "Reports" ? "file-document-outline" : "pill"}
                size={24}
                color="#0077B6"
              />
            </View>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.enhancedModalTitle}>Add {activeTab}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, styles.activeDot]}>
              <MaterialCommunityIcons name="doctor" size={16} color="#fff" />
            </View>
            <Text style={styles.progressLabel}>Doctor</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, selectedDoctor && styles.activeDot]}>
              <MaterialCommunityIcons
                name="account"
                size={16}
                color={selectedDoctor ? "#fff" : "#ccc"}
              />
            </View>
            <Text style={[styles.progressLabel, selectedDoctor && styles.activeLabel]}>
              Patient
            </Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View
              style={[styles.progressDot, selectedDoctor && selectedPatient && styles.activeDot]}
            >
              <MaterialCommunityIcons
                name="upload"
                size={16}
                color={selectedDoctor && selectedPatient ? "#fff" : "#ccc"}
              />
            </View>
            <Text
              style={[
                styles.progressLabel,
                selectedDoctor && selectedPatient && styles.activeLabel,
              ]}
            >
              Upload
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* Doctor Selection Section */}
          <View style={styles.enhancedSelectionSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="doctor" size={20} color="#0077B6" />
              <Text style={styles.enhancedSectionTitle}>Select Doctor</Text>
            </View>
            <View style={styles.tabContainer}>
              {doctors.map((doctor, index) => (
                <TouchableOpacity
                  key={doctor.doctorId}
                  style={[
                    styles.enhancedTabItem,
                    selectedDoctor?.doctorId === doctor.doctorId && styles.selectedTabItem,
                    doctors.length === 1 && styles.fullWidthTab,
                  ]}
                  onPress={() => {
                    setSelectedDoctor(doctor);
                    setSelectedPatient(null); // Reset patient when doctor changes
                  }}
                >
                  <Image source={{ uri: doctor.profileImage }} style={styles.tabItemImage} />
                  <View style={styles.tabItemContent}>
                    <Text style={styles.tabItemText} numberOfLines={1}>
                      {doctor.name}
                    </Text>
                  </View>
                  {selectedDoctor?.doctorId === doctor.doctorId && (
                    <View style={styles.selectedIndicator}>
                      <MaterialCommunityIcons name="check-circle" size={16} color="#0077B6" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Patient Selection Section */}
          {selectedDoctor && (
            <View style={styles.enhancedSelectionSection}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="account" size={20} color="#0077B6" />
                <Text style={styles.enhancedSectionTitle}>Select Patient</Text>
              </View>
              <View style={styles.tabContainer}>
                {(doctorPatients[selectedDoctor.doctorId] || []).map((patient, index) => (
                  <TouchableOpacity
                    key={patient.appointmentId}
                    style={[
                      styles.enhancedTabItem,
                      selectedPatient?.appointmentId === patient.appointmentId &&
                        styles.selectedTabItem,
                      (doctorPatients[selectedDoctor.doctorId] || []).length === 1 &&
                        styles.fullWidthTab,
                    ]}
                    onPress={() => setSelectedPatient(patient)}
                  >
                    <Image
                      source={{ uri: patient.patientProfileImage }}
                      style={styles.tabItemImage}
                    />
                    <View style={styles.tabItemContent}>
                      <Text style={styles.tabItemText} numberOfLines={1}>
                        {patient.patientName}
                      </Text>
                      {patient.behalfUserName && (
                        <Text style={styles.behalfText} numberOfLines={1}>
                          On behalf: {patient.behalfUserName}
                        </Text>
                      )}
                    </View>
                    {selectedPatient?.appointmentId === patient.appointmentId && (
                      <View style={styles.selectedIndicator}>
                        <MaterialCommunityIcons name="check-circle" size={16} color="#0077B6" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Document Uploader */}
          {selectedDoctor && selectedPatient && (
            <View style={styles.enhancedUploaderContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="upload" size={20} color="#0077B6" />
                <Text style={styles.enhancedSectionTitle}>Upload Documents</Text>
              </View>
              <InPageUploader
                onUpload={handleFileUpload}
                uploadType={activeTab.toLowerCase().slice(0, -1)} // "report" or "prescription"
                onClose={() => setShowAddModal(false)}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      {renderTabNavigation()}

      {/* Document List */}
      <View style={styles.content}>{renderDocumentList()}</View>

      {/* Add Document Button */}
      <TouchableOpacity style={styles.fabButton} onPress={handleAddDocument}>
        <View style={styles.fabContent}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.fabText}>
            Add {activeTab === "Reports" ? "Reports" : "Prescriptions"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modals */}
      {renderUploadModal()}
      {renderDocumentModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "#0077B6",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#0077B6",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  emptySection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    minWidth: 160,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0077B6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingHorizontal: 16,
  },
  fabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  enhancedModal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  fullScreenModal: {
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  enhancedModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 0,
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    flex: 1,
    overflow: "hidden",
  },
  fullScreenModalContent: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 50,
  },
  uploadModalContent: {
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  enhancedModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  enhancedModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Progress indicator styles
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  progressStep: {
    alignItems: "center",
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  activeDot: {
    backgroundColor: "#0077B6",
  },
  progressLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#0077B6",
    fontWeight: "600",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  searchBar: {
    margin: 16,
    backgroundColor: "#f5f5f5",
  },
  doctorList: {
    maxHeight: 400,
  },
  doctorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  doctorHospital: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  appointmentList: {
    maxHeight: 400,
  },
  // Empty appointments styles
  emptyAppointmentsContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyAppointmentsIconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  emptyAppointmentsIconOverlay: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 2,
  },
  emptyAppointmentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyAppointmentsSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  doctorNameHighlight: {
    fontWeight: "600",
    color: "#0077B6",
  },
  emptyAppointmentsDescription: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyAppointmentsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#0077B6",
  },
  emptyAppointmentsButtonText: {
    fontSize: 14,
    color: "#0077B6",
    fontWeight: "600",
    marginLeft: 8,
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  appointmentDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  appointmentTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  appointmentLocation: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontStyle: "italic",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  disabledButton: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  selectionContent: {
    flex: 1,
    marginLeft: 12,
  },
  selectionLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectionValue: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
  },
  disabledText: {
    color: "#ccc",
  },
  uploaderContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  enhancedUploaderContainer: {
    marginHorizontal: 8,
    // marginBottom: 16,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // Enhanced tab-like selection styles
  selectionSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  enhancedSelectionSection: {
    marginHorizontal: 8,
    // marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  enhancedSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tabItem: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  enhancedTabItem: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#e9ecef",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  fullWidthTab: {
    minWidth: "100%",
  },
  selectedTabItem: {
    borderColor: "#0077B6",
    backgroundColor: "#f0f8ff",
    elevation: 3,
    shadowColor: "#0077B6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tabItemImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  tabItemContent: {
    flex: 1,
    justifyContent: "center",
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  behalfText: {
    fontSize: 10,
    color: "#666",
    marginTop: 1,
    fontStyle: "italic",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Document card styles
  documentCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  documentTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  documentDoctor: {
    fontSize: 11,
    color: "#0077B6",
    marginTop: 2,
    fontWeight: "500",
  },
  documentBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentBadgeText: {
    fontSize: 12,
    color: "#0077B6",
    fontWeight: "500",
  },
  documentPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreIndicator: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -15,
  },
  moreText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  // Document modal styles
  documentModalContent: {
    backgroundColor: "#000",
    flex: 1,
    overflow: "hidden",
  },
  documentModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  documentModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  documentViewer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  documentImage: {
    width: "100%",
    height: "80%",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  documentCounter: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  documentCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  // Skeleton loader styles
  skeletonContainer: {
    paddingVertical: 8,
  },
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 8,
    width: "80%",
  },
  skeletonDate: {
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    width: "50%",
  },
  skeletonBadge: {
    width: 60,
    height: 24,
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
  },
  skeletonPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#fff",
  },
  // New styles for date grouping
  dateGroup: {
    marginBottom: 16,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  dateGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dateGroupInfo: {
    flex: 1,
  },
  doctorGroupInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorGroupImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  doctorGroupText: {
    flex: 1,
  },
  dateGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dateGroupSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  dateGroupActions: {
    padding: 8,
  },
  dateGroupContent: {
    padding: 8,
  },
  // New styles for file thumbnails
  fileThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  fileIconContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  // New styles for dropdown
  dropdownContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownPickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownPicker: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  // Document list container with bottom padding
  documentListContainer: {
    paddingBottom: 100, // Provides gap after the list, accounting for FAB button
  },
});

export default UploadDocumentScreen;
