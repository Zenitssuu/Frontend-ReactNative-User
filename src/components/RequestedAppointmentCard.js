import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import Modal from "react-native-modal";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color } from "../constants/GlobalStyles";
import apiService from "../services/api";

const RequestedAppointmentCard = ({ appointment, onCancel, borderColor }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { _id, bookingStatus, doctorDetails, behalfUserId, symptoms, date } = appointment;

  // Create doctor's full name
  const doctorFullName = [
    doctorDetails?.firstName,
    doctorDetails?.middleName,
    doctorDetails?.lastName,
  ]
    .filter(name => name && name.trim()) // Remove empty/null/undefined values
    .join(" "); // Join with single spaces

  // Create doctor's initials for avatar
  const getInitials = name => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const doctorInitials = getInitials(doctorFullName);

  // Get behalf user details - check if appointment is for someone else
  const behalfUserName = behalfUserId
    ? [behalfUserId.firstName, behalfUserId.middleName, behalfUserId.lastName]
        .filter(name => name && name.trim()) // Remove empty/null/undefined values
        .join(" ") // Join with single spaces
    : null;
  const behalfUserRelation = behalfUserId?.relationship || null;

  // Format appointment date
  const formatAppointmentDate = dateString => {
    if (!dateString) return "Date not available";

    try {
      const appointmentDate = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if it's today
      if (appointmentDate.toDateString() === today.toDateString()) {
        return "Today";
      }

      // Check if it's tomorrow
      if (appointmentDate.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      }

      // Format as readable date
      return appointmentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: appointmentDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formattedDate = formatAppointmentDate(date);

  // Extract and format symptoms
  const getSymptomsList = symptomsArray => {
    if (!symptomsArray || !Array.isArray(symptomsArray)) return [];

    const symptomsList = [];

    // Process each symptom object in the array
    symptomsArray.forEach(symptomObj => {
      // General symptoms
      if (symptomObj.generalSymptoms) {
        Object.keys(symptomObj.generalSymptoms).forEach(symptom => {
          const symptomData = symptomObj.generalSymptoms[symptom];

          // Format the symptom name
          const formattedSymptom =
            symptom.charAt(0).toUpperCase() + symptom.slice(1).replace("-", " ");

          // Add detailed information if available
          if (typeof symptomData === "object" && symptomData !== null) {
            const details = [];

            // Add specific details based on symptom type
            if (symptom === "vomiting") {
              if (symptomData.vomitingDuration) details.push(symptomData.vomitingDuration);
              if (symptomData.vomitingColor) details.push(symptomData.vomitingColor);
            } else if (symptom === "fever") {
              if (symptomData.feverGrade) details.push(symptomData.feverGrade);
            } else if (symptom === "bleeding") {
              if (symptomData.bleedingBloodlossAmount)
                details.push(symptomData.bleedingBloodlossAmount);
              if (symptomData.bleedingDifficultyToStop === "Yes") details.push("Difficult to stop");
            } else if (symptom === "headache") {
              if (symptomData.headachePosition)
                details.push(symptomData.headachePosition.join(", "));
              if (symptomData.headacheFrequency) details.push(symptomData.headacheFrequency);
            } else if (symptom === "hair-loss") {
              if (symptomData.hairlossConfirmation === "Yes") details.push("Confirmed");
              if (symptomData.hairlossScalploss)
                details.push(symptomData.hairlossScalploss.join(", "));
            }

            // Add the symptom with details if available
            if (details.length > 0) {
              symptomsList.push(`${formattedSymptom} (${details.join(", ")})`);
            } else {
              symptomsList.push(formattedSymptom);
            }
          } else {
            symptomsList.push(formattedSymptom);
          }
        });
      }

      // Body parts symptoms
      if (symptomObj.bodyParts) {
        Object.keys(symptomObj.bodyParts).forEach(bodyPart => {
          if (bodyPart !== "others") {
            symptomsList.push(`${bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)} issues`);
          }
        });
      }

      // Body excretion symptoms
      if (symptomObj.bodyExcretion) {
        Object.keys(symptomObj.bodyExcretion).forEach(excretion => {
          symptomsList.push(`${excretion.charAt(0).toUpperCase() + excretion.slice(1)} issues`);
        });
      }

      // Skin symptoms
      if (symptomObj.skin && symptomObj.skin["my-skin"]) {
        symptomsList.push("Skin issues");
      }

      // Others symptoms
      if (symptomObj.others?.others || symptomObj.bodyParts?.others) {
        const othersData = symptomObj.others?.others || symptomObj.bodyParts?.others;
        Object.keys(othersData).forEach(key => {
          if (othersData[key] === "Yes" || othersData[key] === true) {
            const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase();
            symptomsList.push(formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1));
          }
        });
      }
    });

    return symptomsList.slice(0, 5); // Limit to first 5 symptoms
  };

  const symptomsList = getSymptomsList(symptoms);

  // Handle cancel appointment
  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    setIsLoading(true);

    try {
      const response = await apiService.appointments.cancelAppointment(_id);

      if (response.status === 200) {
        ToastAndroid.show("Appointment cancelled successfully", ToastAndroid.SHORT);

        if (onCancel) {
          onCancel(_id);
        }
      } else {
        ToastAndroid.show("Failed to cancel appointment", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      Alert.alert("Error", error.message || "Failed to cancel appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };

  // Get status color
  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return "#28A745";
      case "cancelled":
        return "#DC3545";
      case "completed":
        return "#6C757D";
      default:
        return "#007BFF";
    }
  };

  return (
    <>
      <Card style={[styles.card, { borderColor: borderColor || "#F0F0F0" }]}>
        <Card.Content style={styles.cardContent}>
          {/* Doctor Header */}
          <View style={styles.header}>
            {doctorDetails?.profileImage ? (
              <Image source={{ uri: doctorDetails.profileImage }} style={styles.doctorImage} />
            ) : (
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{doctorInitials}</Text>
              </View>
            )}
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. {doctorFullName}</Text>
              <Text style={styles.specialty}>
                {doctorDetails?.professionalDetails?.specialization?.[0] || "General Physician"}
              </Text>
            </View>
          </View>

          {/* Appointment Date */}
          <View style={styles.dateInfo}>
            <MaterialCommunityIcons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {/* Behalf User Info */}
          {behalfUserName && (
            <View style={styles.behalfInfo}>
              <MaterialCommunityIcons name="account-multiple" size={16} color="#666" />
              <Text style={styles.behalfText}>
                Appointment for: {behalfUserName}
                {behalfUserRelation && ` (${behalfUserRelation})`}
              </Text>
            </View>
          )}

          {/* Symptoms Info */}
          {symptomsList.length > 0 && (
            <View style={styles.symptomsContainer}>
              <View style={styles.symptomsHeader}>
                <MaterialCommunityIcons name="medical-bag" size={16} color="#666" />
                <Text style={styles.symptomsHeaderText}>Symptoms:</Text>
              </View>
              <View style={styles.symptomsGrid}>
                {symptomsList.map((symptom, index) => (
                  <View key={index} style={styles.symptomTag}>
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ))}
                {symptomsList.length === 5 && (
                  <View style={styles.symptomTag}>
                    <Text style={styles.symptomText}>...</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Status and Cancel Button Row */}
          <View style={styles.statusActionRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(bookingStatus) + "15",
                  borderColor: getStatusColor(bookingStatus) + "40",
                },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor(bookingStatus) }]}>
                {bookingStatus?.charAt(0).toUpperCase() + bookingStatus?.slice(1)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.cancelButton, isLoading && styles.cancelButtonDisabled]}
              onPress={handleCancel}
              disabled={isLoading || bookingStatus === "cancelled"}
            >
              {isLoading ? (
                <MaterialCommunityIcons name="loading" size={14} color="#fff" />
              ) : (
                <MaterialCommunityIcons name="close" size={14} color="#fff" />
              )}
              <Text style={styles.cancelButtonText}>{isLoading ? "Cancelling..." : "Cancel"}</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDismiss}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#DC3545" />
              <Text style={styles.modalTitle}>Cancel Appointment</Text>
            </View>

            <Text style={styles.modalMessage}>
              Are you sure you want to cancel this appointment?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={handleCancelDismiss}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButtonPrimary} onPress={handleCancelConfirm}>
                <Text style={styles.modalButtonPrimaryText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F8F8",
  },
  doctorImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E8F4FD",
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Color.bcHeader,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8F4FD",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  doctorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 1,
  },
  specialty: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#495057",
    marginLeft: 6,
    fontWeight: "600",
  },
  behalfInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: Color.bcHeader,
  },
  behalfText: {
    fontSize: 13,
    color: "#495057",
    marginLeft: 6,
    fontWeight: "500",
  },
  statusActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 70,
  },
  cancelButtonDisabled: {
    backgroundColor: "#ADB5BD",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 3,
  },
  symptomsContainer: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FAFBFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  symptomsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  symptomsHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#495057",
    marginLeft: 6,
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  symptomTag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    marginRight: 4,
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 11,
    color: "#1976D2",
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#495057",
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C757D",
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#DC3545",
    alignItems: "center",
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export default RequestedAppointmentCard;
