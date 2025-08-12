import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  ToastAndroid as ToastMessage,
  Dimensions,
} from "react-native";
import { Color, FontFamily } from "../constants/GlobalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SimpleInput } from "../components/UIComponents";
// import { fetchProfile } from "../redux/actions/profileAction"
import { useDispatch } from "react-redux";
import apiService from "../services/api";
import { registerUser } from "../Redux/Slices/UserSlice";

const { width, height } = Dimensions.get("window");

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null); // Default to Female
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  //Redux
  const dispatch = useDispatch();

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisibility(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const validateForm = () => {
    if (!firstName) {
      Alert.alert("First Name", "First Name is required");
      return false;
    }
    if (!lastName) {
      Alert.alert("Last Name", "Last Name is required");
      return false;
    }
    if (!gender) {
      Alert.alert("Validation Error", "Gender is required");
      return false;
    }
    if (!dateOfBirth) {
      Alert.alert("Validation Error", "Date of Birth is required");
      return false;
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Validation Error", "Invalid Email Address");
      return false;
    }
    return true;
  };

  const savedata = async formattedAnswers => {
    // Format of formattedAnswers
    /* 
    const formattedAnswers = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      gender: gender,
      dateOfBirth: dateOfBirth.toISOString(),
      email: email,
    };
    */

    try {
      setLoading(true);
      const response = await apiService.profile.createProfile(formattedAnswers);

      const { data } = response.data;
      dispatch(registerUser(data));

      if (response.status === 200) {
        ToastMessage.show("Profile created successfully", ToastMessage.SHORT);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainDrawer" }],
        });
      } else {
        Alert.alert("Error", "Error submitting information.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const submitvalue = () => {
    if (!validateForm()) return;
    const formattedAnswers = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      gender: gender,
      dateOfBirth: dateOfBirth.toISOString(),
      email: email,
    };
    savedata(formattedAnswers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.Container2}>
        <View style={styles.header}>
          <Image source={require("../../assets/tellyoudoc.png")} style={styles.image} />
          {/* <Text style={styles.subtitle}>Mermary Evaluation</Text> */}
          <Text style={styles.headingText}>Create Profile</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <SimpleInput
            // style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#B0B0B0"
          />
          <SimpleInput
            // style={styles.input}
            placeholder="Middle Name (Optional)"
            value={middleName}
            onChangeText={setMiddleName}
            placeholderTextColor="#B0B0B0"
          />
          <SimpleInput
            // style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#B0B0B0"
            style={styles.textstyle}
          />
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <View style={styles.radioGroup}>
              {["Male", "Female", "Others"].map(g => (
                <Pressable key={g} style={styles.radioButton} onPress={() => setGender(g)}>
                  <View style={gender === g ? styles.radioSelected : styles.radioUnselected} />

                  <Text style={gender === g ? styles.radioLabel : styles.unselectedText}>{g}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={[styles.textstyle, styles.dateInput, { width: "85%" }]}
              onPress={() => setDatePickerVisibility(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  {
                    color: dateOfBirth ? "#000" : "#B0B0B0",
                    fontFamily: FontFamily.Inter_Regular,
                    fontSize: 16,
                  },
                ]}
              >
                {dateOfBirth && dateOfBirth instanceof Date && !isNaN(dateOfBirth)
                  ? dateOfBirth.toLocaleDateString("en-GB")
                  : "DD/MM/YYYY"}
              </Text>
              <TouchableOpacity
                style={styles.calendarIcon}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Icon name="calendar-outline" size={24} color="#000" styles={{}} />
              </TouchableOpacity>
            </TouchableOpacity>

            {isDatePickerVisible && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 110))}
                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
              />
            )}
          </View>

          <SimpleInput
            // style={styles.input}
            placeholder="Email (Optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#B0B0B0"
          />

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF1493" />
            ) : (
              <TouchableOpacity
                onPress={submitvalue}
                style={{
                  backgroundColor: Color.bcHeader,
                  width: "100%",
                  paddingVertical: 15,
                  alignItems: "center",
                  borderRadius: 10,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: FontFamily.Inter_Medium,
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.bcBackgroundBlue,
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
  },
  textstyle: {
    width: "85%",
    height: 40,
    borderWidth: 1,
    borderColor: Color.headingColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Color.darkGray,
    backgroundColor: Color.white,
    marginVertical: 8,
    fontFamily: FontFamily.Inter_Regular,
    minHeight: 48,
  },
  Container2: {
    marginVertical: "auto",
    width: "100%",
    height: height * 0.87,
    padding: 10,
    backgroundColor: Color.colorWhite,
    borderRadius: 20,
    elevation: 5,
  },
  header: {
    width: "100%",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    zIndex: 0,
    paddingBottom: 150,
  },
  image: {
    width: 100,
    alignSelf: "center",
    height: 150,
    resizeMode: "contain",
    marginTop: 10,
    // position: "absolute",
    // borderWidth: 1,
  },
  subtitle: {
    fontSize: 18,
    alignSelf: "center",
    fontFamily: FontFamily.Inter_Bold,
    // marginBottom: 10,
    color: "#ffa6bb",
    marginTop: 10,
  },

  headingText: {
    fontSize: 16,
    fontFamily: FontFamily.Inter_Regular,
    alignSelf: "center",
  },
  unselectedText: {
    color: "#000",
    fontSize: 16,
    fontFamily: FontFamily.Inter_Regular,
  },
  input: {
    width: "85%",
    height: 40,
    // borderColor: "#848484",
    borderColor: "#ffa6bb",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    // justifyContent: "center",
    fontFamily: FontFamily.Inter_Regular,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: FontFamily.Inter_Regular,
  },
  genderContainer: {},
  genderContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  genderLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },

  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0077B6",
    marginRight: 8,
  },

  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "transparent",
    marginRight: 8,
  },

  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0077B6",
  },

  unselectedText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#888",
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    backgroundColor: "#f0f8ff",
    borderLeftWidth: 4,
    borderLeftColor: Color.bcHeader,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
    color: "#333",
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioGroup: {
    width: "75%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Color.bcHeader,
    marginRight: 5,
    borderWidth: 1,
    // borderColor: '#000',
    borderColor: Color.bcHeader,
  },
  radioUnselected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    // borderColor: "#000",
    borderColor: Color.bcHeader,
    borderWidth: 1,
    marginRight: 5,
  },
  radioLabel: {
    fontSize: 16,
  },
  dateContainer: {
    width: "100%",
    alignItems: "center",
  },
  calendarIcon: {
    position: "absolute",
    top: 22,
    right: 10,
    transform: [{ translateY: -12 }],
  },
  buttonContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: "10%",
    marginTop: 10,
    alignItems: "center",
  },
  picker: {
    width: "100%",
    fontFamily: FontFamily.Inter_Regular,
  },
  itemStyle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginVertical: 20,
  },
  choiceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Color.chemoHeader,
    borderRadius: 8,
  },
  choiceImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 10,
  },
  choiceText: {
    fontSize: 16,
    fontFamily: FontFamily.Inter_SemiBold,
    color: "#000",
  },
  choiceSelected: {
    backgroundColor: Color.chemoHeader,
  },
});

export default Register;
