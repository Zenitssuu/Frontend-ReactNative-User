import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  Animated,
} from "react-native";
import { EmptyState, Header } from "../components/UIComponents";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import apiService from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { handleApiMutation } from "../services/apiUtils";
import { addBehalfUser } from "../Redux/Slices/UserSlice";
import { BehalfUserSelector } from "./appointments/OtherScreen";
import { useFocusEffect } from "@react-navigation/native";
import { Color as COLORS } from "../constants/GlobalStyles";

// Optimized Skeleton Loader - Single shared animation
const sharedShimmerAnimation = new Animated.Value(0);

// Start the shared animation once
const startShimmerAnimation = () => {
  const shimmer = () => {
    Animated.sequence([
      Animated.timing(sharedShimmerAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(sharedShimmerAnimation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start(() => shimmer());
  };
  shimmer();
};

// Start animation immediately
startShimmerAnimation();

const SkeletonLine = React.memo(({ width = "100%", height = 12, style = {} }) => {
  const backgroundColor = sharedShimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e0e0e0", "#f0f0f0"],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor,
          borderRadius: 6,
          marginVertical: 2,
        },
        style,
      ]}
    />
  );
});

const SkeletonDoctorCard = React.memo(() => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <SkeletonLine width={40} height={40} style={{ borderRadius: 20 }} />
        <View style={styles.skeletonDoctorInfo}>
          <SkeletonLine width="70%" height={16} />
          <SkeletonLine width="50%" height={12} style={{ marginTop: 4 }} />
        </View>
        <SkeletonLine width={20} height={16} style={{ borderRadius: 10 }} />
      </View>
      <View style={styles.skeletonAppointments}>
        <View style={styles.skeletonAppointmentCard}>
          <SkeletonLine width={40} height={40} style={{ borderRadius: 20 }} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <SkeletonLine width="60%" height={16} />
          </View>
        </View>
        <View style={styles.skeletonAppointmentCard}>
          <SkeletonLine width={40} height={40} style={{ borderRadius: 20 }} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <SkeletonLine width="80%" height={16} />
          </View>
        </View>
      </View>
    </View>
  );
});

const SkeletonLoader = React.memo(() => {
  return (
    <View style={styles.container}>
      <SkeletonDoctorCard />
      <SkeletonDoctorCard />
      <SkeletonDoctorCard />
    </View>
  );
});

// Optimized data transformation function
const transformAppointmentData = appointment => {
  const doctorNames = appointment.doctorName.split(" ");

  return {
    _id: `${appointment.appointmentId}`,
    date: appointment.appointmentDate,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    location: appointment.location,
    bookingStatus: "booked",
    doctorId: appointment.doctorId,
    symptomId: appointment.symptomId,
    appointmentId: appointment.appointmentId,
    doctorUDI_id: appointment.doctorUDI_id,
    type: appointment.type,
    isParent: true,
    behalfUserId: appointment.behalfUser
      ? {
          firstName: appointment.behalfUser.fullName.split(" ")[0],
          lastName: appointment.behalfUser.fullName.split(" ").slice(1).join(" "),
          fullName: appointment.behalfUser.fullName,
          gender: appointment.behalfUser.gender,
          relationship: appointment.behalfUser.relationship,
          age: appointment.behalfUser.age,
          behalfUserId: appointment.behalfUser._id,
        }
      : null,
    childAppointments: [],
    // Pre-compute doctor data to avoid repeated processing
    doctor: {
      _id: appointment.doctorId,
      firstName: doctorNames[0] || "",
      middleName: doctorNames[1] || "",
      lastName: doctorNames[2] || "",
      profileImage: appointment.doctorProfileImage,
      professionalDetails: {
        specialization: appointment.doctorSpecialization,
      },
    },
  };
};

// Optimized data grouping function
const groupAppointmentsByDoctor = appointments => {
  const grouped = {};

  for (const appointment of appointments) {
    const doctorId = appointment.doctorId;

    if (!grouped[doctorId]) {
      grouped[doctorId] = {
        doctor: appointment.doctor, // Use pre-computed doctor data
        appointments: [],
      };
    }

    // Remove doctor data from appointment to avoid duplication
    const { doctor, ...appointmentData } = appointment;
    grouped[doctorId].appointments.push(appointmentData);
  }

  return grouped;
};

