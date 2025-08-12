import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const { height: screenHeight } = Dimensions.get("window");

const DocumentUploader = ({ onUpload, uploadType, onClose }) => {
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]); // Changed to array to handle multiple files
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const maxFiles = uploadType === "report" ? 5 : 1;

  // Function to detect file type
  const getFileType = fileName => {
    if (!fileName) return "unknown";

    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "heic", "heif"].includes(extension)) {
      return "image";
    } else if (["pdf"].includes(extension)) {
      return "pdf";
    } else if (["doc", "docx"].includes(extension)) {
      return "word";
    } else if (["xls", "xlsx"].includes(extension)) {
      return "excel";
    } else if (["ppt", "pptx"].includes(extension)) {
      return "powerpoint";
    } else if (["txt"].includes(extension)) {
      return "text";
    } else {
      return "other";
    }
  };

  // Function to get appropriate icon for file type
  const getFileIcon = fileType => {
    switch (fileType) {
      case "image":
        return "file-image";
      case "pdf":
        return "file-pdf-box";
      case "word":
        return "file-word-box";
      case "excel":
        return "file-excel-box";
      case "powerpoint":
        return "file-powerpoint-box";
      case "text":
        return "file-document-outline";
      default:
        return "file-outline";
    }
  };

  const handleFilePress = file => {
    setSelectedFile(file);
    setPreviewModalVisible(true);
  };

  const closePreviewModal = () => {
    setPreviewModalVisible(false);
    setSelectedFile(null);
  };

  const handlePickFile = async type => {
    try {
      // Check if we've reached the file limit
      if (files.length >= maxFiles) {
        ToastAndroid.show(
          `You can only upload ${maxFiles} file${maxFiles > 1 ? "s" : ""} for ${uploadType}s.`,
          ToastAndroid.SHORT
        );
        return;
      }

      setIsLoading(true);
      let result;

      if (type === "document") {
        const remainingSlots = maxFiles - files.length;
        result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: true,
          multiple: uploadType === "report" && remainingSlots > 1, // Allow multiple only if more than 1 slot remaining
        });

        if (result?.assets) {
          const newFiles = result.assets.map(file => {
            const fileType = getFileType(file.name);
            return {
              uri: file.uri,
              name: file.name,
              type: fileType,
              id: Date.now() + Math.random(), // Unique ID for each file
            };
          });

          // Only take files up to the remaining limit
          const filesToAdd = newFiles.slice(0, remainingSlots);
          setFiles(prev => [...prev, ...filesToAdd]);

          // Alert if some files were rejected due to limit
          if (newFiles.length > remainingSlots) {
            Alert.alert(
              "File Limit Reached",
              `Only ${remainingSlots} file${remainingSlots > 1 ? "s" : ""} could be added. Maximum ${maxFiles} files allowed for ${uploadType}s.`
            );
          }
        }
      } else if (type === "camera" || type === "gallery") {
        const permission =
          type === "camera"
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          setIsLoading(false);
          ToastAndroid.show("Permission is required.", ToastAndroid.SHORT);
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

          // Only take files up to the remaining limit
          const filesToAdd = newFiles.slice(0, remainingSlots);
          setFiles(prev => [...prev, ...filesToAdd]);

          // Alert if some files were rejected due to limit
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
      ToastAndroid.show("Error picking file. Please try again.", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = fileId => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleUpload = async () => {
    if (!note.trim() && files.length === 0) {
      ToastAndroid.show("Add a file or a note.", ToastAndroid.SHORT);
      return;
    }

    setIsSaving(true);

    try {
      await onUpload({ files: files, note: note.trim() }, uploadType);

      // Reset state only after successful upload
      setFiles([]);
      setNote("");
    } catch (error) {
      console.error("Upload error:", error);
      ToastAndroid.show("Upload failed. Please try again.", ToastAndroid.SHORT);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFilePreview = file => (
    <TouchableOpacity
      key={file.id}
      style={styles.fileCard}
      onPress={() => handleFilePress(file)}
      activeOpacity={0.7}
    >
      <View style={styles.fileCardContent}>
        <View style={styles.fileIconContainer}>
          <MaterialCommunityIcons name={getFileIcon(file.type)} size={32} color="#01869e" />
        </View>

        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>
          <Text style={styles.fileType}>
            {file.type === "image"
              ? "Image"
              : file.type === "pdf"
                ? "PDF"
                : file.type === "word"
                  ? "Word Document"
                  : file.type === "excel"
                    ? "Excel Spreadsheet"
                    : file.type === "powerpoint"
                      ? "PowerPoint"
                      : file.type === "text"
                        ? "Text File"
                        : file.type.charAt(0).toUpperCase() + file.type.slice(1)}
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveFile(file.id)}>
          <MaterialCommunityIcons name="delete" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.modalContainer}>
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#01869e" />
            <Text style={styles.loadingText}>Loading file...</Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.modalScrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons
              name={uploadType === "report" ? "file-document-multiple" : "pill"}
              size={24}
              color="#01869e"
            />
            <Text style={styles.modalTitle}>
              Upload {uploadType === "report" ? "Report" : "Prescription"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.fileCounter}>
              <Text style={styles.fileCounterText}>
                {files.length}/{maxFiles}
              </Text>
            </View>
            {onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Upload Options */}
        <View style={styles.uploadOptionsContainer}>
          <Text style={styles.sectionTitle}>Choose Source</Text>
          <View style={styles.uploadOptions}>
            <TouchableOpacity
              onPress={() => handlePickFile("document")}
              style={[
                styles.uploadOptionButton,
                { opacity: files.length >= maxFiles || isLoading ? 0.5 : 1 },
              ]}
              disabled={files.length >= maxFiles || isLoading}
            >
              <View style={styles.uploadOptionIcon}>
                <MaterialCommunityIcons name="file-document" size={28} color="#01869e" />
              </View>
              <Text style={styles.uploadOptionText}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePickFile("gallery")}
              style={[
                styles.uploadOptionButton,
                { opacity: files.length >= maxFiles || isLoading ? 0.5 : 1 },
              ]}
              disabled={files.length >= maxFiles || isLoading}
            >
              <View style={styles.uploadOptionIcon}>
                <MaterialCommunityIcons name="image" size={28} color="#01869e" />
              </View>
              <Text style={styles.uploadOptionText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePickFile("camera")}
              style={[
                styles.uploadOptionButton,
                { opacity: files.length >= maxFiles || isLoading ? 0.5 : 1 },
              ]}
              disabled={files.length >= maxFiles || isLoading}
            >
              <View style={styles.uploadOptionIcon}>
                <MaterialCommunityIcons name="camera" size={28} color="#01869e" />
              </View>
              <Text style={styles.uploadOptionText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Files */}
        {files.length > 0 && (
          <View style={styles.selectedFilesContainer}>
            <Text style={styles.sectionTitle}>Selected Files</Text>
            <View style={styles.filesContainer}>{files.map(renderFilePreview)}</View>
          </View>
        )}

        {/* Note Input */}
        <View style={styles.noteContainer}>
          <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
          <TextInput
            placeholder="Enter additional notes or description..."
            value={note}
            onChangeText={setNote}
            multiline
            style={styles.noteInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadButton, isSaving && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialCommunityIcons name="cloud-upload" size={24} color="#fff" />
          )}
          <Text style={styles.uploadButtonText}>
            {isSaving ? "Saving..." : `Save ${uploadType === "report" ? "Report" : "Prescription"}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* File Preview Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={previewModalVisible}
        onRequestClose={closePreviewModal}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.previewModalOverlay}>
          <Pressable style={styles.previewModalBackground} onPress={closePreviewModal}>
            <View style={styles.previewModalContent}>
              <TouchableOpacity style={styles.previewCloseButton} onPress={closePreviewModal}>
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>

              {selectedFile && selectedFile.type === "image" ? (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.previewModalImage}
                  resizeMode="contain"
                />
              ) : selectedFile ? (
                <View style={styles.previewModalDocumentContainer}>
                  <MaterialCommunityIcons
                    name={getFileIcon(selectedFile.type)}
                    size={120}
                    color="#01869e"
                  />
                  <Text style={styles.previewModalDocumentText}>
                    {selectedFile.type === "pdf"
                      ? "PDF Document"
                      : selectedFile.type === "word"
                        ? "Word Document"
                        : selectedFile.type === "excel"
                          ? "Excel Spreadsheet"
                          : selectedFile.type === "powerpoint"
                            ? "PowerPoint Presentation"
                            : selectedFile.type === "text"
                              ? "Text File"
                              : "Document"}
                  </Text>
                  <Text style={styles.previewModalDocumentSubtext}>
                    This file will be uploaded and can be viewed after upload
                  </Text>
                </View>
              ) : null}

              {selectedFile && (
                <View style={styles.previewModalInfo}>
                  <Text style={styles.previewModalFileName}>{selectedFile.name}</Text>
                  <Text style={styles.previewModalFileType}>
                    {selectedFile.type === "image"
                      ? "Image File"
                      : selectedFile.type === "pdf"
                        ? "PDF Document"
                        : selectedFile.type === "word"
                          ? "Word Document"
                          : selectedFile.type === "excel"
                            ? "Excel Spreadsheet"
                            : selectedFile.type === "powerpoint"
                              ? "PowerPoint"
                              : selectedFile.type === "text"
                                ? "Text File"
                                : selectedFile.type.charAt(0).toUpperCase() +
                                  selectedFile.type.slice(1)}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default DocumentUploader;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: "relative",
    maxHeight: screenHeight * 0.7,
  },
  modalScrollView: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 12,
  },
  fileCounter: {
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fileCounterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#01869e",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  uploadOptionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  uploadOptionButton: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    minWidth: 100,
    minHeight: 80,
  },
  uploadOptionIcon: {
    backgroundColor: "#e8f4f8",
    padding: 12,
    borderRadius: 40,
    marginBottom: 6,
  },
  uploadOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedFilesContainer: {
    marginBottom: 20,
  },
  // New styles for multiple files
  filesContainer: {
    marginBottom: 10,
  },
  fileCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f4f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  fileType: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#ffebee",
    borderRadius: 20,
  },
  noteContainer: {
    marginBottom: 20,
  },
  noteInput: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f8f9fa",
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#01869e",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#01869e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minHeight: 56,
    marginBottom: 40,
  },
  uploadButtonDisabled: {
    backgroundColor: "#94a3b8",
    elevation: 1,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewModalBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  previewModalContent: {
    width: "90%",
    maxHeight: "80%",
    position: "relative",
    overflow: "hidden",
  },
  previewCloseButton: {
    position: "absolute",
    top: -40,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  previewModalImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
  },
  previewModalInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  previewModalFileName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  previewModalFileType: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
  },
  previewModalDocumentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 20,
  },
  previewModalDocumentText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  previewModalDocumentSubtext: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  //updatted styles
  uploadTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  uploadOption: {
    alignItems: "center",
  },

  noteInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginBottom: 10,
  },

  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },

  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#01869e",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  uploadButtonText: {
    color: "#fff",
    marginLeft: 8,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  emptySection: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },

  addButton: {
    flexDirection: "row",
    backgroundColor: "#01869e",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    marginLeft: 6,
  },

  //old styles

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#01869e",
  },
  noteInput: {
    minHeight: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#01869e",
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#01869e",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadText: {
    marginLeft: 6,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
