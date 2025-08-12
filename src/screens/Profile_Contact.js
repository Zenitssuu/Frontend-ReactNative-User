import React, { useEffect } from "react";
import { useState } from "react";
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
  ToastAndroid,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color, FontFamily } from "../constants/GlobalStyles";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/UIComponents";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Redux/Slices/UserSlice";
import apiService from "../services/api";
import { handleApiMutation } from "../services/apiUtils";

const { height, width } = Dimensions.get("window");

export default function Profile_Contact({ navigation, route }) {
  const { profile } = useSelector(state => state.user);
  const [data, setData] = useState({
    email: "",
    phonenumber: profile?.phoneNumber ? profile?.phoneNumber : "7859458245",
    altphonenumber: profile?.contactDetails?.alternatePhoneNumber
      ? profile?.contactDetails?.alternatePhoneNumber
      : "7859458592",
    whatsappnum: profile?.contactDetails?.whatsappNumber
      ? profile?.contactDetails?.whatsappNumber
      : "7859458592",
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingContactOTP, setLoadingContactOTP] = useState(false);
  const [loadingEmailOTP, setLoadingEmailOTP] = useState(false);
  const [loadingResendOTP, setLoadingResendOTP] = useState(false);

  const [phonenumber, setphonenumber] = useState(data.phonenumber);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [tempphonenumber, settempphonenumber] = useState("");
  const [altphonenumber, setaltphonenumber] = useState(
    data.altphonenumber ? data.altphonenumber : ""
  );
  const [Whatsappnumber, setWhatsappnumber] = useState(data.whatsappnum ? data.whatsappnum : "");
  const [email, setemail] = useState(data.email);
  const [Person1name, setPerson1name] = useState("");
  const [Person1relation, setPerson1relation] = useState("");
  const [Person1phonenumber, setPerson1phonenumber] = useState("");
  const [Person1email, setPerson1email] = useState("");
  const [Person2name, setPerson2name] = useState("");
  const [Person2relation, setPerson2relation] = useState("");
  const [Person2phonenumber, setPerson2phonenumber] = useState("");
  const [Person2email, setPerson2email] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [tempAnswer, setTempAnswer] = useState(null);
  const [loadingText, setLoadingText] = useState("...");

  const [modalitemsrelation] = useState([
    { id: "1", label: "Father" },
    { id: "2", label: "Mother" },
    { id: "3", label: "Son" },
    { id: "4", label: "Daughter" },
    { id: "5", label: "Brother" },
    { id: "6", label: "Sister" },
    { id: "7", label: "Grandfather" },
    { id: "8", label: "Grandmother" },
    { id: "9", label: "Uncle" },
    { id: "10", label: "Aunt" },
    { id: "11", label: "Nephew" },
    { id: "12", label: "Niece" },
    { id: "13", label: "Cousin" },
    { id: "14", label: "Husband" },
    { id: "15", label: "Wife" },
    { id: "16", label: "Father-in-law" },
    { id: "17", label: "Mother-in-law" },
    { id: "18", label: "Son-in-law" },
    { id: "19", label: "Daughter-in-law" },
    { id: "20", label: "Brother-in-law" },
    { id: "21", label: "Sister-in-law" },
    { id: "22", label: "Friend" },
    { id: "23", label: "Guardian" },
    { id: "24", label: "Other" },
  ]);

  //   Track Changes
  const [isUpdated, setIsUpdated] = useState(false);
  const toggleSelectionrelation1 = item => {
    setPerson1relation(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };
  const toggleSelectionrelation2 = item => {
    setPerson2relation(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Automatically focus on the next input if available and input is not empty
    if (text && index < otp.length - 1) {
      const nextInput = `input${index + 1}`;
      refs[nextInput].focus();

      // inputRefs.current[index + 1].focus();
    }
  };
  const refs = {};
  // Function to handle backspace deletion
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        const previousInput = `input${index - 1}`;
        refs[previousInput].focus();

        // inputRefs.current[index - 1].focus();
      }
    }
  };
  // Function to handle resend OTP
  const handleResendOTP = async tempAnswer => {
    setLoadingResendOTP(true);
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    await ResendOTP(tempAnswer, tempphonenumber); // Resend the OTP with phone/email
    setLoadingResendOTP(false);
  };

  // Function to handle email OTP verification
  const handleVerifyEmailOTP = async () => {
    // Check if OTP is complete
    if (!otp.every(digit => digit !== "")) {
      Alert.alert("Incomplete OTP", "Please enter all 6 digits of the OTP");
      return;
    }

    try {
      // Show loading indicator
      setLoadingSubmit(true);

      // Combine OTP digits into a single string
      const otpString = otp.join("");

      // TODO: Uncomment when API is ready

      const data = {
        email: tempEmailAddress,
        otp: otpString,
      };

      // Call the API to verify email OTP
      const response = await apiService.profile.verifyUpdateOTP(data);

      // Handle successful verification
      if (response && (response.status === 200 || response.data?.success)) {
        setemail(tempEmailAddress);
        resetEditingStates();
        ToastAndroid.show("Email updated successfully!", ToastAndroid.SHORT);
        setModalVisible(false);
        setOtp(["", "", "", "", "", ""]);
        settempphonenumber("");

        // await dispatch(fetchProfile());
      } else {
        Alert.alert(
          "Verification Failed",
          response?.data?.message || "Invalid OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Email verification error:", error);
      Alert.alert(
        "Verification Error",
        error.response?.data?.message || "Failed to verify email. Please try again."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  // handle function for Modal
  const handleModal = value => {
    setTempAnswer(value);
    setModalVisible(true);
  };
  const handleModalHide = () => {
    setTempAnswer(null);
    resetEditingStates(); // Reset editing states when modal closes
  };

  const [changedFields, setChangedFields] = useState([]);
  useEffect(() => {
    let changes = [];

    // Only track specific fields for save button visibility:
    // 1. Alternate number
    // 2. WhatsApp number
    // 3. Emergency Contact 1 details
    // 4. Emergency Contact 2 details

    if (Person1name !== profile?.contactDetails?.emergencyContact?.[0]?.name)
      changes.push("Person 1 Name");
    if (Person1relation !== profile?.contactDetails?.emergencyContact?.[0]?.relation)
      changes.push("Person 1 Relation");
    if (Person1phonenumber !== profile?.contactDetails?.emergencyContact?.[0]?.phoneNumber)
      changes.push("Person 1 Phone Number");
    if (Person1email !== profile?.contactDetails?.emergencyContact?.[0]?.email)
      changes.push("Person 1 Email");
    if (Person2name !== profile?.contactDetails?.emergencyContact?.[1]?.name)
      changes.push("Person 2 Name");
    if (Person2relation !== profile?.contactDetails?.emergencyContact?.[1]?.relation)
      changes.push("Person 2 Relation");
    if (Person2phonenumber !== profile?.contactDetails?.emergencyContact?.[1]?.phoneNumber)
      changes.push("Person 2 Phone Number");
    if (Person2email !== profile?.contactDetails?.emergencyContact?.[1]?.email)
      changes.push("Person 2 Email");
    if (Whatsappnumber !== profile?.contactDetails?.whatsappNumber) changes.push("WhatsApp Number");
    if (altphonenumber !== profile?.contactDetails?.alternatePhoneNumber)
      changes.push("Alternate Phone Number");

    setChangedFields(changes);
    setIsUpdated(changes.length > 0);
  }, [
    Person1name,
    Person1relation,
    Person1phonenumber,
    Person1email,
    Person2name,
    Person2relation,
    Person2phonenumber,
    Person2email,
    Whatsappnumber,
    altphonenumber,
  ]);
  // State for contact and email editing
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [tempContactNumber, setTempContactNumber] = useState("");
  const [tempEmailAddress, setTempEmailAddress] = useState("");

  // Fetch Data
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (!profile) {
  //         // dispatch(fetchProfile());
  //       }
  //     };

  //     fetchData();
  //   }, [dispatch]);

  // **New Effect to Sync Data After `setData`**
  useEffect(() => {
    if (profile) {
      // console.log(
      //   "Profile data fetched:",
      //   JSON.stringify(profile.data, null, 2)
      // );

      // Contact number and email - preserve existing values if new ones are empty
      const newPhoneNumber = profile?.phoneNumber?.replace(/^\+91/, "") || "";
      const newEmail = profile?.email || "";

      // Only update if we have new data or if current state is empty
      if (newPhoneNumber || !phonenumber) {
        setphonenumber(newPhoneNumber);
      }
      if (newEmail || !email) {
        setemail(newEmail);
      }

      //Alternate Number and Whatsapp Number
      setaltphonenumber(profile?.contactDetails?.alternatePhoneNumber || "");
      setWhatsappnumber(profile?.contactDetails?.whatsappNumber || "");

      // Emergency Contacts
      setPerson1name(profile?.contactDetails?.emergencyContact?.[0]?.name || "");
      setPerson1relation(profile?.contactDetails?.emergencyContact?.[0]?.relation || "");
      setPerson1phonenumber(profile?.contactDetails?.emergencyContact?.[0]?.phoneNumber || "");
      setPerson1email(profile?.contactDetails?.emergencyContact?.[0]?.email || "");
      setPerson2name(profile?.contactDetails?.emergencyContact?.[1]?.name || "");
      setPerson2relation(profile?.contactDetails?.emergencyContact?.[1]?.relation || "");
      setPerson2phonenumber(profile?.contactDetails?.emergencyContact?.[1]?.phoneNumber || "");
      setPerson2email(profile?.contactDetails?.emergencyContact?.[1]?.email || "");
    }
  }, [profile]); // Only run when `data` is updated

  // Use the new API service to update the profile address
  const handleContactUpdate = async contactData => {
    try {
      setLoadingSubmit(true);

      // Use the API mutation helper with better error handling
      await handleApiMutation(apiService.profile.updateProfile, {
        args: [contactData],
        successMessage: "Contact updated successfully",
        onSuccess: data => {
          // Still dispatch Redux action for compatibility
          dispatch(updateProfile(contactData));
          setIsUpdated(false);
          setChangedFields([]);
        },
      });
    } catch (error) {
      Alert.alert("Update Failed", "Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async () => {
    // Validate phone numbers before submitting
    if (Whatsappnumber && Whatsappnumber.length !== 10) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid WhatsApp number format",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      return;
    }

    // Validate phone numbers before submitting
    if (altphonenumber && altphonenumber.length !== 10) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid alternate phone number format",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      return;
    }
    // Validate phone numbers before submitting
    if (Person1phonenumber && Person1phonenumber.length !== 10) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid Contact(Person 1) phone number format",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      return;
    }
    // Validate phone numbers before submitting
    if (Person2phonenumber && Person2phonenumber.length !== 10) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid Contact(Person 2) phone number format",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      return;
    }

    // Validate emails before submitting
    if (Person1email && !isValidEmail(Person1email)) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid email format for Person 1",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      return;
    }

    if (Person2email && !isValidEmail(Person2email)) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid email format for Person 2",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        100
      );
      return;
    }

    const updatedData = {
      // Include primary contact info to preserve them during update
      phoneNumber: phonenumber ? `+91${phonenumber}` : undefined,
      email: email || undefined,
      contactDetails: {
        alternatePhoneNumber: altphonenumber,
        whatsappNumber: Whatsappnumber,
        emergencyContact: [
          {
            name: Person1name,
            relation: Person1relation,
            phoneNumber: Person1phonenumber,
            email: Person1email,
          },
          {
            name: Person2name,
            relation: Person2relation,
            phoneNumber: Person2phonenumber,
            email: Person2email,
          },
        ],
      },
    };

    await handleContactUpdate(updatedData);
  };

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  // Skeleton Loading Component
  const ContactSkeletonLoading = () => {
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

    const renderSkeletonEmergencyContact = () => (
      <View style={{ marginTop: 10 }}>
        <Animated.View style={[styles.skeletonSectionTitle, { opacity: fadeAnim }]} />
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
        {renderSkeletonField()}
      </View>
    );

    return (
      <View style={styles.skeletonContainer}>
        {/* Contact Details */}
        <View style={styles.sub}>
          {renderSkeletonField()}
          {renderSkeletonField()}
          {renderSkeletonField()}
          {renderSkeletonField()}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sub}>
          {renderSkeletonEmergencyContact()}
          {renderSkeletonEmergencyContact()}
        </View>
      </View>
    );
  };
  // Function to handle contact number changes
  const handleContactNumberAction = async () => {
    if (!phonenumber) {
      // No data exists - directly send OTP for new number
      if (tempContactNumber && tempContactNumber.length === 10) {
        try {
          setLoadingContactOTP(true);
          settempphonenumber(tempContactNumber);

          const response = await apiService.profile.sendContactNumberOTP({
            phoneNumber: tempContactNumber,
          });

          if (response && response.status === 200) {
            ToastAndroid.show("OTP sent to your mobile number successfully", ToastAndroid.SHORT);

            setTempAnswer("mobileotp");
            setModalVisible(true);
          } else {
            ToastAndroid.show("Failed to send OTP. Please try again.", ToastAndroid.SHORT);
            console.error("Error sending OTP (error in try block):", response.data.message);
          }
        } catch (error) {
          if (error.data.error === "This is already your current phone number") {
            // Already your current phone number
            ToastAndroid.show("This is already your current phone number", ToastAndroid.SHORT);
          } else if (
            error.data.error === "This phone number is already associated with another account"
          ) {
            // Phone number already associated with another account
            ToastAndroid.show(
              "This phone number is already associated with another account",
              ToastAndroid.SHORT
            );
          } else {
            console.error("Error sending OTP:", error.data);
          }
        } finally {
          setLoadingContactOTP(false);
        }
      } else {
        ToastAndroid.show("Please enter a valid 10-digit phone number", ToastAndroid.SHORT);
      }
    } else {
      // Data exists - show Change functionality
      if (isContactEditing) {
        // Currently editing - send OTP
        if (tempContactNumber && tempContactNumber.length === 10) {
          try {
            setLoadingContactOTP(true);
            settempphonenumber(tempContactNumber);

            const response = await apiService.profile.sendContactNumberOTP({
              phoneNumber: tempContactNumber,
            });

            if (response && response.status === 200) {
              ToastAndroid.show("OTP sent to your mobile number successfully", ToastAndroid.SHORT);

              setTempAnswer("mobileotp");
              setModalVisible(true);
            } else {
              ToastAndroid.show("Failed to send OTP. Please try again.", ToastAndroid.SHORT);
              console.error("Error sending OTP (error in try block):", response.data.message);
            }
          } catch (error) {
            if (error.data.error === "This is already your current phone number") {
              // Already your current phone number
              ToastAndroid.show("This is already your current phone number", ToastAndroid.SHORT);
            } else if (
              error.data.error === "This phone number is already associated with another account"
            ) {
              // Phone number already associated with another account
              ToastAndroid.show(
                "This phone number is already associated with another account",
                ToastAndroid.SHORT
              );
            } else {
              console.error("Error sending OTP:", error.data);
            }
          } finally {
            setLoadingContactOTP(false);
          }
        } else {
          ToastAndroid.show("Please enter a valid 10-digit phone number", ToastAndroid.SHORT);
        }
      } else {
        // Start editing - clear input and enable editing
        setIsContactEditing(true);
        setTempContactNumber(""); // Provide clean input
      }
    }
  };

  // Function to handle email changes
  const handleEmailAction = async () => {
    if (!email) {
      // No data exists - directly send OTP for new email
      if (tempEmailAddress && isValidEmail(tempEmailAddress)) {
        try {
          setLoadingEmailOTP(true);

          try {
            const response = await apiService.profile.sendEmailOTP({
              email: tempEmailAddress,
            });

            if (response && response.status === 200) {
              ToastAndroid.show("OTP sent to your email", ToastAndroid.SHORT);
              settempphonenumber(tempEmailAddress);
              setTempAnswer("emailotp");
              setModalVisible(true);
              return true;
            } else {
              throw new Error(response?.data?.message || "Failed to send OTP");
            }
          } catch (error) {
            console.error("Add email error:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error sending email OTP:", error);
          ToastAndroid.show("Failed to send OTP. Please try again.", ToastAndroid.SHORT);
        } finally {
          setLoadingEmailOTP(false);
        }
      } else {
        ToastAndroid.show("Please enter a valid email address", ToastAndroid.SHORT);
      }
    } else {
      // Data exists - show Change functionality
      if (isEmailEditing) {
        // Currently editing - send OTP
        if (tempEmailAddress && isValidEmail(tempEmailAddress)) {
          try {
            setLoadingEmailOTP(true);

            try {
              const response = await apiService.profile.sendEmailOTP({
                email: tempEmailAddress,
              });

              if (response && response.status === 200) {
                ToastAndroid.show("OTP sent to your email", ToastAndroid.SHORT);
                settempphonenumber(tempEmailAddress);
                setTempAnswer("emailotp");
                setModalVisible(true);
                return true;
              } else {
                throw new Error(response?.data?.message || "Failed to send OTP");
              }
            } catch (error) {
              console.error("Add email error:", error);
              throw error;
            }
          } catch (error) {
            console.error("Error sending email OTP:", error);
            ToastAndroid.show("Failed to send OTP. Please try again.", ToastAndroid.SHORT);
          } finally {
            setLoadingEmailOTP(false);
          }
        } else {
          ToastAndroid.show("Please enter a valid email address", ToastAndroid.SHORT);
        }
      } else {
        // Start editing - clear input and enable editing
        setIsEmailEditing(true);
        setTempEmailAddress(""); // Provide clean input
      }
    }
  };

  // Function to reset editing states
  const resetEditingStates = () => {
    setIsContactEditing(false);
    setIsEmailEditing(false);
    setTempContactNumber("");
    setTempEmailAddress("");
  };

  // Function to handle successful OTP verification for contact
  const handleContactOTPSuccess = () => {
    setphonenumber(tempphonenumber);
    resetEditingStates();
    ToastAndroid.show("Contact number updated successfully!", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Contact" onBackPress={() => navigation.goBack()} rightComponent={null} />

      {/* Main content with loading */}
      {loading ? (
        <View style={styles.loadingcontainer}>
          <ContactSkeletonLoading />
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { marginBottom: isUpdated ? 50 : 0 }]}>
              {/* Contact details Section */}
              <View style={styles.sub}>
                {/* Upper Half - Contact Number & Email */}
                <View style={styles.upperHalf}>
                  {/* Phone Number */}
                  <View style={styles.fieldWrapper}>
                    <Text style={[styles.fieldtTitle]}>Contact Number</Text>
                    <View style={styles.inputButtonRow}>
                      <TextInput
                        editable={!phonenumber || isContactEditing} // Disable when data exists and not editing
                        style={[
                          styles.input,
                          styles.inputFieldSeparate,
                          !(!phonenumber || isContactEditing) && styles.disabledInput, // Add disabled styling
                        ]}
                        value={
                          !phonenumber
                            ? tempContactNumber
                            : isContactEditing
                              ? tempContactNumber
                              : phonenumber
                        }
                        onChangeText={text => {
                          const sanitizedText = text.replace(/[^0-9]/g, "");
                          if (!phonenumber || isContactEditing) {
                            setTempContactNumber(sanitizedText);
                          } else {
                            setphonenumber(sanitizedText);
                          }
                        }}
                        keyboardType="numeric"
                        placeholder={
                          !phonenumber || isContactEditing
                            ? "Enter 10-digit contact number"
                            : "Contact Number"
                        }
                        maxLength={10}
                        placeholderTextColor={"#ccc"}
                      />
                      <Pressable
                        onPress={handleContactNumberAction}
                        style={styles.separateButton}
                        disabled={loadingContactOTP}
                      >
                        {loadingContactOTP ? (
                          <ActivityIndicator size="small" color={Color.colorWhite} />
                        ) : (
                          <Text style={styles.changeButtonText}>
                            {!phonenumber ? "Send OTP" : isContactEditing ? "Send OTP" : "Change"}
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.fieldWrapper}>
                    <Text style={[styles.fieldtTitle]}>Email</Text>
                    <View style={styles.inputButtonRow}>
                      <TextInput
                        editable={!email || isEmailEditing} // Disable when data exists and not editing
                        style={[
                          styles.input,
                          styles.inputFieldSeparate,
                          !(!email || isEmailEditing) && styles.disabledInput, // Add disabled styling
                        ]}
                        value={
                          !email ? tempEmailAddress : isEmailEditing ? tempEmailAddress : email
                        }
                        onChangeText={text => {
                          if (!email || isEmailEditing) {
                            setTempEmailAddress(text);
                          } else {
                            setemail(text);
                          }
                        }}
                        keyboardType="email-address"
                        placeholder={
                          !email || isEmailEditing ? "Enter your email address" : "Email"
                        }
                        placeholderTextColor={"#ccc"}
                      />
                      <Pressable
                        onPress={handleEmailAction}
                        style={styles.separateButton}
                        disabled={loadingEmailOTP}
                      >
                        {loadingEmailOTP ? (
                          <ActivityIndicator size="small" color={Color.colorWhite} />
                        ) : (
                          <Text style={styles.changeButtonText}>
                            {!email ? "Send OTP" : isEmailEditing ? "Send OTP" : "Change"}
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Divider Line */}
                <View style={styles.dividerLine} />

                {/* Lower Half - Alternate Number & WhatsApp Number */}
                <View style={styles.lowerHalf}>
                  {/* Alternate Phone Number */}
                  <View style={styles.fieldWrapper}>
                    <Text style={[styles.fieldtTitle]}>Alternate Number</Text>
                    <TextInput
                      editable={true}
                      style={[styles.input]}
                      value={altphonenumber}
                      onChangeText={text => setaltphonenumber(text.replace(/[^0-9]/g, ""))}
                      keyboardType="numeric"
                      placeholder="Alternate Number"
                      placeholderTextColor={"#ccc"}
                      maxLength={10}
                    />
                  </View>

                  {/* Whatsapp Number */}
                  <View style={styles.fieldWrapper}>
                    <Text style={[styles.fieldtTitle]}>Whatsapp Number</Text>
                    <TextInput
                      editable={true}
                      style={[styles.input]}
                      value={Whatsappnumber}
                      onChangeText={text => setWhatsappnumber(text.replace(/[^0-9]/g, ""))}
                      keyboardType="numeric"
                      placeholder="Whatsapp Number"
                      maxLength={10}
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>
              </View>

              {/* Emergency Contacts Section */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>
                    Emergency Contact( Person 1 ) <Text style={styles.mandatoryAsterisk}> *</Text>
                  </Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      editable={!loadingSubmit}
                      style={[styles.input, styles.flexInput]}
                      value={Person1name}
                      onChangeText={name => {
                        // Use preventConsecutiveSpaces and only allow letters, numbers, and single spaces
                        const sanitizedText = preventConsecutiveSpaces(name);
                        setPerson1name(sanitizedText);
                      }}
                      keyboardType="default"
                      placeholder={"Name"}
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>
                {/* Relation */}
                <View style={styles.fieldWrapper}>
                  {/* <Text style={[styles.fieldtTitle]}>Relation</Text> */}
                  <Pressable
                    style={[styles.openModalButton]}
                    onPress={() => {
                      handleModal("relation(p1)");
                    }}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !Person1relation && { color: "#ccc" }]}>
                      {loading ? loadingText : Person1relation || "Relation"}
                    </Text>
                  </Pressable>
                </View>
                {/* Contact Number */}
                <View style={styles.fieldWrapper}>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      editable={!loadingSubmit}
                      style={[styles.input, styles.flexInput]}
                      value={Person1phonenumber}
                      onChangeText={text => setPerson1phonenumber(text.replace(/\D/g, ""))}
                      keyboardType="numeric"
                      placeholder={"Contact Number"}
                      maxLength={10}
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.fieldWrapper}>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      editable={!loadingSubmit}
                      style={styles.input}
                      value={Person1email}
                      onChangeText={mail => setPerson1email(mail)}
                      keyboardType="email-address"
                      placeholder="Email"
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>
                {/* Person 2 */}
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldtTitle]}>Emergency Contact( Person 2 )</Text>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      editable={!loadingSubmit}
                      style={[styles.input, styles.flexInput]}
                      value={Person2name}
                      onChangeText={name => {
                        // Use preventConsecutiveSpaces to prevent multiple consecutive spaces
                        const sanitizedText = preventConsecutiveSpaces(name);
                        setPerson2name(sanitizedText);
                      }}
                      keyboardType="default"
                      placeholder="Name"
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>
                {/* Relation */}
                <View style={styles.fieldWrapper}>
                  <Pressable
                    style={[styles.openModalButton]}
                    onPress={() => {
                      handleModal("relation(p2)");
                    }}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !Person2relation && { color: "#ccc" }]}>
                      {Person2relation ? Person2relation : "Relation"}
                    </Text>
                  </Pressable>
                </View>
                {/* Contact Number */}
                <View style={styles.fieldWrapper}>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      editable={!loadingSubmit}
                      style={[styles.input, styles.flexInput]}
                      value={Person2phonenumber}
                      onChangeText={number => setPerson2phonenumber(number.replace(/\D/g, ""))}
                      keyboardType="numeric"
                      placeholder="Contact Number"
                      maxLength={10}
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.fieldWrapper}>
                  <View style={styles.inputWithButton}>
                    <TextInput
                      editable={!loadingSubmit}
                      style={styles.input}
                      value={Person2email}
                      onChangeText={mail => setPerson2email(mail)}
                      keyboardType="email-address"
                      placeholder="Email"
                      placeholderTextColor={"#ccc"}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}

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
        {tempAnswer === "mobile" && (
          <View style={styles.modalView}>
            <View style={styles.handle} />
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Enter Phone Number</Text>
              <TouchableOpacity
                onPress={() => {
                  (setModalVisible(false), settempphonenumber(""));
                }}
                style={styles.closeicon}
              >
                <Ionicons name="close-outline" size={25} />
              </TouchableOpacity>
            </View>
            {/* <Text style={[styles.fieldtTitle]}>Enter Phone Number</Text> */}
            <View style={[styles.inputWithButton, { width: "80%" }]}>
              <TextInput
                style={[styles.input]}
                value={tempphonenumber}
                onChangeText={text => settempphonenumber(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="e.g., 1234567890"
                maxLength={10}
                placeholderTextColor={"#ccc"}
              />
            </View>
            <Pressable style={styles.verifyButton} onPress={() => setTempAnswer("mobileotp")}>
              <Text style={styles.updateButtonText}>Confirm</Text>
            </Pressable>
          </View>
        )}
        {tempAnswer === "mobileotp" && (
          <View style={styles.modalView}>
            <View style={styles.handle} />
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Verify OTP</Text>
              <TouchableOpacity
                onPress={() => {
                  (setModalVisible(false), settempphonenumber(""));
                }}
                style={styles.closeicon}
              >
                <Ionicons name="close-outline" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.fieldtTitle]}>Enter OTP</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (refs[`input${index}`] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleOTPChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  placeholderTextColor={"#ccc"}
                />
              ))}
            </View>
            <View style={styles.resendContainer}>
              <Text style={styles.text}>Don't Receive OTP?</Text>
              <TouchableOpacity
                onPress={() => handleResendOTP(tempAnswer)}
                disabled={timer !== 0 || loadingResendOTP}
                style={[
                  styles.resendText,
                  (timer !== 0 || loadingResendOTP) && styles.disabledButton,
                ]}
              >
                {loadingResendOTP ? (
                  <ActivityIndicator size="small" color="#ccc" />
                ) : (
                  <Text style={timer !== 0 ? styles.disabledText : styles.resendText}>
                    Resend OTP
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={styles.timerText}>{`00:${timer < 10 ? `0${timer}` : timer}`}</Text>
            </View>
            <Pressable
              onPress={async () => {
                // Funtion to run API call to verify OTP
                if (otp.every(char => char !== "")) {
                  try {
                    setLoadingSubmit(true);
                    // Combine OTP digits into a single string
                    const otpString = otp.join("");

                    const response = await apiService.profile.verifyContactNumberOTP({
                      otp: otpString,
                      phoneNumber: `+91${tempphonenumber}`,
                    });

                    if (response && response.status === 200) {
                      // Handle successful OTP verification for contact number
                      handleContactOTPSuccess();
                      setModalVisible(false);
                      setOtp(["", "", "", "", "", ""]);
                      settempphonenumber("");

                      //   await dispatch(fetchProfile());
                    } else {
                      // OTP verification failed
                      ToastAndroid.show("OTP verification failed", ToastAndroid.SHORT);
                    }
                  } catch (error) {
                    console.error("Error verifying OTP:", error);
                  } finally {
                    setLoadingSubmit(false);
                  }
                } else {
                  alert("Please enter OTP!");
                }
              }}
              style={[
                styles.verifyButton,
                {
                  backgroundColor: otp.every(char => char !== "") ? Color.bcHeader : "#ccc",
                },
              ]}
              disabled={loadingSubmit || !otp.every(char => char !== "")}
            >
              {loadingSubmit ? (
                <ActivityIndicator size="small" color={Color.colorWhite} />
              ) : (
                <Text style={styles.updateButtonText}>Verify</Text>
              )}
            </Pressable>
          </View>
        )}
        {tempAnswer === "whatsapp" && (
          <View style={styles.modalView}>
            <View style={styles.handle} />
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Change Whatsapp Number</Text>
              <TouchableOpacity
                onPress={() => {
                  (setModalVisible(false), settempphonenumber(""));
                }}
                style={styles.closeicon}
              >
                <Ionicons name="close-outline" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.fieldtTitle]}>Enter WhatsApp Number</Text>
            <View style={[styles.inputWithButton, { width: "80%" }]}>
              <TextInput
                style={[styles.input]}
                value={tempphonenumber}
                onChangeText={text => settempphonenumber(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="e.g., 1234567890"
                maxLength={10}
                placeholderTextColor={"#ccc"}
              />
            </View>
            <Pressable style={styles.verifyButton} onPress={() => setTempAnswer("whatsappotp")}>
              <Text style={styles.updateButtonText}>Confirm</Text>
            </Pressable>
          </View>
        )}
        {tempAnswer === "altmobile" && (
          <View style={styles.modalView}>
            <View style={styles.handle} />
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Change Alternate Phone Number</Text>
              <TouchableOpacity
                onPress={() => {
                  (setModalVisible(false), settempphonenumber(""));
                }}
                style={styles.closeicon}
              >
                <Ionicons name="close-outline" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.fieldtTitle]}>Enter Alternate Phone Number</Text>
            <View style={[styles.inputWithButton, { width: "80%" }]}>
              <TextInput
                style={[styles.input]}
                value={tempphonenumber}
                onChangeText={text => settempphonenumber(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="e.g., 1234567890"
                maxLength={10}
                placeholderTextColor={"#ccc"}
              />
            </View>
            <Pressable style={styles.verifyButton} onPress={() => setTempAnswer("altmobileotp")}>
              <Text style={styles.updateButtonText}>Confirm</Text>
            </Pressable>
          </View>
        )}
        {tempAnswer === "email" && (
          <View style={styles.modalView}>
            <View style={styles.handle} />
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Change Email Address</Text>
              <TouchableOpacity
                onPress={() => {
                  (setModalVisible(false), settempphonenumber(""));
                }}
                style={styles.closeicon}
              >
                <Ionicons name="close-outline" size={25} />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputWithButton, { width: "80%" }]}>
              <TextInput
                style={[styles.input]}
                value={tempphonenumber}
                onChangeText={text => settempphonenumber(text)}
                keyboardType="email-address"
                placeholder="e.g., abc@gmail.com"
                placeholderTextColor={"#ccc"}
              />
            </View>
            <Pressable
              style={styles.verifyButton}
              onPress={async () => {
                if (!isValidEmail(tempphonenumber)) {
                  Alert.alert("Invalid Email", "Please enter a valid email address");
                  return;
                }

                try {
                  setLoadingSubmit(true);

                  try {
                    const response = await apiService.profile.addEmail(email);
                    if (response && (response.status === 200 || response.data?.success)) {
                      ToastAndroid.show("OTP sent to your email", ToastAndroid.SHORT);
                      return true;
                    } else {
                      throw new Error(response?.data?.message || "Failed to send OTP");
                    }
                  } catch (error) {
                    console.error("Add email error:", error);
                    throw error;
                  }

                  setTempAnswer("emailotp");
                } catch (error) {
                  console.error("Error sending email OTP:", error);
                  Alert.alert(
                    "Error",
                    error.response?.data?.message || "Failed to send OTP. Please try again."
                  );
                } finally {
                  setLoadingSubmit(false);
                }
              }}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <ActivityIndicator size="small" color={Color.colorWhite} />
              ) : (
                <Text style={styles.updateButtonText}>Confirm</Text>
              )}
            </Pressable>
          </View>
        )}
        {tempAnswer === "emailotp" && (
          <View style={styles.modalView}>
            <View style={styles.handle} />
            <View style={styles.modalheader}>
              <Text style={styles.modalTitle}>Verify OTP</Text>
              <TouchableOpacity
                onPress={() => {
                  (setModalVisible(false), settempphonenumber(""));
                }}
                style={styles.closeicon}
              >
                <Ionicons name="close-outline" size={25} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.fieldtTitle]}>Enter OTP Received on Email</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (refs[`input${index}`] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleOTPChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  placeholderTextColor={"#ccc"}
                />
              ))}
            </View>
            <View style={styles.resendContainer}>
              <Text style={styles.text}>Don't Receive OTP?</Text>
              <TouchableOpacity
                onPress={() => handleResendOTP(tempAnswer)}
                disabled={timer !== 0 || loadingResendOTP}
                style={[
                  styles.resendText,
                  (timer !== 0 || loadingResendOTP) && styles.disabledButton,
                ]}
              >
                {loadingResendOTP ? (
                  <ActivityIndicator size="small" color="#ccc" />
                ) : (
                  <Text style={timer !== 0 ? styles.disabledText : styles.resendText}>
                    Resend OTP
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={styles.timerText}>{`00:${timer < 10 ? `0${timer}` : timer}`}</Text>
            </View>
            <Pressable
              onPress={handleVerifyEmailOTP}
              style={[
                styles.verifyButton,
                {
                  backgroundColor: otp.every(char => char !== "") ? Color.bcHeader : "#ccc",
                },
              ]}
              disabled={loadingSubmit || !otp.every(char => char !== "")}
            >
              {loadingSubmit ? (
                <ActivityIndicator size="small" color={Color.colorWhite} />
              ) : (
                <Text style={styles.updateButtonText}>Verify</Text>
              )}
            </Pressable>
          </View>
        )}
        {tempAnswer === "relation(p1)" && (
          <View style={styles.selectionModalView}>
            <View style={styles.handle} />
            <View style={styles.selectionModalHeader}>
              <Text style={styles.selectionModalTitle}>
                Relation {Person1relation ? `- ${Person1relation}` : ""}
              </Text>
            </View>
            <FlatList
              data={modalitemsrelation}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelectionrelation1(item)} // Automatically select and close
                  style={[
                    styles.selectionItem,
                    Person1relation === item.label && styles.selectedSelectionItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectionItemText,
                      Person1relation === item.label && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {tempAnswer === "relation(p2)" && (
          <View style={styles.selectionModalView}>
            <View style={styles.handle} />
            <View style={styles.selectionModalHeader}>
              <Text style={styles.selectionModalTitle}>
                Relation {Person2relation ? `- ${Person2relation}` : ""}
              </Text>
            </View>
            <FlatList
              data={modalitemsrelation}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelectionrelation2(item)} // Automatically select and close
                  style={[
                    styles.selectionItem,
                    Person2relation === item.label && styles.selectedSelectionItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectionItemText,
                      Person2relation === item.label && styles.selectedItemText,
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

      {/* Update Button */}
      {changedFields?.length > 0 && (
        <TouchableOpacity
          style={styles.updateButton}
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
  verifyButton: {
    backgroundColor: Color.bcHeader,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "80%",
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    color: Color.colorWhite,
    fontFamily: FontFamily.Inter_Bold,
    textAlign: "center",
  },
  updateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Color.headingColor,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: Color.bcHeader,
    paddingTop: "12%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    height: height * 0.25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontFamily: FontFamily.Inter_Bold,
  },
  profileId: {
    fontSize: 14,
    color: "gray",
  },
  profileEmail: {
    fontSize: 14,
    color: "gray",
  },

  // Enhanced Modal Styles
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 0,
    overflow: "hidden",
  },

  avatar: {
    backgroundColor: Color.bcBackground,
  },

  imageIcon: {
    backgroundColor: Color.colorWhite,
    height: 25,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 25,
  },
  section: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: Color.bcNotification,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.Montserrat_SemiBold,
    marginBottom: 10,
    textAlign: "center",
    marginTop: 10,
  },
  infoField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "gray",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  photo: {
    width: "35%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldtTitle: {
    marginBottom: 6,
    fontSize: 13,
    fontFamily: FontFamily.Inter_Medium,
    color: "#666",
    flexDirection: "row",
  },
  dropdown: {
    borderColor: "#ccc",
    marginBottom: "4%",
    borderRadius: 1,
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
  buttonText: {
    fontSize: 15,
    color: "#333",
    fontFamily: FontFamily.Inter_Regular,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.Inter_Bold,
    marginBottom: 0,
    textAlign: "center",
    color: Color.bcHeader,
    letterSpacing: 0.5,
  },
  item: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 130, 173, 0.1)",
    width: "100%",
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: "#FAFAFA",
  },
  // Enhanced Selection Item Styles
  selectionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 130, 173, 0.08)",
    width: width * 0.8,
    borderRadius: 12,
    marginVertical: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(229, 130, 173, 0.1)",
  },
  selectedItem: {
    backgroundColor: Color.bcHeader,
    borderRadius: 12,
    shadowColor: Color.bcHeader,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderBottomColor: "transparent",
  },
  // Enhanced Selected Item for Selection Modal
  selectedSelectionItem: {
    backgroundColor: Color.bcHeader,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Color.bcHeader,
    shadowColor: Color.bcHeader,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderBottomColor: "transparent",
    transform: [{ scale: 1.02 }],
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: FontFamily.Inter_Medium,
  },
  // Enhanced Selection Item Text
  selectionItemText: {
    fontSize: 17,
    color: "#2C3E50",
    fontFamily: FontFamily.Inter_Medium,
    letterSpacing: 0.3,
  },
  selectedItemText: {
    fontFamily: FontFamily.Inter_Bold,
    color: Color.colorWhite,
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: Color.ButtonColor,
    padding: 15,
    borderRadius: 1,
    alignItems: "center",
  },
  closeModalButtonText: {
    color: "black",
    fontSize: 16,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: "rgba(229, 130, 173, 0.3)",
    alignSelf: "center",
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 20,
  },
  //Profile photo modal
  modalContainerphoto: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentphoto: {
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    padding: 20,
    paddingTop: 40,
    height: "22%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(229, 130, 173, 0.08)",
    borderRadius: 12,
    minWidth: 80,
  },
  modalButtonText: {
    fontSize: 14,
    marginTop: 4,
    color: Color.bcHeader,
    textAlign: "center",
    fontFamily: FontFamily.Inter_SemiBold,
  },
  removeText: {
    color: "#E97451",
  },

  logocal: {
    position: "absolute",
    zIndex: 1,
    alignSelf: "flex-end",
    top: "15%",
    right: "1.5%",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  heading: {
    right: "42%",
    fontSize: 20,
    fontFamily: FontFamily.Montserrat_Regular,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5, // Space between name and status
  },
  verificationIcon: {
    marginRight: 3, // Space between icon and text
  },
  verifiedText: {
    fontSize: 14,
    color: "green",
    fontFamily: FontFamily.Montserrat_Regular,
  },
  unverifiedText: {
    fontSize: 14,
    color: "#eba834",
    fontFamily: FontFamily.Montserrat_Regular,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  //Disabled Field
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#999",
    borderColor: "#E0E0E0",
  },
  disabledButton: {
    borderColor: "#d3d3d3",
  },
  disabledText: {
    color: Color.inactivebutton,
  },
  scrollContainer: {
    backgroundColor: Color.bcBackground,
    paddingHorizontal: 10,
  },
  //Mandetory mark
  fieldWrapper: {
    marginBottom: 5,
    borderRadius: 10,
  },
  fieldWrapper2: {
    // marginBottom: 16, // Adjust spacing
  },

  inputWithSuffix: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.7,
    borderColor: "#ccc",
    borderRadius: 2,
    paddingHorizontal: 10,
  },

  flexInput: {
    flex: 1,
    paddingVertical: 8,
  },

  suffixText: {
    fontSize: 14,
    color: "#333",
    fontFamily: FontFamily.Montserrat_Regular,
    // marginLeft: 8,
    right: "10%",
  },
  mandatoryAsterisk: {
    color: "red",
    marginLeft: 2,
    position: "absolute",
    right: 0,
    top: 8,
    fontSize: 12,
    zIndex: 2,
  },
  //Edit button for fields
  inputWithButton: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginVertical: 10,
  },
  // New styles for side-by-side layout
  inputButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  inputFieldSeparate: {
    flex: 1,
    marginRight: 10,
    height: 48, // Fixed height to match button
  },
  separateButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: Color.headerBg, // Changed from Color.colorWhite to theme pink
    borderRadius: 12, // Match input border radius
    borderWidth: 1,
    borderColor: Color.headingColor,
    minWidth: 80,
    height: 48, // Fixed height to match input
    alignItems: "center",
    justifyContent: "center",
  },
  flexInput: {
    // flex: 1,
    // marginRight: 10,
  },
  changeButton: {
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 5,
    position: "absolute",
    zIndex: 3,
    right: "2%",
    // top: "18%",
  },
  changeButtonText: {
    color: Color.headingColor, // Changed from Color.colorBlack to white
    fontSize: 12,
    fontFamily: FontFamily.Montserrat_SemiBold,
  },
  modalView: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    minHeight: 280,
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    maxHeight: height * 0.75,
    width: width,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  // Selection Modal Styles (for relation selection)
  selectionModalView: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    minHeight: 350,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    maxHeight: height * 0.8,
    width: width,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  selectionModalHeader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(229, 130, 173, 0.15)",
  },
  selectionModalTitle: {
    fontSize: 22,
    fontFamily: FontFamily.Inter_Bold,
    marginBottom: 0,
    textAlign: "center",
    color: Color.bcHeader,
    letterSpacing: 0.8,
  },
  modalheader: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 130, 173, 0.1)",
  },
  closeicon: {
    position: "absolute",
    right: 0,
    top: -2,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  //   Enhanced OTP Styles
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: "rgba(229, 130, 173, 0.3)",
    marginHorizontal: 6,
    borderRadius: 12,
    textAlign: "center",
    fontFamily: FontFamily.Inter_Bold,
    fontSize: 18,
    width: 45,
    height: 56,
    backgroundColor: "#FAFAFA",
    color: Color.bcHeader,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(229, 130, 173, 0.08)",
    borderRadius: 12,
    marginHorizontal: 8,
  },
  text: {
    fontSize: 14,
    color: "#666",
    fontFamily: FontFamily.Inter_Regular,
  },
  resendText: {
    fontSize: 14,
    color: Color.bcHeader,
    fontFamily: FontFamily.Inter_Bold,
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  disabledText: {
    fontSize: 14,
    color: "#999",
    fontFamily: FontFamily.Inter_Medium,
    marginLeft: 8,
  },
  timerText: {
    fontSize: 14,
    color: Color.bcHeader,
    fontFamily: FontFamily.Inter_Bold,
    marginLeft: 12,
    backgroundColor: "rgba(229, 130, 173, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  checkboxContainer: {
    flexDirection: "row",
    columnGap: 7,
  },
  checkbox: {
    width: 20,
  },
  loadingcontainer: {
    flex: 1,
    backgroundColor: Color.bcBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  sub: {
    marginVertical: 8,
    padding: 14,
    backgroundColor: Color.colorWhite,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  upperHalf: {
    // Upper section for Contact Number & Email
  },
  lowerHalf: {
    // Lower section for Alternate Number & WhatsApp Number
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 15,
    marginHorizontal: 5,
  },
  skeletonContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  skeletonFieldTitle: {
    height: 14,
    width: "40%",
    backgroundColor: "#E1E9EE",
    borderRadius: 5,
    marginBottom: 8,
  },
  skeletonInput: {
    height: 40,
    width: "100%",
    backgroundColor: "#E1E9EE",
    borderRadius: 10,
  },
  skeletonSectionTitle: {
    height: 18,
    width: "60%",
    backgroundColor: "#E1E9EE",
    borderRadius: 5,
    marginBottom: 15,
  },
});

// Function to resend OTP
const ResendOTP = async (tempAnswer, tempphonenumber) => {
  try {
    if (tempAnswer === "mobileotp") {
      // Resend contact number OTP
      const response = await apiService.profile.sendContactNumberOTP({
        phoneNumber: tempphonenumber,
      });

      if (response && response.status === 200) {
        ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);
      } else {
        throw new Error("Failed to resend OTP");
      }
    } else if (tempAnswer === "emailotp") {
      // Resend email OTP - tempphonenumber contains email for email OTP
      const response = await apiService.profile.sendEmailOTP({
        email: tempphonenumber,
      });

      if (response && response.status === 200) {
        ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);
      } else {
        throw new Error("Failed to resend OTP");
      }
    } else {
      ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    ToastAndroid.show("Failed to resend OTP", ToastAndroid.SHORT);
  }
};

// Helper function to prevent consecutive spaces in text inputs
const preventConsecutiveSpaces = text => {
  // Replace multiple consecutive spaces with a single space
  return text.replace(/\s{2,}/g, " ");
};

// Email validation function
const isValidEmail = email => {
  if (!email || email.trim() === "") return true; // Empty email is considered valid (optional field)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
