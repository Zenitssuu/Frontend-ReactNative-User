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
import { Header } from "../components/UIComponents";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Color, FontFamily, FontSize } from "../constants/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

import { useDispatch, useSelector } from "react-redux";
import { addBehalfUser } from "../Redux/Slices/UserSlice";

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

export default function CreateOtherProfile({ navigation }) {
  const dispatch = useDispatch();

  const { profile } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [firstname, setfirstname] = useState("");
  const [middlename, setmiddlename] = useState("");
  const [lastname, setlastname] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  //MOdal Variables
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempAnswer, setTempAnswer] = useState(null);

  //   Track Changes
  const [isUpdated, setIsUpdated] = useState(false);

  const [valuegender, setvaluegender] = useState();
  const [modalitemsgender] = useState([
    { id: "1", label: "Male" },
    { id: "2", label: "Female" },
    { id: "3", label: "Other" },
  ]);
  const [valuerelation, setvaluerelation] = useState();
  const [modalitemsrelation] = useState([
    // { id: "1", label: "Father" },
    // { id: "2", label: "Mother" },
    // { id: "3", label: "Son" },
    // { id: "4", label: "Daughter" },
    // { id: "5", label: "Brother" },
    // { id: "6", label: "Sister" },
    // { id: "7", label: "Grandfather" },
    // { id: "8", label: "Grandmother" },
    // { id: "9", label: "Uncle" },
    // { id: "10", label: "Aunt" },
    // { id: "11", label: "Nephew" },
    // { id: "12", label: "Niece" },
    // { id: "13", label: "Cousin" },
    // { id: "14", label: "Husband" },
    // { id: "15", label: "Wife" },
    // { id: "16", label: "Father-in-law" },
    // { id: "17", label: "Mother-in-law" },
    // { id: "18", label: "Son-in-law" },
    // { id: "19", label: "Daughter-in-law" },
    // { id: "20", label: "Brother-in-law" },
    // { id: "21", label: "Sister-in-law" },
    // { id: "22", label: "Friend" },
    // { id: "23", label: "Guardian" },
    // { id: "24", label: "Other" },

    { id: "1", label: "Parents" },
    { id: "2", label: "Family" },
    { id: "3", label: "Friends" },
    { id: "4", label: "Other" },
  ]);

  // Minor consent state
  const [isMinor, setIsMinor] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);

  const handleModal = value => {
    setTempAnswer(value);
    setModalVisible(true);
  };

  const handleModalHide = () => {
    setTempAnswer(null);
  };
  //Gender Dropdown Selection
  const toggleSelectiongender = item => {
    setvaluegender(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };
  const toggleSelectionrelation = item => {
    setvaluerelation(item.label); // Directly set the selected item's label
    setModalVisible(false); // Close the modal after selection
  };

  // Handle date/time change
  const onChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);

      // Check if the selected date makes the person a minor (under 18)
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();

      // Calculate exact age
      let exactAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        exactAge--;
      }

      const isUnder18 = exactAge < 18;
      setIsMinor(isUnder18);

      // Reset parental consent when age changes
      if (!isUnder18) {
        setParentalConsent(false);
      }
    }
    setShow(false); // Close picker for Android
  };
  const handleOtherUserSubmit = async userData => {
    try {
      setLoadingSubmit(true);

      await handleApiMutation(apiService.profile.addBehalfUser, {
        args: [userData],
        successMessage: "Profile created successfully",
        onSuccess: response => {
          // console.log(response.data.newBehalfUser);
          const modifiedData = {
            ...response.data.newBehalfUser,
            ["dateOfBirth"]: new Date(response.data.newBehalfUser.dateOfBirth).toISOString(),
          };

          dispatch(addBehalfUser(modifiedData));
          navigation.goBack();
        },
      });
    } catch (error) {
      console.log(error);
      // Alert.alert("User Creation Failed", "Something went wrong. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const verifyData = () => {
    if (!firstname) {
      Alert.alert("Enter a First Name!!");
      return false;
    }
    if (!lastname) {
      Alert.alert("Enter a Last Name!!");
      return false;
    }
    if (!valuegender) {
      Alert.alert("Please Choose the gender !!");
      return false;
    }
    if (!date) {
      Alert.alert("Enter Date Of Birth !!");
      return false;
    }
    if (!valuerelation) {
      Alert.alert("Please Choose a relation !!");
      return false;
    }
    if (isMinor && !parentalConsent) {
      Alert.alert(
        "Parental Consent Required",
        "Please provide parental consent for treatment of a minor."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!verifyData()) return;

    // Create an object with the updated data
    const updatedData = {
      firstName: firstname,
      middleName: middlename,
      lastName: lastname,
      gender: valuegender,
      dateOfBirth: date,
      relationship: valuerelation,
      ...(isMinor && { parentalConsent: parentalConsent }),
    };

    // console.log(updatedData);

    await handleOtherUserSubmit(updatedData);
  };

  //Main Return Structure
  return (
    <View style={styles.container}>
      <Header
        title="Create Other Profile"
        onBackPress={() => navigation.goBack()}
        rightComponent={null}
      />
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

              {/* Relation */}
              <View style={styles.sub}>
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldtTitle}>Relation</Text>
                  <Pressable
                    style={styles.input}
                    onPress={() => handleModal("relation")}
                    disabled={loadingSubmit}
                  >
                    <Text style={[styles.buttonText, !valuerelation && { color: "gray" }]}>
                      {valuerelation ? valuerelation : "Relation"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Parental Consent for Minors */}
              {isMinor && (
                <View style={styles.sub}>
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldtTitle}>Parental Consent</Text>
                    <TouchableOpacity
                      style={styles.consentContainer}
                      onPress={() => setParentalConsent(!parentalConsent)}
                      disabled={loadingSubmit}
                    >
                      <View style={[styles.checkbox, parentalConsent && styles.checkedBox]}>
                        {parentalConsent && (
                          <Ionicons name="checkmark" size={16} color={Color.colorWhite} />
                        )}
                      </View>
                      <Text style={styles.consentText}>
                        I, as the parent/guardian, give consent for the medical treatment of this
                        minor.
                      </Text>
                    </TouchableOpacity>
                    {isMinor && (
                      <Text style={styles.minorNotice}>
                        * This person is under 18 years of age and requires parental consent for
                        treatment.
                      </Text>
                    )}
                  </View>
                </View>
              )}

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
              {tempAnswer === "relation" && (
                <View style={styles.modalView}>
                  <View style={styles.handle} />
                  <View style={styles.modalCloseButton}>
                    <Text style={styles.modalTitle}>
                      Relation{" "}
                      <Text style={[styles.modalTitle, { fontWeight: "regular" }]}>
                        {valuerelation ? `- ${valuerelation}` : ""}
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
                    data={modalitemsrelation}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => toggleSelectionrelation(item)} // Automatically select and close
                        style={[styles.item, valuerelation === item.label && styles.selectedItem]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            valuerelation === item.label && styles.selectedItemText,
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
            </Modal>
          </ScrollView>
        </>
      )}
      {/* Submit Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.floatingUpdateButton}
          onPress={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ActivityIndicator size="small" color={Color.colorWhite} />
          ) : (
            <Text
              style={{
                color: Color.colorWhite,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: 40,
    padding: 10,
    backgroundColor: Color.headingColor,
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 10,
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
  // Parental consent styles
  consentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Color.headingColor,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: Color.headingColor,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.Inter_Regular,
    color: "#333",
    lineHeight: 20,
  },
  minorNotice: {
    fontSize: 12,
    fontFamily: FontFamily.Inter_Regular,
    color: Color.bcHighlight,
    marginTop: 8,
    fontStyle: "italic",
  },
});