const getInitials = (firstName, middleName, lastName) => {
  const names = [firstName, middleName, lastName].filter(name => name && name.trim());
  return names
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Memoized appointment card component
const AppointmentCard = React.memo(({ appointment, isChild, navigation }) => {
  const appointmentFor = useMemo(
    () =>
      appointment.type === "patient"
        ? "Self"
        : appointment.behalfUserId?.fullName || "Unknown",
    [appointment.type, appointment.behalfUserId]
  );

  const relationship = appointment.behalfUserId?.relationship;

  const displayText = useMemo(
    () =>
      appointment.type === "patient"
        ? "For: Self"
        : `For: ${appointmentFor}${relationship ? ` (${relationship})` : ""}`,
    [appointment.type, appointmentFor, relationship]
  );

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("VisitDetails", {
          appDetails: appointment,
        })
      }
      style={styles.appointmentCardWrapper}
    >
      <View style={[styles.appointmentSubCard, isChild && styles.childAppointmentCard]}>
        <View style={styles.appointmentContent}>
          <View style={styles.appointmentIconContainer}>
            <MaterialCommunityIcons
              name={appointment.type === "patient" ? "account" : "account-multiple"}
              size={24}
              color="#01869e"
            />
          </View>
          <Text style={styles.appointmentForText}>{displayText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const renderAppointmentCard = (appointment, isChild = false, navigation) => {
  return <AppointmentCard appointment={appointment} isChild={isChild} navigation={navigation} />;
};

// Memoized doctor section component
const DoctorSection = React.memo(({ doctorId, doctorData, navigation }) => {
  const { doctor, appointments } = doctorData;

  const doctorFullName = useMemo(() => {
    if (!doctor) return "";
    return [doctor.firstName, doctor.middleName, doctor.lastName]
      .filter(name => name && name.trim())
      .join(" ");
  }, [doctor?.firstName, doctor?.middleName, doctor?.lastName]);

  const specialization = doctor?.professionalDetails?.specialization?.[0] || "General Physician";
  const doctorInitials = useMemo(() => {
    if (!doctor) return "";
    return getInitials(doctor.firstName, doctor.middleName, doctor.lastName);
  }, [doctor?.firstName, doctor?.middleName, doctor?.lastName]);

  if (!doctor) return null;

  const totalAppointments = appointments.length;
  const visibleAppointments = appointments.slice(0, 2);
  const hasMoreAppointments = appointments.length > 2;
  const remainingCount = appointments.length - 2;

  return (
    <View style={styles.doctorSection}>
      <Card style={styles.doctorCard}>
        <Card.Content style={styles.doctorContent}>
          <View style={styles.doctorHeader}>
            {doctor.profileImage ? (
              <Image source={{ uri: doctor.profileImage }} style={styles.doctorImage} />
            ) : (
              <View style={styles.doctorAvatarContainer}>
                <Text style={styles.doctorAvatarText}>{doctorInitials}</Text>
              </View>
            )}

            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. {doctorFullName}</Text>
              <Text style={styles.doctorSpecialization}>{specialization}</Text>
            </View>

            <Text style={styles.appointmentCount}>{totalAppointments}</Text>
          </View>

          <View style={styles.appointmentsContainer}>
            {visibleAppointments.map(appointment => (
              <View key={appointment._id}>
                {renderAppointmentCard(appointment, false, navigation)}
              </View>
            ))}

            {hasMoreAppointments && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => {
                  navigation.navigate("DoctorAppointments", {
                    doctor: doctor,
                    appointments: appointments,
                  });
                }}
              >
                <View style={styles.showMoreContent}>
                  <MaterialCommunityIcons name="chevron-down" size={16} color="#01869e" />
                  <Text style={styles.showMoreText}>
                    Show {remainingCount} more appointment
                    {remainingCount > 1 ? "s" : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
});

const renderDoctorSection = (doctorId, doctorData, navigation) => {
  return <DoctorSection doctorId={doctorId} doctorData={doctorData} navigation={navigation} />;
};

// Current Treatments Component
const CurrentTreatments = React.memo(({ navigation }) => {
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { profile } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Optimized data fetching with better error handling
  const fetchData = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Reduced timeout for faster feedback
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 8000); // 8 second timeout
      });

      const response = await Promise.race([
        apiService.appointments.getOngoingTreatment(),
        timeoutPromise,
      ]);

      const ongoingTreatments = response.data?.uniqueDoctors || [];

      // Transform data in batches for better performance
      const transformedAppointments = ongoingTreatments.map(transformAppointmentData);
      const grouped = groupAppointmentsByDoctor(transformedAppointments);

      setGroupedAppointments(grouped);
      setHasLoaded(true);
    } catch (error) {
      console.log("Error loading ongoing treatments:", error);
      console.log("Error details:", error.response?.data || error.message);
      setGroupedAppointments({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Optimized refresh handler
  const onRefreshCurrent = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Listen for tab focus to trigger data fetch
  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded) {
        fetchData();
      }
    }, [hasLoaded, fetchData])
  );

  const handleOtherSubmit = useCallback(
    async otherFormData => {
      try {
        if (!otherFormData.behalfUserId) {
          setLoadingSubmit(true);

          const [day, month, year] = otherFormData.birthdate.split("/");
          const dateOfBirth = new Date(year, month - 1, day);

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
            ...(otherFormData.parentalConsent !== undefined && { parentalConsent: otherFormData.parentalConsent }),
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
              otherFormData.behalfUserId = response.data.newBehalfUser._id;
            },
          });
        }

        setShowOtherModal(false);
        navigation.navigate("SurveyDetails", {
          form: { name: "Other", ...otherFormData },
        });
      } catch (error) {
        console.log("Error in handleOtherSubmit:", error);
      } finally {
        setLoadingSubmit(false);
      }
    },
    [dispatch, navigation]
  );

  // Memoized empty state check
  const isEmpty = useMemo(
    () => Object.keys(groupedAppointments).length === 0,
    [groupedAppointments]
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshCurrent}
            colors={["#01869e"]}
            tintColor="#01869e"
            title="Pull to refresh..."
            titleColor="#01869e"
          />
        }
      >
        {isEmpty ? (
          <EmptyState message="No ongoing treatments found" icon="medical-bag" />
        ) : (
          <>
            {Object.entries(groupedAppointments).map(([doctorId, doctorData]) => (
              <View key={doctorId}>
                {renderDoctorSection(doctorId, doctorData, navigation)}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setShowChoiceModal(true)}>
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.floatingButtonText}>New</Text>
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
                  <MaterialCommunityIcons name="account-multiple" size={16} color={COLORS.white} />
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
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexGrow: 1,
    paddingBottom: 80, // Add padding to account for floating button
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: "#01869e",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  doctorSection: {
    marginBottom: 12,
  },
  doctorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  doctorContent: {
    padding: 12,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  doctorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  doctorAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#01869e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  doctorAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  appointmentsContainer: {
    marginTop: 8,
  },
  appointmentCardWrapper: {
    marginBottom: 8,
  },
  appointmentSubCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#01869e",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 60,
  },
  appointmentContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  appointmentIconContainer: {
    marginRight: 12,
    backgroundColor: "#e8f4f8",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentForText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    flex: 1,
  },
  appointmentCount: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: "center",
  },
  showMoreButton: {
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
    marginTop: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#01869e20",
  },
  showMoreContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  showMoreText: {
    fontSize: 12,
    color: "#01869e",
    fontWeight: "500",
    marginLeft: 4,
  },
  parentAppointmentContainer: {
    marginBottom: 8,
  },
  childAppointmentsContainer: {
    marginLeft: 16,
    marginTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#e8f4f8",
    paddingLeft: 8,
  },
  childAppointmentCard: {
    backgroundColor: "#f0f8ff",
    borderLeftColor: "#01869e80",
    marginBottom: 4,
  },
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
    flex: 1,
    overflow: "hidden",
  },
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 12,
    padding: 12,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skeletonDoctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonAppointments: {
    marginTop: 8,
  },
  skeletonAppointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#e0e0e0",
  },
});

// Main CurrentTreatmentScreen component
const CurrentTreatmentScreen = ({ navigation }) => {
  return (
    <>
      <Header title="Treatments" onBackPress={() => navigation.goBack()} />
      <CurrentTreatments navigation={navigation} />
    </>
  );
};

export default CurrentTreatmentScreen;
