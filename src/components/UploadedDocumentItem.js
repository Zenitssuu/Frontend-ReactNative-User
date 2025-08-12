import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Linking,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as IntentLauncher from "expo-intent-launcher";

const UploadedDocumentItem = ({ file, description, date, onShare, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const formatDate = raw => {
    if (!raw) return null;
    const d = new Date(raw);
    return d.toLocaleString();
  };

  // Function to detect file type
  const getFileType = fileUri => {
    if (!fileUri) return "unknown";

    // Handle URLs with query parameters
    const cleanUri = fileUri.split("?")[0];
    const extension = cleanUri.split(".").pop()?.toLowerCase();

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
      // If no extension or unknown extension, try to detect from URL
      if (fileUri.includes("image") || fileUri.includes("photo") || fileUri.includes("img")) {
        return "image";
      } else if (fileUri.includes("pdf")) {
        return "pdf";
      } else {
        return "other";
      }
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

  const handleTilePress = () => {
    if (file?.uri) {
      const fileType = getFileType(file.uri);

      if (fileType === "pdf") {
        // Try to open PDF in external PDF apps using expo-intent-launcher
        const openPDFInExternalApp = async () => {
          try {
            if (Platform.OS === "android") {
              // Use expo-intent-launcher for Android to open PDF in external apps
              const result = await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                data: file.uri,
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
              await Linking.openURL(file.uri);
            }
          } catch (error) {
            console.error("Error opening PDF:", error);

            // Fallback: try to open with default PDF handling
            try {
              await Linking.openURL(file.uri);
            } catch (fallbackError) {
              console.error("Fallback PDF opening failed:", fallbackError);
              // AleAlert.alert(
              //     "PDF Viewer Not Found",
              //     "No PDF viewer app is installed on your device. Please install a PDF reader app like Adobe Acrobat Reader, Google PDF Viewer, or any other PDF reader app."
              //   );
            }
          }
        };

        openPDFInExternalApp();
      } else if (fileType === "image") {
        // Open image in modal viewer
        setModalVisible(true);
      } else {
        // For other file types, try to open with default app
        Linking.canOpenURL(file.uri)
          .then(supported => {
            if (supported) {
              return Linking.openURL(file.uri);
            } else {
              Alert.alert("Error", "No app found to open this file type");
            }
          })
          .catch(error => {
            console.error("Error opening file:", error);
            Alert.alert("Error", "Failed to open file");
          });
      }
    }
  };

  // Use s3Key or prescriptionId or file.uri as id
  const documentId = file?.s3Key || file?.prescriptionId || file?.uri;
  const fileType = getFileType(file?.uri);

  const handleShare = () => {
    if (onShare) {
      onShare(documentId);
    } else {
      console.log("Share document:", documentId);
    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setDeleteModalVisible(false);
    if (onDelete) {
      onDelete(documentId);
    } else {
      console.log("Delete document:", documentId);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.uploadedItemContainer}
        onPress={handleTilePress}
        activeOpacity={0.7}
      >
        <View style={styles.tileContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={getFileIcon(fileType)} size={32} color="#01869e" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.uploadedNote}>
              {description?.trim()
                ? description
                : file?.uri
                  ? `${fileType.toUpperCase()} Document`
                  : "Text Note"}
            </Text>

            {date && (
              <Text style={styles.uploadedDate}>
                <MaterialCommunityIcons name="calendar-check" size={14} color="#888" />{" "}
                {formatDate(date)}
              </Text>
            )}
          </View>

          {file?.uri && null}

          {/* Share and Delete Buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <MaterialCommunityIcons name="share-variant" size={22} color="#01869e" />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <MaterialCommunityIcons name="delete" size={22} color="#dc3545" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Image Preview Modal - Only for images */}
      {fileType === "image" && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{ margin: 0, overflow: "hidden" }}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>

                {file?.uri && (
                  <Image
                    source={{ uri: file.uri }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}

                {description?.trim() && (
                  <View style={styles.modalDescription}>
                    <Text style={styles.modalDescriptionText}>{description}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <MaterialCommunityIcons
              name="alert"
              size={36}
              color="#dc3545"
              style={{ alignSelf: "center", marginBottom: 8 }}
            />
            <Text style={styles.confirmModalTitle}>Delete Document?</Text>
            <Text style={styles.confirmModalText}>
              Are you sure you want to delete this document? This action cannot be undone.
            </Text>
            <View style={styles.confirmModalActions}>
              <TouchableOpacity style={styles.confirmCancelButton} onPress={cancelDelete}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteButton} onPress={confirmDelete}>
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadedItemContainer: {
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tileContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e6f7fa",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  uploadedNote: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  uploadedDate: {
    fontSize: 12,
    color: "#888",
    flexDirection: "row",
    alignItems: "center",
  },
  previewIcon: {
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  actionButton: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    position: "relative",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: -40,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
  },
  modalDescription: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  modalDescriptionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
    elevation: 5,
    overflow: "hidden",
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc3545",
    marginBottom: 8,
    textAlign: "center",
  },
  confirmModalText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmCancelButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmCancelText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmDeleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default UploadedDocumentItem;
