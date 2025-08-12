import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/UIComponents";
import { Color as COLORS } from "../constants/GlobalStyles";
import { BehalfUserSelector } from "./appointments/OtherScreen";
import apiService from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { handleApiMutation } from "../services/apiUtils";
import { addBehalfUser } from "../Redux/Slices/UserSlice";

const DoctorDetails = ({ navigation, route }) => {
  const { doctorId } = route.params; // UDI id of the doctor
  const { profile } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      const response = await apiService.profile.getDoctorDetails(doctorId);

      console.log("Response: ", JSON.stringify(response.data, null, 2));

      if (response.status === 200 || response.status === 201) {
        setDoctor(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const [doctor, setDoctor] = useState(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleOtherSubmit = async otherFormData => {
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

      // Close the modal
      setShowOtherModal(false);

      // Navigate to Survey Details with the form data
      navigation.navigate("SurveyDetails", {
        form: { name: "Other", ...otherFormData },
        doctor: {
          _id: doctor._id,
          doctorId: doctor.doctorId,
          UDI_id: doctor.UDI_id,
          firstName: doctor.firstName,
          middleName: doctor.middleName,
          lastName: doctor.lastName,
          profileImage: doctor.profileImage,
          isVerified: doctor.isVerified,
          professionalDetails: doctor.professionalDetails,
          clinicDetails: doctor.clinicDetails,
        },
      });
    } catch (error) {
      console.log("Error in handleOtherSubmit:", error);
      // Keep modal open if there's an error
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Helper to join arrays as comma separated
  const joinArr = arr => (Array.isArray(arr) ? arr.join(", ") : "-");

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Header
          title={"Doctor Details"}
          onBackPress={() => navigation.goBack()}
          rightComponent={null}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" translucent={false} />
      <View style={styles.container}>
        <Header
          title={"Doctor Details"}
          onBackPress={() => navigation.goBack()}
          rightComponent={null}
        />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient colors={["#ffffff", "#f8f9ff"]} style={styles.profileGradient}>
              <View style={styles.profileContent}>
                <View style={styles.profileImageContainer}>
                  {doctor.profileImage ? (
                    <Image source={{ uri: doctor.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                      <Text style={styles.profileImagePlaceholderText}>
                        {doctor.firstName?.charAt(0)}
                        {doctor.lastName?.charAt(0)}
                      </Text>
                    </View>
                  )}
                  {doctor.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons name="check-circle" size={20} color="#2ecc71" />
                    </View>
                  )}
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.doctorName}>
                    Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                  </Text>

                  {doctor.professionalDetails?.qualification && (
                    <Text style={styles.qualifications}>
                      {joinArr(doctor.professionalDetails.qualification)}
                    </Text>
                  )}

                  {doctor.professionalDetails?.specialization && (
                    <View style={styles.specializationContainer}>
                      <Text style={styles.specialization}>
                        {joinArr(doctor.professionalDetails.specialization)}
                      </Text>
                    </View>
                  )}

                  {doctor.professionalDetails?.yearsOfExperience && (
                    <Text style={styles.experience}>
                      {doctor.professionalDetails.yearsOfExperience} years of experience
                    </Text>
                  )}
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 2. Profile Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="account-details"
                size={24}
                color={COLORS.headingColor}
              />
              <Text style={styles.cardTitle}>Professional Details</Text>
            </View>

            <View style={styles.summaryContent}>
              {doctor.professionalDetails?.registrationNumber && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Registration Number:</Text>
                  <Text style={styles.summaryValue}>
                    {doctor.professionalDetails.registrationNumber}
                  </Text>
                </View>
              )}

              {doctor.professionalDetails?.medicalCouncil && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Medical Council:</Text>
                  <Text style={styles.summaryValue}>
                    {doctor.professionalDetails.medicalCouncil}
                  </Text>
                </View>
              )}

              {doctor.professionalDetails?.yearOfRegistration && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Year of Registration:</Text>
                  <Text style={styles.summaryValue}>
                    {doctor.professionalDetails.yearOfRegistration}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 3. Practice Locations */}
          <View style={styles.practiceCard}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="hospital-building"
                size={24}
                color={COLORS.headingColor}
              />
              <Text style={styles.cardTitle}>Practice Locations</Text>
            </View>

            {doctor.practiceInfo && doctor.practiceInfo.length > 0 ? (
              <View style={styles.practiceContent}>
                {doctor.practiceInfo.map((practice, index) => (
                  <View key={index} style={styles.practiceItem}>
                    {practice.hospitalName && (
                      <Text style={styles.hospitalName}>{practice.hospitalName}</Text>
                    )}

                    {practice.practiceAddress && (
                      <View style={styles.addressRow}>
                        <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                        <Text style={styles.addressText}>{practice.practiceAddress}</Text>
                      </View>
                    )}

                    {practice.departmentName && (
                      <View style={styles.departmentRow}>
                        <MaterialCommunityIcons name="hospital" size={16} color="#666" />
                        <Text style={styles.departmentText}>
                          Department: {practice.departmentName}
                        </Text>
                      </View>
                    )}

                    {practice.designation && (
                      <View style={styles.designationRow}>
                        <MaterialCommunityIcons name="account-tie" size={16} color="#666" />
                        <Text style={styles.designationText}>
                          Designation: {practice.designation}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No practice information available</Text>
            )}
          </View>

          {/* 4. Languages */}
          <View style={styles.languagesCard}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="translate" size={24} color={COLORS.headingColor} />
              <Text style={styles.cardTitle}>Languages</Text>
            </View>

            <View style={styles.languagesContent}>
              {doctor.languages?.speak && doctor.languages.speak.length > 0 && (
                <View style={styles.languageSection}>
                  <View style={styles.languageHeader}>
                    <MaterialCommunityIcons name="microphone" size={18} color="#666" />
                    <Text style={styles.languageType}>Speaks:</Text>
                  </View>
                  <View style={styles.languageChips}>
                    {doctor.languages.speak.map((lang, index) => (
                      <View key={index} style={styles.languageChip}>
                        <Text style={styles.languageChipText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {doctor.languages?.readWrite && doctor.languages.readWrite.length > 0 && (
                <View style={styles.languageSection}>
                  <View style={styles.languageHeader}>
                    <MaterialCommunityIcons name="book-open-variant" size={18} color="#666" />
                    <Text style={styles.languageType}>Reads/Writes:</Text>
                  </View>
                  <View style={styles.languageChips}>
                    {doctor.languages.readWrite.map((lang, index) => (
                      <View key={index} style={styles.languageChip}>
                        <Text style={styles.languageChipText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {doctor.languages?.understand && doctor.languages.understand.length > 0 && (
                <View style={styles.languageSection}>
                  <View style={styles.languageHeader}>
                    <MaterialCommunityIcons name="ear-hearing" size={18} color="#666" />
                    <Text style={styles.languageType}>Understands:</Text>
                  </View>
                  <View style={styles.languageChips}>
                    {doctor.languages.understand.map((lang, index) => (
                      <View key={index} style={styles.languageChip}>
                        <Text style={styles.languageChipText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {!doctor.languages?.speak?.length &&
                !doctor.languages?.readWrite?.length &&
                !doctor.languages?.understand?.length && (
                  <Text style={styles.noDataText}>No language information available</Text>
                )}
            </View>
          </View>
        </ScrollView>

        {/* Book Appointment Button */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            setShowChoiceModal(true);
            StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.7)");
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.headingColor, "#0056a8"]}
            style={styles.bookButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="calendar-plus" size={24} color="#fff" />
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Choice Modal */}
        <Modal
          isVisible={showChoiceModal}
          onBackdropPress={() => setShowChoiceModal(false)}
          style={styles.modal}
        >
          <View style={styles.choiceModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.choiceModalTitle}>Symptoms For</Text>
              <Text style={styles.choiceModalSubtitle}>Choose Person</Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setShowChoiceModal(false);
                  navigation.navigate("SurveyDetails", {
                    form: { name: "Self" },
                    doctor: {
                      _id: doctor._id,
                      UDI_id: doctor.UDI_id,
                      doctorId: doctor.doctorId,
                      firstName: doctor.firstName,
                      middleName: doctor.middleName,
                      lastName: doctor.lastName,
                      profileImage: doctor.profileImage,
                      isVerified: doctor.isVerified,
                      clinicDetails: doctor.clinicDetails,
                      professionalDetails: doctor.professionalDetails,
                    },
                  });
                }}
                activeOpacity={0.8}
              >
                <View style={styles.optionImageContainer}>
                  <Image source={require("../../assets/self.png")} style={styles.optionImage} />
                  <View style={styles.optionBadge}>
                    <MaterialCommunityIcons name="account" size={16} color={COLORS.white} />
                  </View>
                </View>
                <Text style={styles.optionText}>For Self</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setShowChoiceModal(false);
                  setShowOtherModal(true);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.optionImageContainer}>
                  <Image source={require("../../assets/other.png")} style={styles.optionImage} />
                  <View style={styles.optionBadge}>
                    <MaterialCommunityIcons
                      name="account-multiple"
                      size={16}
                      color={COLORS.white}
                    />
                  </View>
                </View>
                <Text style={styles.optionText}>For Others</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowChoiceModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Other Modal */}
        <Modal
          isVisible={showOtherModal}
          onBackdropPress={() => setShowOtherModal(false)}
          style={styles.modal}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              style={styles.otherModal}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <BehalfUserSelector
                profile={profile}
                onSubmit={handleOtherSubmit}
                onCancel={() => setShowOtherModal(false)}
                loading={loadingSubmit}
              />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f5f7fa",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  // Profile Card Styles
  profileCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  profileGradient: {
    padding: 20,
    borderRadius: 20,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileImagePlaceholder: {
    backgroundColor: COLORS.headingColor,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.headingColor,
    marginBottom: 4,
  },
  qualifications: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  specializationContainer: {
    marginBottom: 6,
  },
  specialization: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f46e5",
  },
  experience: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },

  // Card Common Styles
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languagesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.headingColor,
    marginLeft: 8,
  },

  // Summary Card Styles
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.headingColor,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },

  // Practice Card Styles
  practiceContent: {
    gap: 16,
  },
  practiceItem: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.headingColor,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  departmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  departmentText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  designationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  designationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },

  // Languages Card Styles
  languagesContent: {
    gap: 16,
  },
  languageSection: {
    gap: 8,
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageType: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  languageChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginLeft: 26,
  },
  languageChip: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageChipText: {
    fontSize: 13,
    color: "#4f46e5",
    fontWeight: "500",
  },

  // Common Styles
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },

  // Book Button Styles
  bookButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 25,
    shadowColor: COLORS.headingColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // Modal Styles
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    overflow: "hidden",
  },
  choiceModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: COLORS.lightBlue,
    width: "100%",
    marginTop: -24,
    marginLeft: -24,
    marginRight: -24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  choiceModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.headingColor,
    marginBottom: 8,
    textAlign: "center",
  },
  choiceModalSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  option: {
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
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
    backgroundColor: COLORS.lightBlue,
    borderWidth: 3,
    borderColor: COLORS.headingColor,
  },
  optionBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.headingColor,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.headingColor,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.lightBlue,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.headingColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.headingColor,
    fontWeight: "600",
    textAlign: "center",
  },
  otherModal: {
    backgroundColor: "#fff",
    maxHeight: "85%",
    minHeight: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    overflow: "hidden",
  },
});

export default DoctorDetails;
