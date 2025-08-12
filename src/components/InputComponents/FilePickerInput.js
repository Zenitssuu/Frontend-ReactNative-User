import { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { Color, Border, FontFamily, FontSize } from "../../constants/GlobalStyles";
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { deletePreviousFile, uploadToS3 } from "../../services/fileUpload";
import { LoadingSpinner } from "../../components/UIComponents";
import { useSelector } from "react-redux";
import apiService from "../../services/api";

export default function FilePickerInput({ value = [], onChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewImageUri, setViewImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = useSelector(state => state?.user?.profile);
  ////console.log(user);
  const addImage = s3Url => {
    const newValue = [...value, s3Url];
    const labelArray = newValue.map(getFileName); // use filename as label

    onChange(newValue, labelArray);
  };

  const removeImage = (item, index) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setUploading(true);
              const folderName = `patient/${user?.patientId}/symptoms`;
              ////console.log("delete folder name", folderName);
              const key = item.split("com/")[1];
              ////console.log(key);
              await deletePreviousFile({ key: key, folderName });
              const newImages = [...value];
              newImages.splice(index, 1);
              const newLabels = newImages.map(getFileName);
              onChange(newImages, newLabels);
              if (viewImageUri === value[index]) {
                setViewImageUri(null);
              }
            } catch (error) {
              ////console.log(error);
            } finally {
              setUploading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromLibrary = async () => {
    setModalVisible(false);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your media library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      // Store local URI temporarily for preview
      // addImage(result.assets[0].uri);
      setUploading(true);
      const image = result.assets[0];

      // Extract file name and type
      const fileName = image.uri.split("/").pop();
      const mimeType = image.type || "image/jpeg";

      //todo : change the folder of s3 before merging into main branch
      const folderName = `patient/${user?.patientId}/symptoms`;
      // ////console.log(folderName);

      const s3Url = await uploadToS3(image.uri, fileName, mimeType, folderName, setUploading);
      if (s3Url) {
        // setS3FileUrl(s3Url);
        ////console.log(s3Url);
        addImage(s3Url);
      } else {
        addImage(result.assets[0].uri);
      }
      setUploading(false);
    }
  };

  const takePhotoWithCamera = async () => {
    setModalVisible(false);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      // Store local URI temporarily for preview
      const image = result.assets[0];
      // Extract file name and type
      const fileName = image.uri.split("/").pop();
      const mimeType = image.type || "image/jpeg";

      const folderName = `patient/${user?.patientId}/symptoms`;
      ////console.log(folderName);

      // Upload to S3
      const s3Url = await uploadToS3(image.uri, fileName, mimeType, folderName, setUploading);
      if (s3Url) {
        addImage(s3Url);
      } else {
        addImage(result.assets[0].uri);
      }
    }
  };

  const getFileName = uri => {
    return uri.split("/").pop();
  };

  const handlePreview = async url => {
    setUploading(true);
    // const key = url.split("com/")[1];
    // console.log(url);
    const signedUrl = await apiService.uploadFile.getURL(url);
    console.log("signed url", signedUrl.signedUrl);
    setUploading(false);
    setViewImageUri(signedUrl.data.signedUrl);
  };

  if (uploading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.uploadImageButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.uploadImageButtonText}>Upload Image</Text>
      </Pressable>
      {/* <Button
        style={styles.buttonStyle}
        title="Upload Image"
        onPress={() => setModalVisible(true)}
      /> */}
      <View style={{ marginTop: 20 }}>
        {value.map((item, index) => (
          <View key={index.toString()} style={styles.fileRow}>
            <Text style={styles.fileName}>{`Image ${index + 1}`}</Text>
            <View style={[styles.fileActions, { paddingHorizontal: 5 }]}>
              <TouchableOpacity
                onPress={() => handlePreview(item)}
                style={styles.previewIconContainer}
              >
                <Icon name="eye" size={20} color={Color.headingColor} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeImage(item, index)}
                style={styles.deleteIconContainer}
              >
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Modal for camera/gallery selection */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Image</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity onPress={takePhotoWithCamera} style={styles.modalButton}>
                <AntDesign name="camera" color={Color.headingColor} size={35} />
              </TouchableOpacity>

              <TouchableOpacity onPress={pickImageFromLibrary} style={styles.modalButton}>
                <Entypo name="upload" color={Color.headingColor} size={35} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fullscreen image viewer */}
      <Modal
        visible={!!viewImageUri}
        transparent
        animationType="fade"
        onRequestClose={() => setViewImageUri(null)}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity
            style={styles.fullscreenCloseArea}
            onPress={() => setViewImageUri(null)}
          />
          <Image
            source={{ uri: viewImageUri || "" }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
          <Button title="Close" onPress={() => setViewImageUri(null)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 16,
  },
  fileActions: {
    flexDirection: "row",
    gap: 20,
  },
  viewText: {
    color: "blue",
    marginHorizontal: 10,
  },
  deleteText: {
    color: "red",
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000088",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 15,
    borderTopWidth: 2,
    borderColor: "#ccc",
    marginTop: 10,
  },
  cancelText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
  },
  fullscreenCloseArea: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonStyle: {
    backgroundColor: Color.headingColor,
    color: Color.colorWhite,
    padding: 10,
    fontSize: 10,
  },
  uploadImageButton: {
    flex: 1,
    backgroundColor: Color.headingColor,
    paddingVertical: 16,
    borderRadius: Border.br_xl,
    alignItems: "center",
    elevation: 3,
  },
  uploadImageButtonText: {
    color: "white",
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    fontWeight: "600",
  },
  previewIconContainer: {
    borderColor: Color.headingColor,
    borderWidth: 2,
    borderRadius: 20,
    padding: 5,
    backgroundColor: Color.headerBg,
  },
  deleteIconContainer: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 20,
    padding: 5,
    backgroundColor: "#f6e4deff",
  },
});
