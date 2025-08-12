import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color } from "../constants/GlobalStyles";

const UpcomingAppointmentCard = ({ appointment, borderColor }) => {
  const { _id, doctorDetails, behalfUserId, symptoms, date } = appointment;

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

  // Get behalf user info - check if appointment is for someone else
  const behalfUserName = behalfUserId
    ? [behalfUserId.firstName, behalfUserId.middleName, behalfUserId.lastName]
        .filter(name => name && name.trim()) // Remove empty/null/undefined values
        .join(" ") // Join with single spaces
    : null;

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

  return (
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
              {behalfUserId?.relationship && ` (${behalfUserId.relationship})`}
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
      </Card.Content>
    </Card>
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
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  doctorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "500",
  },
  behalfInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  behalfText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    fontWeight: "500",
  },
  symptomsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8F8F8",
  },
  symptomsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  symptomsHeaderText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginLeft: 6,
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  symptomTag: {
    backgroundColor: "#E8F4FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 12,
    color: "#2C5282",
    fontWeight: "500",
  },
});

export default UpcomingAppointmentCard;
