import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  ToastAndroid as ToastMessage,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Keyboard,
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { Color, FontFamily } from "../constants/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { LoadingSpinner, SimpleButton } from "../components/UIComponents";
// import { sendOTP, verifyOTP } from "../services/api2"

// Redux imports
import { useDispatch } from "react-redux";
import { registerUser } from "../Redux/Slices/UserSlice";

// app imports
import apiService from "../services/api";
import { handleApiMutation } from "../services/apiUtils";
import { AnalyticsService } from "../utils/analytics";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSelected, setSelection] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showOTPVisible, setShowOTPSection] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30); // Timer for resend OTP
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Use useRef for input fields to better manage focus
  const inputRefs = useRef([]);

  // Redux
  const dispatch = useDispatch();

  // Track screen view when component mounts
  useEffect(() => {
    AnalyticsService.logScreenView("Login", "LoginScreen");
  }, []);

  // Function to handle OTP request
  const handleSendOTP = async () => {
    // Input validation
    if (phoneNumber.trim() === "") {
      Alert.alert("Input Required", "Please enter a phone number.");
      return;
    } else if (!isSelected) {
      Alert.alert("Terms Required", "Please agree to the terms and conditions.");
      return;
    } else if (phoneNumber.length < 10 || !/^\d+$/.test(phoneNumber)) {
      ToastMessage.show("Please enter a valid phone number", ToastMessage.SHORT);
      return;
    }

    setIsLoading(true);

    try {
      // Use handleApiMutation from apiUtils for consistent error handling
      await handleApiMutation(apiService.auth.resendOTP, {
        args: [countryCode, phoneNumber],
        successMessage: "OTP sent successfully",
        onSuccess: () => {
          // Track OTP request
          AnalyticsService.logEvent("otp_requested", {
            phone_number_country_code: countryCode,
            phone_number_length: phoneNumber.length,
          });

          setShowOTPSection(true);
          setTimer(30);
        },
        onError: error => {
          // Specific error handling based on status code
          if (error.status === 400) {
            Alert.alert("Error", "Invalid phone number format");
          } else if (error.status === 429) {
            Alert.alert("Error", "Too many attempts. Please try again later.");
          } else {
            Alert.alert("Error", error.message || "Failed to send OTP");
          }
        },
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to resend OTP
  const ResendOTP = async () => {
    setIsLoading(true);
    try {
      // Use handleApiMutation from apiUtils
      await handleApiMutation(apiService.auth.resendOTP, {
        args: [countryCode, phoneNumber],
        successMessage: "OTP resent successfully",
        onError: error => {
          // Specific error handling based on status code
          if (error.status === 400) {
            Alert.alert("Error", "Invalid phone number format");
          } else if (error.status === 429) {
            Alert.alert("Error", "Too many attempts. Please try again later.");
          } else {
            Alert.alert("Error", error.message || "Failed to resend OTP");
          }
        },
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle OTP input

  const handleOtpVerification = async () => {
    if (!otp.join("").trim() || otp.join("").length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const completePhoneNumber = `${countryCode}${phoneNumber}`.trim();
      const otpValue = otp.join("").trim();

      // Call verify OTP endpoint
      const response = await apiService.auth.verifyOTP(completePhoneNumber, otpValue);

      ToastMessage.show("OTP verified successfully", ToastMessage.SHORT);

      // Extract tokens from response
      const { AccessToken, RefreshToken } = response.data;

      // Store tokens in AsyncStorage
      try {
        await AsyncStorage.multiSet([
          ["AccessToken", AccessToken],
          ["RefreshToken", RefreshToken],
          ["AsUser", "Patient"],
        ]);
      } catch (storageError) {
        console.error("Error storing tokens:", storageError);
        Alert.alert("Error", "Error storing authentication tokens.");
        return;
      }

      // Navigate based on response status
      if (response.status === 201 || response.status === 200) {
        // Track new user registration
        await AnalyticsService.logSignUp("phone");
        await AnalyticsService.logEvent("new_user_registration", {
          phone_number_country_code: countryCode,
          registration_method: "phone_otp",
        });

        navigation.reset({ index: 0, routes: [{ name: "Register" }] });
        setShowOTPSection(false);
      } else if (response.status === 202) {
        // Track successful login
        await AnalyticsService.logLogin("phone");
        await AnalyticsService.logEvent("user_login_success", {
          phone_number_country_code: countryCode,
          login_method: "phone_otp",
        });

        // store user profile details in redux store
        const userProfile = await apiService.profile.getProfile();
        dispatch(registerUser(userProfile.data.data));

        // Set user ID for analytics
        if (userProfile.data.data?.id) {
          await AnalyticsService.setUserId(userProfile.data.data.id.toString());
        }

        navigation.reset({ index: 0, routes: [{ name: "MainDrawer" }] });
        setShowOTPSection(false);
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      // Handle different error cases
      if (error.status === 400) {
        ToastMessage.show("Invalid OTP. Please try again!", ToastMessage.SHORT);
      } else if (error.status === 401) {
        ToastMessage.show("OTP expired. Please request a new one.", ToastMessage.SHORT);
      } else if (error.status === 500) {
        Alert.alert("Error", "Server error. Please try again later.");
      } else {
        Alert.alert("Error", error.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Automatically focus on the next input if available and input is not empty
    if (text && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Function to handle backspace deletion
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Function to handle resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    await ResendOTP(); // Resend the OTP
    setIsLoading(false);
    inputRefs.current[0].focus();
  };

  // Timer for resend OTP
  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [timer]);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardWillShow = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardWillHide = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(keyboardWillShow, () => {
      setKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener(keyboardWillHide, () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
    >
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity activeOpacity={1} style={styles.mainContainer} onPress={Keyboard.dismiss}>
        <View
          style={[styles.contentContainer, keyboardVisible && styles.contentContainerKeyboardOpen]}
        >
          <Animated.View
            style={[styles.container2, keyboardVisible && styles.container2KeyboardOpen]}
          >
            <View style={styles.header}>
              <Image source={require("../../assets/tellyoudoc_logo2.png")} style={styles.logo} />
              <Text style={styles.subtitle}>Welcome</Text>
              <Image source={require("../../assets/tellyoudoc.png")} style={styles.logo2} />
            </View>

            {!showOTPVisible ? (
              <Animated.View style={styles.body}>
                <Text style={styles.inputLabel}>Enter Phone Number</Text>
                <View style={styles.inputContainer}>
                  <TouchableOpacity style={styles.dropdown} disabled={true}>
                    <View style={styles.selectedContainer}>
                      <Text style={styles.selectedText}>{countryCode}</Text>
                    </View>
                  </TouchableOpacity>

                  <TextInput
                    value={phoneNumber}
                    onChangeText={text => {
                      if (text.length <= 10) {
                        setPhoneNumber(text);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                  />
                </View>

                <View style={styles.checkboxContainer}>
                  <CheckBox
                    checked={isSelected}
                    onPress={() => {
                      setSelection(!isSelected);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    checkedColor={Color.headingColor}
                    uncheckedColor="#ddd"
                    containerStyle={styles.checkbox}
                  />
                  <Text style={styles.label}>
                    I agree to the <Text style={styles.linkText}>Terms & Conditions</Text>
                  </Text>
                </View>

                <SimpleButton
                  title="Send OTP"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    handleSendOTP();
                  }}
                  disabled={!isSelected || phoneNumber.trim().length !== 10 || isLoading}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        !isSelected || phoneNumber.trim().length !== 10
                          ? Color.inactivebutton
                          : Color.bcHeader,
                    },
                  ]}
                />
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </Animated.View>
            ) : (
              <Animated.View style={styles.body}>
                <View style={styles.headingContainer}>
                  <Text style={styles.headingText}>Verify OTP</Text>
                  <View style={styles.phoneDisplay}>
                    <Text style={styles.phoneText}>
                      Code sent to {countryCode} {phoneNumber}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowOTPSection(false);
                        setOtp(["", "", "", "", "", ""]);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={styles.editButton}
                    >
                      <Icon name="edit" type="font-awesome" size={16} color={Color.bcHeader} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (inputRefs.current[index] = ref)}
                      style={[styles.otpInput, digit && styles.otpInputFilled]}
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      onChangeText={text => {
                        handleOTPChange(text, index);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      onKeyPress={e => handleKeyPress(e, index)}
                    />
                  ))}
                </View>

                <View style={styles.resendContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleResendOTP();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    disabled={timer !== 0}
                    style={timer !== 0 ? styles.disabledResend : styles.resendButton}
                  >
                    <Text style={timer !== 0 ? styles.disabledText : styles.resendText}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.timerText}>{`00:${timer < 10 ? `0${timer}` : timer}`}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (otp.every(char => char !== "")) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleOtpVerification();
                    } else {
                      Alert.alert("Input Required", "Please enter OTP!");
                    }
                  }}
                  // Determine if the button should be "active" (all OTP digits entered)
                  style={[
                    styles.button,
                    {
                      backgroundColor: otp.every(char => char !== "")
                        ? Color.bcHeader // Active color when all digits are filled
                        : Color.inactivebutton, // Inactive color otherwise
                    },
                  ]}
                  // Also disable the button if OTP is not complete or loading
                  disabled={!otp.every(char => char !== "") || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text
                      style={[
                        styles.buttonText,
                        !otp.every(char => char !== "") && { color: "#aaa" },
                      ]}
                    >
                      Verify OTP
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>

          {!keyboardVisible && (
            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Support</Text>
              </TouchableOpacity>
              <Text style={styles.footerDivider}>|</Text>
              <TouchableOpacity onPress={() => navigation.navigate("ContactUs")}>
                <Text style={styles.footerLink}>Contact</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bclight,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  contentContainerKeyboardOpen: {
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "ios" ? 20 : 10,
  },
  container2: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Color.colorWhite,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.84,
    maxHeight: Platform.OS === "ios" ? height * 0.85 : height * 0.9,
  },
  container2KeyboardOpen: {
    maxHeight: height * 0.95,
    borderRadius: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  logo: {
    width: width * 2,
    maxWidth: 200,
    height: height * 0.08,
    resizeMode: "contain",
  },
  logo2: {
    width: "100%",
    height: height * 0.15,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 24,
    fontFamily: FontFamily.Inter_Bold,
    color: Color.bcHeader,
    marginBottom: 10,
  },
  body: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FontFamily.Inter_Medium,
    color: "#666",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Color.bcHeader,
    borderRadius: 12,
    minHeight: 50,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  dropdown: {
    paddingVertical: 0,
  },
  selectedContainer: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    justifyContent: "center",
    minHeight: 30,
  },
  phoneInput: {
    flex: 1,
  },
  checkbox: {
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
    color: "#666",
  },
  linkText: {
    color: Color.bcHeader,
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FontFamily.Inter_Medium,
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  headingText: {
    fontSize: 24,
    fontFamily: FontFamily.Inter_Bold,
    color: "#333",
    marginBottom: 8,
  },
  phoneDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneText: {
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
    color: "#666",
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: Platform.OS === "ios" ? 10 : 0,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontFamily: FontFamily.Inter_Medium,
    color: "#333",
    backgroundColor: "#fff",
    padding: 0,
  },
  otpInputFilled: {
    borderColor: Color.bcHeader,
    backgroundColor: Color.bclight,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    color: Color.bcHeader,
    fontSize: 14,
    fontFamily: FontFamily.Inter_Medium,
  },
  disabledResend: {
    padding: 8,
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
    fontSize: 14,
    fontFamily: FontFamily.Inter_Medium,
  },
  timerText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 20,
  },
  footerLink: {
    color: "#666",
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
    textDecorationLine: "underline",
    paddingHorizontal: 8,
  },
  footerDivider: {
    color: "#666",
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
  },
});
