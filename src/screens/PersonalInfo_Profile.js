import React, { useState, useEffect } from "react";
import { Avatar } from "react-native-paper";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
  SectionList,
  ActivityIndicator,
  ToastAndroid,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Color, FontFamily, FontSize } from "../constants/GlobalStyles";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Redux/Slices/UserSlice";

import apiService from "../services/api";
import { handleApiMutation, createFormData } from "../services/apiUtils";
import { deletePreviousFile } from "../services/fileUpload";

const { height, width } = Dimensions.get("window");

// Skeleton Loading Component
const ProfileSkeletonLoading = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const renderSkeletonField = () => (
    <View style={styles.fieldWrapper}>
      <Animated.View style={[styles.skeletonFieldTitle, { opacity: fadeAnim }]} />
      <Animated.View style={[styles.skeletonInput, { opacity: fadeAnim }]} />
    </View>
  );

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.sub}>
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>

      <View style={styles.sub}>{renderSkeletonField()}</View>

      <View style={styles.sub}>{renderSkeletonField()}</View>

      <View style={styles.sub}>
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>

      <View style={styles.sub}>{renderSkeletonField()}</View>

      <View style={styles.sub}>
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>

      <View style={styles.sub}>
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>
    </View>
  );
};

export default function PersonalInfo_Profile({ navigation }) {
  const dispatch = useDispatch();

  const { profile } = useSelector(state => state.user);
  // const [profile, setProfile] = useState({});
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [firstname, setfirstname] = useState("");
  const [middlename, setmiddlename] = useState("");
  const [lastname, setlastname] = useState("");
  const [place_of_birth, setplace_of_birth] = useState("");
  const [pin, setpin] = useState("");
  const [specialbloodtype, setspecialbloodtype] = useState("");
  const [date, setDate] = useState();
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [languagerw, setlanguagerwmore] = useState(false);
  const [languagespeakmore, setlanguagespeakmore] = useState(false);
  const [languageunderstandmore, setlanguageunderstandmore] = useState(false);
  //MOdal Variables
  const [isModalVisiblephoto, setModalVisiblephoto] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempAnswer, setTempAnswer] = useState(null);
  const [selecteddistrict, setselecteddistrict] = useState("");
  //   Track Changes
  const [isUpdated, setIsUpdated] = useState(false);
  const [state, setstate] = useState("");
  const [bloodgroup, setbloodgroup] = useState("");
  const [modalitemsbloodgroup] = useState([
    { id: "1", label: "A+" },
    { id: "2", label: "A-" },
    { id: "3", label: "B+" },
    { id: "4", label: "B-" },
    { id: "5", label: "O+" },
    { id: "6", label: "O-" },
    { id: "7", label: "AB+" },
    { id: "8", label: "AB-" },
    { id: "9", label: "Other" },
  ]);
  const [valuegender, setvaluegender] = useState();
  const [modalitemsgender] = useState([
    { id: "1", label: "Male" },
    { id: "2", label: "Female" },
    { id: "3", label: "Other" },
  ]);
  const [valueMarry, setvaluemarry] = useState("");
  const [modalitemsmarry] = useState([
    { id: "1", label: "Single" },
    { id: "2", label: "Married" },
    { id: "3", label: "Other" },
  ]);
  const [language, setlanguage] = useState([]);
  const [tempLanguage, setTempLanguage] = useState([]);
  const [languagespeak, setlanguagespeak] = useState([]);
  const [languagereadwrite, setlanguagereadwrite] = useState([]);
  const languages = {
    majorLanguages: [
      { id: "1", label: "English" },
      { id: "2", label: "Hindi" },
      { id: "3", label: "Bengali" },
      { id: "4", label: "Telugu" },
      { id: "5", label: "Marathi" },
      { id: "6", label: "Tamil" },
      { id: "7", label: "Urdu" },
      { id: "8", label: "Gujarati" },
      { id: "9", label: "Malayalam" },
      { id: "10", label: "Odia" },
      { id: "11", label: "Punjabi" },
      { id: "12", label: "Kannada" },
      { id: "13", label: "Assamese" },
      { id: "14", label: "Maithili" },
      { id: "15", label: "Santali" },
      { id: "16", label: "Kashmiri" },
      { id: "17", label: "Nepali" },
      { id: "18", label: "Konkani" },
      { id: "19", label: "Sindhi" },
      { id: "20", label: "Dogri" },
      { id: "21", label: "Manipuri" },
      { id: "22", label: "Bodo" },
    ],
    otherLanguages: [
      { id: "1", label: "Adi" },
      { id: "2", label: "Anal" },
      { id: "3", label: "Angami" },
      { id: "4", label: "Apatani" },
      { id: "5", label: "Ao" },
      { id: "6", label: "Bawm" },
      { id: "7", label: "Bhil" },
      { id: "8", label: "Bhili/Bhilodi" },
      { id: "9", label: "Biate" },
      { id: "10", label: "Bishnupriya Manipuri" },
      { id: "11", label: "Bugun" },
      { id: "12", label: "Chakma" },
      { id: "13", label: "Chang" },
      { id: "14", label: "Chiru" },
      { id: "15", label: "Deori" },
      { id: "16", label: "Deng" },
      { id: "17", label: "Dimasa" },
      { id: "18", label: "Dimasa Kachari" },
      { id: "19", label: "Galo" },
      { id: "20", label: "Garo" },
      { id: "21", label: "Gondi" },
      { id: "22", label: "Gujari" },
      { id: "23", label: "Halbi" },
      { id: "24", label: "Hmar" },
      { id: "25", label: "Ho" },
      { id: "26", label: "Hrangkhol" },
      { id: "27", label: "Khamti" },
      { id: "28", label: "Kharia" },
      { id: "29", label: "Khasi" },
      { id: "30", label: "Khiamniungan" },
      { id: "31", label: "Khokborok" },
      { id: "32", label: "Khowar" },
      { id: "33", label: "Konyak" },
      { id: "34", label: "Koya" },
      { id: "35", label: "Kuki" },
      { id: "36", label: "Kurukh" },
      { id: "37", label: "Kuvi" },
      { id: "38", label: "Ladakhi" },
      { id: "39", label: "Lambadi" },
      { id: "40", label: "Lamkang" },
      { id: "41", label: "Lepcha" },
      { id: "42", label: "Lotha" },
      { id: "43", label: "Malto" },
      { id: "44", label: "Manda" },
      { id: "45", label: "Maram" },
      { id: "46", label: "Mara" },
      { id: "47", label: "Meitei (Manipuri)" },
      { id: "48", label: "Miju" },
      { id: "49", label: "Mishing" },
      { id: "50", label: "Mizo" },
      { id: "51", label: "Monpa" },
      { id: "52", label: "Muduga" },
      { id: "53", label: "Mru" },
      { id: "54", label: "Mundari" },
      { id: "55", label: "Muthuvan" },
      { id: "56", label: "Nishi" },
      { id: "57", label: "Nihali" },
      { id: "58", label: "Nocte" },
      { id: "59", label: "Nyishi" },
      { id: "60", label: "Pali" },
      { id: "61", label: "Paite" },
      { id: "62", label: "Phom" },
      { id: "63", label: "Pnar" },
      { id: "64", label: "Pochury" },
      { id: "65", label: "Prakrit" },
      { id: "66", label: "Rabha" },
      { id: "67", label: "Ralte" },
      { id: "68", label: "Ranglong" },
      { id: "69", label: "Rangpuri" },
      { id: "70", label: "Riang" },
      { id: "71", label: "Sanskrit" },
      { id: "72", label: "Savara" },
      { id: "73", label: "Sherdukpen" },
      { id: "74", label: "Shina" },
      { id: "75", label: "Simte" },
      { id: "76", label: "Singpho" },
      { id: "77", label: "Sora" },
      { id: "78", label: "Tagin" },
      { id: "79", label: "Tai Aiton" },
      { id: "80", label: "Tai Khamti" },
      { id: "81", label: "Tai Phake" },
      { id: "82", label: "Tai Turung" },
      { id: "83", label: "Tamang" },
      { id: "84", label: "Tangkhul" },
      { id: "85", label: "Tangsa" },
      { id: "86", label: "Thadou" },
      { id: "87", label: "Thami" },
      { id: "88", label: "Toto" },
      { id: "89", label: "Toda" },
      { id: "90", label: "Tripuri" },
      { id: "91", label: "Tulu" },
      { id: "92", label: "Vaiphei" },
      { id: "93", label: "Wagdi" },
      { id: "94", label: "Wancho" },
      { id: "95", label: "Zangskari" },
      { id: "96", label: "Zeliang" },
      { id: "97", label: "Zeme" },
    ],
  };

  const sections = [
    { title: "Major Languages", data: languages.majorLanguages },
    { title: "Other Languages", data: languages.otherLanguages },
  ];

  const handleProfileImageUpdate = async imageUri => {
    try {
      setProfileImageLoading(true);
      setLoading(true);
      const formData = createFormData({ profileImage: imageUri }, ["profileImage"]);

      await handleApiMutation(apiService.profile.updateProfileImage, {
        args: [formData],
        successMessage: "Profile image updated successfully",
        onSuccess: response => {
          const {
            data: {
              data: { profileImage },
            },
          } = response;
          dispatch(updateProfile({ profileImage }));
        },
      });
    } catch (error) {
      console.error("Failed to update profile image:", error);
    } finally {
      setProfileImageLoading(false);
      setLoading(false);
    }
  };

  const handleCameraLaunch = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Camera access is needed.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 4],
        quality: 0.5, // Reduced quality to prevent memory issues
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await handleProfileImageUpdate(result.assets[0].uri);
        setModalVisiblephoto(false);
      }
    } catch (error) {
      console.error("Failed to launch camera:", error);
      Alert.alert("Error", "Failed to access camera. Please try again or use gallery instead.");
    }
  };

  const handleGalleryLaunch = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      await handleProfileImageUpdate(result.assets[0].uri);
      setModalVisiblephoto(false);
    }
  };

  const removePhoto = () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            setProfileImageLoading(true);
            const resp = await apiService.profile.deleteProfileImage();
            dispatch(updateProfile({ profileImage: "" }));
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
            setProfileImageLoading(false);
            setModalVisiblephoto(false);
          }
        },
      },
    ]);
  };

  // handle function for Gender
  const handleModal = value => {
    setTempAnswer(value);
    if (value === "language(rw)") {
      setTempLanguage(languagereadwrite);
    }
    if (value === "language(s)") {
      setTempLanguage(languagespeak);
    }
    if (value === "language(u)") {
      setTempLanguage(language);
    }
    setModalVisible(true);
  };
  const handleModalHide = () => {
    setTempAnswer(null);
    setTempLanguage([]);
  };
  //Gender Dropdown Selection
  const toggleSelectiongender = item => {
    setvaluegender(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };
  const toggleSelectionbloodgroup = item => {
    setbloodgroup(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };
  const handleCloseModallanguagerw = () => {
    setlanguagereadwrite(tempLanguage);
    setModalVisible(false);
  };
  const handleCloseModallanguagespeak = () => {
    setlanguagespeak(tempLanguage);
    setModalVisible(false);
  };
  const handleCloseModallanguageunderstand = () => {
    setlanguage(tempLanguage);
    setModalVisible(false);
  };
  const toggleSelectionlanguagetemp = item => {
    setTempLanguage(prevSelected => {
      if (prevSelected.includes(item.label)) {
        // Remove the item if already selected
        return prevSelected.filter(bg => bg !== item.label);
      } else {
        // Add the item if not selected
        return [...prevSelected, item.label];
      }
    });
  };
  const toggleSelectionmarry = item => {
    setvaluemarry(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };

  const fetchLocation = async enteredPincode => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${enteredPincode}`);
      const data = await response.json();

      if (data[0].Status === "Success") {
        setstate(data[0].PostOffice[0].State);
        setselecteddistrict(data[0].PostOffice[0].District);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Invalid Pincode",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0, // xOffset (0 keeps it centered horizontally)
          100 // yOffset (increase to move it down, decrease for higher placement)
        );
        setpin("");
        setstate("");
        setselecteddistrict("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location data.");
    }
  };

  // Handle Pincode
  const handlePincodeChange = text => {
    const numericText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setpin(numericText);

    if (numericText.length === 6) {
      fetchLocation(numericText);
    } else {
      setstate("");
      setselecteddistrict("");
    }
  };
  // Handle date/time change
  const onChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShow(false); // Close picker for Android
  };

  const [changedFields, setChangedFields] = useState([]);
  useEffect(() => {
    const formattedDate = date ? date?.toISOString().split("T")[0] : "1990-01-01";
    const initialDate = new Date(profile?.dateOfBirth ? profile?.dateOfBirth : "1990-01-01")
      .toISOString()
      .split("T")[0];

    let changes = [];

    if (firstname !== profile?.firstName) changes.push("First Name");
    if (middlename !== profile?.middleName) changes.push("Middle Name");
    if (lastname !== profile?.lastName) changes.push("Last Name");
    if (valuegender !== profile?.gender) changes.push("Gender");
    if (formattedDate !== initialDate) changes.push("Date of Birth");
    if (place_of_birth !== profile?.placeOfBirth?.place) changes.push("Place of Birth");
    if (state !== profile?.placeOfBirth?.state) changes.push("State");
    if (selecteddistrict !== profile?.placeOfBirth?.district) changes.push("District");
    if (pin !== profile?.placeOfBirth?.pincode) changes.push("Pincode");
    if (valueMarry !== profile?.maritalStatus) changes.push("Marital Status");
    if (bloodgroup !== profile?.bloodGroup) changes.push("Blood Group");
    if (specialbloodtype !== profile?.specialType) changes.push("Special Blood Type");
    if (JSON.stringify(language) !== JSON.stringify(profile?.UnderstandIndianLanguages))
      changes.push("Known Languages");
    if (JSON.stringify(languagespeak) !== JSON.stringify(profile?.SpeakIndianLanguages))
      changes.push("Languages Spoken");
    if (JSON.stringify(languagereadwrite) !== JSON.stringify(profile?.ReadWriteIndianLanguages))
      changes.push("Languages Read & Write");

    setChangedFields(changes);
    setIsUpdated(changes.length > 0);
  }, [
    firstname,
    middlename,
    lastname,
    valuegender,
    date,
    place_of_birth,
    state,
    selecteddistrict,
    valueMarry,
    bloodgroup,
    specialbloodtype,
    language,
    languagespeak,
    languagereadwrite,
  ]);

  //   // Fetch Data
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const token = await AsyncStorage.getItem("AccessToken");
  //       if (token && !profile) {
  //         // dispatch(fetchProfile(token));
  //       }
  //     };

  //     fetchData();
  //   }, [dispatch]);

  // **New Effect to Sync Data After `setData`**
  useEffect(() => {
    if (profile) {
      setfirstname(profile?.firstName || "");
      setmiddlename(profile?.middleName || "");
      setlastname(profile?.lastName || "");
      setplace_of_birth(profile?.placeOfBirth?.place || "");
      setpin(profile?.placeOfBirth?.pincode || "");
      setspecialbloodtype(profile?.specialType || "");
      setDate(new Date(profile?.dateOfBirth || "1990-01-01"));
      setstate(profile?.placeOfBirth?.state || "");
      setselecteddistrict(profile?.placeOfBirth?.district || "");
      setbloodgroup(profile?.bloodGroup || "");
      setvaluegender(profile?.gender || "");
      setvaluemarry(profile?.maritalStatus || "");
      setlanguage(profile?.UnderstandIndianLanguages || []);
      setlanguagespeak(profile?.SpeakIndianLanguages || []);
      setlanguagereadwrite(profile?.ReadWriteIndianLanguages || []);
    }
  }, [profile]); // ✅ Profile change hone par hi chalega

  const handleProfileUpdate = async profileData => {
    try {
      setLoadingSubmit(true);

      await handleApiMutation(apiService.profile.updateProfile, {
        args: [profileData],
        successMessage: "Profile updated successfully",
        onSuccess: data => {
          dispatch(
            updateProfile({
              ...profileData,
              ["dateOfBirth"]: new Date(profileData.dateOfBirth).toISOString(),
            })
          );
          setIsUpdated(false);
          setChangedFields([]);
        },
      });
    } catch (error) {
      Alert.alert("Update Failed", "Something went wrong. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async () => {
    // Create an object with the updated data
    const updatedData = {
      firstName: firstname,
      middleName: middlename,
      lastName: lastname,
      gender: valuegender,
      dateOfBirth: date,
      placeOfBirth: {
        place: place_of_birth,
        state,
        district: selecteddistrict,
        pincode: pin,
      },
      maritalStatus: valueMarry,
      bloodGroup: bloodgroup,
      specialType: specialbloodtype,
      UnderstandIndianLanguages: language,
      SpeakIndianLanguages: languagespeak,
      ReadWriteIndianLanguages: languagereadwrite,
    };

    await handleProfileUpdate(updatedData);
  };

  // Helper function to extract the first initial
  const getInitial = name => {
    if (!name) return "";
    const nameParts = name.split(" "); // Split the name into an array
    const firstInitial = nameParts[0].charAt(0).toUpperCase(); // First name initial
    const lastInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : ""; // Last name initial, if present
    return firstInitial + lastInitial;
  };

  //Main Return Structure
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header]}>
        <LinearGradient
          colors={["#01869e", "#3cb0c4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Icon name="arrow-back" color="#fff" size={22} />
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            alignSelf: "center",
            flex: 1,
            marginRight: 24,
          }}
        >
          <Pressable
            onPress={() => {
              setModalVisiblephoto(true);
              StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.5)");
            }}
          >
            {profileImageLoading ? (
              // ✅ Loading indicator while image is loading
              <View
                style={[
                  styles.avatar,
                  {
                    width: 80,
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                  },
                ]}
              >
                <ActivityIndicator size="small" color="#ffa6bb" />
              </View>
            ) : profile?.profileImage ? (
              <Avatar.Image
                source={{ uri: profile?.profileImage }}
                size={80}
                style={[styles.avatar]}
                onError={e => {
                  console.error("Failed to load profile image:", e.nativeEvent.error);
                  // Optionally, set a fallback image or update state to use initials
                }}
              />
            ) : (
              <Avatar.Text
                style={[styles.avatar]}
                label={getInitial(profile?.firstName)}
                size={80}
              />
            )}
            <View style={styles.imageIcon}>
              <Ionicons name="camera" size={20} color="black" />
            </View>
          </Pressable>

          <View style={styles.nameContainer}>
            {profile?.middleName ? (
              <Text style={styles.profileName}>
                {profile?.firstName} {profile?.middleName} {profile?.lastName}
              </Text>
            ) : (
              <Text style={styles.profileName}>
                {profile?.firstName} {profile?.lastName}
              </Text>
            )}
          </View>
          <Text style={styles.profileEmail}>{profile?.UDI_id}</Text>
        </View>

        {/* <View /> */}
        {/* Profile Photo Modal */}
        <Modal
          isVisible={isModalVisiblephoto}
          swipeDirection="down"
          onSwipeComplete={() => {
            setModalVisiblephoto(false);
            StatusBar.setBackgroundColor("transparent");
          }}
          transparent={true}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={500}
          animationOutTiming={500}
          useNativeDriver={false}
          avoidKeyboard={true}
          backdropOpacity={0.5}
          style={styles.modal}
        >
          <View style={[styles.modalView, { minHeight: 150 }]}>
            <View style={styles.handle} />
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisiblephoto(false);
                StatusBar.setBackgroundColor("transparent");
              }}
            >
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>

            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleGalleryLaunch()}>
                <Ionicons name="images" size={32} color={Color.headingColor} />
                <Text style={styles.modalButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={() => handleCameraLaunch()}>
                <Ionicons name="camera" size={32} color={Color.headingColor} />
                <Text style={styles.modalButtonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={removePhoto}>
                <Ionicons name="trash" size={32} color="red" />
                <Text style={[styles.modalButtonText, styles.removeText]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {loading ? (
        <View style={styles.loadingcontainer}>
          <ProfileSkeletonLoading />
        </View>
      ) : (
        <>
          {/* Main Scroll View  */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { marginBottom: isUpdated ? 70 : 10 }]}>
              {/* Name */}
              <View style={styles.sub}>
                {/* First Name */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>First Name</Text>
                  <TextInput
                    style={[styles.input]}
                    value={firstname}
                    onChangeText={text => setfirstname(text.replace(/[^a-zA-Z]/g, ""))}
                    editable={!loadingSubmit}
                    placeholder="First Name"
                    keyboardType="default"
                    placeholderTextColor={"gray"}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Middle Name</Text>
                  <TextInput
                    style={[styles.input]}
                    value={middlename}
                    onChangeText={text => setmiddlename(text.replace(/[^a-zA-Z]/g, ""))}
                    editable={!loadingSubmit}
                    placeholder="Middle Name"
                    keyboardType="default"
                    placeholderTextColor={"gray"}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Last Name</Text>
                  <TextInput
                    style={[styles.input]}
                    value={lastname}
                    onChangeText={text => setlastname(text.replace(/[^a-zA-Z]/g, ""))}
                    editable={!loadingSubmit}
                    placeholder="Last Name"
                    keyboardType="default"
                    placeholderTextColor={"gray"}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Gender */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Gender</Text>
                  <Pressable
                    style={styles.input}
                    onPress={() => handleModal("gender")}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !valuegender && { color: "gray" }]}>
                      {valuegender ? valuegender : "Gender"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Dob */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Date of Birth</Text>

                  <Pressable
                    style={styles.input}
                    onPress={() => setShow(true)}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !profile?.dateOfBirth && { color: "gray" }]}>
                      {date instanceof Date && !isNaN(date)
                        ? date?.toLocaleDateString("en-GB")
                        : "yyyy-mm-dd"}
                    </Text>
                  </Pressable>
                </View>
              </View>
              {/* Place of Birth */}
              <View style={styles.sub}>
                {/* Place */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Place of Birth</Text>

                  <TextInput
                    style={[styles.input]}
                    value={place_of_birth}
                    onChangeText={place_of_birth => setplace_of_birth(place_of_birth)}
                    editable={!loadingSubmit}
                    placeholder="Place of Birth"
                    keyboardType="default"
                    placeholderTextColor={"gray"}
                  />
                </View>

                {/* Pincode */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Pincode</Text>

                  <TextInput
                    style={[styles.input]}
                    value={pin}
                    onChangeText={handlePincodeChange}
                    editable={!loadingSubmit}
                    placeholder="Pincode"
                    keyboardType="numeric"
                    placeholderTextColor={"gray"}
                    maxLength={6}
                  />
                </View>
                {/* State */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>State</Text>
                  <Text style={[styles.buttonText2, !state && { color: "gray" }]}>
                    {state ? state : "State"}
                  </Text>
                </View>

                {/* District */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>District</Text>
                  <Text style={[styles.buttonText2, !selecteddistrict && { color: "gray" }]}>
                    {selecteddistrict ? selecteddistrict : "District"}
                  </Text>
                </View>
              </View>
              {/* Marital Status */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Marital Status</Text>
                  <Pressable
                    style={styles.input}
                    onPress={() => handleModal("marry")}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !valueMarry && { color: "gray" }]}>
                      {valueMarry ? valueMarry : "Marital Status"}
                    </Text>
                  </Pressable>
                </View>
              </View>
              {/* Blood Group */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>Blood Group</Text>
                  <Pressable
                    style={[styles.openModalButton]}
                    onPress={() => {
                      handleModal("bloodgroup");
                    }}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !bloodgroup && { color: "gray" }]}>
                      {bloodgroup ? bloodgroup : "Blood Group"}
                    </Text>
                  </Pressable>
                </View>
                {/* Place of Birth */}
                {bloodgroup === "Other" && (
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldtTitle}>Special Type</Text>
                    <TextInput
                      style={[styles.input]}
                      value={specialbloodtype}
                      onChangeText={specialbloodtype => setspecialbloodtype(specialbloodtype)}
                      editable={true}
                      placeholder="Mention(Optional)"
                      keyboardType="default"
                      placeholderTextColor={"gray"}
                    />
                  </View>
                )}
              </View>
              {/* Languages */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>Indian Languages (Understand)</Text>
                  <Pressable
                    style={[styles.openModalButton]}
                    onPress={() => {
                      handleModal("language(u)");
                    }}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, language?.length === 0 && { color: "gray" }]}>
                      {language?.length > 0 ? language.join(", ") : "Languages (Understand)"}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>Indian Languages (Speak)</Text>
                  <Pressable
                    style={[styles.openModalButton]}
                    onPress={() => {
                      handleModal("language(s)");
                    }}
                    disabled={loadingSubmit}
                  >
                    <Text
                      style={[styles.buttonText, languagespeak?.length === 0 && { color: "gray" }]}
                    >
                      {languagespeak?.length > 0 ? languagespeak.join(", ") : "Languages (Speak)"}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>Indian Languages (Read/Write)</Text>
                  <Pressable
                    style={[styles.openModalButton]}
                    onPress={() => {
                      handleModal("language(rw)");
                    }}
                    disabled={loadingSubmit}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        languagereadwrite?.length === 0 && { color: "gray" },
                      ]}
                    >
                      {languagereadwrite?.length > 0
                        ? languagereadwrite.join(", ")
                        : "Languages (Read/Write)"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Conditionally render the DateTimePicker */}
              {show && (
                <DateTimePicker
                  value={date}
                  mode={mode}
                  display="default"
                  onChange={onChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>
            {/* Modal */}
            <Modal
              isVisible={isModalVisible}
              swipeDirection="down"
              transparent={true}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              onSwipeComplete={() => setModalVisible(false)}
              animationInTiming={500}
              animationOutTiming={500}
              useNativeDriver={false}
              avoidKeyboard={true}
              backdropOpacity={0.5}
              onModalHide={handleModalHide}
              style={styles.modal}
            >
              {tempAnswer === "language(rw)" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={[styles.modalTitle, { marginBottom: 2, width: "100%" }]}>
                        Indian Languages (Read/Write)
                      </Text>
                      <Pressable onPress={() => setlanguagerwmore(!languagerw)}>
                        <Text
                          style={[
                            styles.modalTitle,
                            {
                              minWidth: "100%",
                              maxWidth: "100%",
                              textAlign: "center",
                              alignSelf: "center",
                              fontWeight: "regular",
                            },
                          ]}
                          numberOfLines={languagerw ? undefined : 1}
                          ellipsizeMode="tail"
                        >
                          {languagerw
                            ? tempLanguage.join(", ")
                            : tempLanguage.length >= 5
                              ? `${tempLanguage.slice(0, 4).join(", ")} ... more`
                              : tempLanguage.join(", ")}
                        </Text>
                      </Pressable>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeicon}
                    >
                      <Ionicons name="close-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <SectionList
                    sections={sections}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => toggleSelectionlanguagetemp(item)}
                        style={[
                          styles.item2,
                          tempLanguage.includes(item.label) && styles.selectedItem,
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            tempLanguage === item.label && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                  />
                  <Pressable style={styles.submitButton} onPress={handleCloseModallanguagerw}>
                    <Text style={styles.submitButtonText}>
                      {language === "English"
                        ? "Confirm"
                        : language === "বাংলা"
                          ? "নিশ্চিত করুন" // Bengali
                          : language === "हिन्दी"
                            ? "पुष्टि करें" // Hindi
                            : language === "অসমীয়া"
                              ? "নিশ্চিত কৰক" // Assamese
                              : "Confirm"}
                    </Text>
                  </Pressable>
                </View>
              )}
              {tempAnswer === "language(s)" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={[styles.modalTitle, { marginBottom: 2, width: "100%" }]}>
                        Indian Languages (Speak)
                      </Text>
                      <Pressable onPress={() => setlanguagespeakmore(!languagespeakmore)}>
                        <Text
                          style={[
                            styles.modalTitle,
                            {
                              minWidth: "100%",
                              maxWidth: "100%",
                              textAlign: "center",
                              alignSelf: "center",
                              fontWeight: "regular",
                            },
                          ]}
                          numberOfLines={languagespeakmore ? undefined : 1}
                          ellipsizeMode="tail"
                        >
                          {languagespeakmore
                            ? tempLanguage.join(", ")
                            : tempLanguage.length >= 5
                              ? `${tempLanguage.slice(0, 4).join(", ")} ... more`
                              : tempLanguage.join(", ")}
                        </Text>
                      </Pressable>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeicon}
                    >
                      <Ionicons name="close-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <SectionList
                    sections={sections}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => toggleSelectionlanguagetemp(item)}
                        style={[
                          styles.item2,
                          tempLanguage.includes(item.label) && styles.selectedItem,
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            tempLanguage === item.label && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                  />
                  <Pressable style={styles.submitButton} onPress={handleCloseModallanguagespeak}>
                    <Text style={styles.submitButtonText}>
                      {language === "English"
                        ? "Confirm"
                        : language === "বাংলা"
                          ? "নিশ্চিত করুন" // Bengali
                          : language === "हिन्दी"
                            ? "पुष्टि करें" // Hindi
                            : language === "অসমীয়া"
                              ? "নিশ্চিত কৰক" // Assamese
                              : "Confirm"}
                    </Text>
                  </Pressable>
                </View>
              )}
              {tempAnswer === "language(u)" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={[styles.modalTitle, { marginBottom: 2, width: "100%" }]}>
                        Indian Languages (Understand)
                      </Text>
                      <Pressable onPress={() => setlanguageunderstandmore(!languageunderstandmore)}>
                        <Text
                          style={[
                            styles.modalTitle,
                            {
                              minWidth: "100%",
                              maxWidth: "100%",
                              textAlign: "center",
                              alignSelf: "center",
                              fontWeight: "regular",
                            },
                          ]}
                          numberOfLines={languageunderstandmore ? undefined : 1}
                          ellipsizeMode="tail"
                        >
                          {languageunderstandmore
                            ? tempLanguage.join(", ")
                            : tempLanguage.length >= 5
                              ? `${tempLanguage.slice(0, 4).join(", ")} ... more`
                              : tempLanguage.join(", ")}
                        </Text>
                      </Pressable>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeicon}
                    >
                      <Ionicons name="close-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <SectionList
                    sections={sections}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => toggleSelectionlanguagetemp(item)}
                        style={[
                          styles.item2,
                          tempLanguage.includes(item.label) && styles.selectedItem,
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            tempLanguage === item.label && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                  />
                  <Pressable
                    style={styles.submitButton}
                    onPress={handleCloseModallanguageunderstand}
                  >
                    <Text style={styles.submitButtonText}>
                      {language === "English"
                        ? "Confirm"
                        : language === "বাংলা"
                          ? "নিশ্চিত করুন" // Bengali
                          : language === "हिन्दी"
                            ? "पुष्टि करें" // Hindi
                            : language === "অসমীয়া"
                              ? "নিশ্চিত কৰক" // Assamese
                              : "Confirm"}
                    </Text>
                  </Pressable>
                </View>
              )}
              {tempAnswer === "bloodgroup" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <Text style={styles.modalTitle}>
                      Blood Group{" "}
                      <Text style={[styles.modalTitle, { fontWeight: "regular" }]}>
                        {bloodgroup ? `- ${bloodgroup}` : ""}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeicon}
                    >
                      <Ionicons name="close-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={modalitemsbloodgroup}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => toggleSelectionbloodgroup(item)} // Automatically select and close
                        style={[styles.item, bloodgroup === item.label && styles.selectedItem]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            bloodgroup === item.label && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              {tempAnswer === "gender" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <Text style={styles.modalTitle}>
                      Gender{" "}
                      <Text style={[styles.modalTitle, { fontWeight: "regular" }]}>
                        {valuegender ? `- ${valuegender}` : ""}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeicon}
                    >
                      <Ionicons name="close-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={modalitemsgender}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => toggleSelectiongender(item)} // Automatically select and close
                        style={[styles.item, valuegender === item.label && styles.selectedItem]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            valuegender === item.label && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              {tempAnswer === "marry" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <Text style={styles.modalTitle}>
                      Marital Status{" "}
                      <Text style={[styles.modalTitle, { fontWeight: "regular" }]}>
                        {valueMarry ? `- ${valueMarry}` : ""}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeicon}
                    >
                      <Ionicons name="close-outline" size={25} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={modalitemsmarry}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => toggleSelectionmarry(item)} // Automatically select and close
                        style={[styles.item, valueMarry === item.label && styles.selectedItem]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            valueMarry === item.label && styles.selectedItemText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </Modal>
          </ScrollView>
        </>
      )}
      {/* Update Button */}
      {changedFields.length > 0 && (
        <TouchableOpacity
          style={styles.floatingUpdateButton}
          onPress={handleUpdate}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ActivityIndicator size="small" color={Color.colorWhite} />
          ) : (
            <Ionicons name="checkmark" size={24} color="white" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bcBackground,
  },
  skeletonContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
  skeletonFieldTitle: {
    height: 14,
    width: "40%",
    backgroundColor: "#E1E9EE",
    borderRadius: 5,
    marginBottom: 8,
  },
  skeletonInput: {
    height: 48,
    width: "100%",
    backgroundColor: "#E1E9EE",
    borderRadius: 12,
  },
  loadingcontainer: {
    flex: 1,
    backgroundColor: Color.bcBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingUpdateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Color.headingColor,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    paddingTop: "12%",
    paddingHorizontal: 20,
    flexDirection: "row",
    height: height * 0.25,
    overflow: "hidden",
    position: "relative",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileName: {
    fontSize: 18,
    fontFamily: FontFamily.Inter_Bold,
    color: "#333",
    marginTop: 8,
  },
  profileId: {
    fontSize: 14,
    color: "#555",
    fontFamily: FontFamily.Inter_Regular,
  },
  profileEmail: {
    fontSize: 14,
    color: "#555",
    fontFamily: FontFamily.Inter_Regular,
    marginTop: 3,
  },
  avatar: {
    backgroundColor: Color.colorWhite,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    // borderWidth: 3,
    borderColor: Color.colorWhite,
  },
  imageIcon: {
    backgroundColor: Color.colorWhite,
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    // borderColor: "#f0f0f0",
    borderColor: Color.headingColor,
  },
  section: {
    marginVertical: 10,
    borderRadius: 15,
  },
  sub: {
    marginVertical: 8,
    padding: 14,
    backgroundColor: Color.colorWhite,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Color.colorWhite,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    width: "100%",
    fontFamily: FontFamily.Inter_Regular,
    fontSize: 15,
  },
  openModalButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Color.colorWhite,
    width: "100%",
    fontFamily: FontFamily.Inter_Regular,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  fieldtTitle: {
    marginBottom: 6,
    fontSize: 13,
    fontFamily: FontFamily.Inter_Medium,
    color: "#666",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 15,
    color: "#333",
    fontFamily: FontFamily.Inter_Regular,
  },
  buttonText2: {
    fontSize: 15,
    color: "#333",
    fontFamily: FontFamily.Inter_Regular,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Color.colorWhite,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  modalContentspecialization: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    height: height * 0.5,
  },
  modalContent: {
    width: "90%",
    borderRadius: 15,
    padding: 0,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    width: "90%",
    color: "#333",
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 5,
  },
  item2: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 5,
    paddingLeft: 20,
  },
  selectedItem: {
    backgroundColor: Color.headerBg,
    borderRadius: 12,
    borderColor: Color.headingColor,
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    fontFamily: FontFamily.Inter_Regular,
  },
  selectedItemText: {
    fontWeight: "bold",
    color: Color.headingColor,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    width: "30%",
  },
  modalButtonText: {
    fontSize: 14,
    marginTop: 10,
    color: "#333",
    textAlign: "center",
    fontFamily: FontFamily.Inter_Medium,
  },
  removeText: {
    color: "red",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    backgroundColor: Color.bcBackground,
    paddingHorizontal: 15,
    flex: 1,
  },
  //Mandetory mark
  fieldWrapper: {
    marginVertical: 6,
    borderRadius: 12,
  },
  mandatoryAsterisk: {
    color: Color.bcHighlight,
    marginLeft: 2,
    position: "absolute",
    right: 0,
    top: 8,
    fontSize: 12,
    zIndex: 2,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    overflow: "hidden",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    maxHeight: height * 0.5,
    minHeight: 200,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalCloseButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  closeicon: {
    position: "absolute",
    right: 0,
    top: -10,
  },
  submitButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: Color.headingColor,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: FontFamily.Inter_SemiBold,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: FontFamily.Inter_Bold,
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    color: "#444",
  },
  backButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
