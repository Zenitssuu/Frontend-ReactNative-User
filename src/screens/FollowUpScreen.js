import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from "react-native";
import { Card, Divider } from "react-native-paper";
import { updateAppointment, getAppointments } from "../utils/storage";
import { PrimaryButton, SecondaryButton, LoadingSpinner } from "../components/UIComponents";

const FollowUpScreen = ({ route, navigation }) => {
  const { appointmentId, doctorName } = route.params;

  const [loading, setLoading] = useState(true);
  const [followUpText, setFollowUpText] = useState("");
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const loadAppointment = async () => {
      const allAppointments = await getAppointments();
      const foundAppointment = allAppointments.find(app => app._id === appointmentId);

      if (foundAppointment) {
        setAppointment(foundAppointment);

        // Pre-populate with existing follow-up text if it exists
        if (foundAppointment.followUp) {
          setFollowUpText(foundAppointment.followUp);
        }
      } else {
        Alert.alert("Error", "Appointment not found");
        navigation.goBack();
      }

      setLoading(false);
    };

    loadAppointment();
  }, [appointmentId, navigation]);

  const handleSubmit = async () => {
    if (!followUpText.trim()) {
      Alert.alert("Error", "Please enter follow-up details");
      return;
    }

    try {
      setLoading(true);

      // Update the appointment with follow-up information
      await updateAppointment(appointmentId, {
        followUp: followUpText,
        hasFollowUp: true,
        followUpDate: new Date().toISOString(),
      });

      setLoading(false);

      // Show success message
      Alert.alert("Follow-Up Added", "Your follow-up has been submitted successfully", [
        {
          text: "Upload Documents",
          onPress: () => navigation.navigate("UploadDocument", { appointmentId, doctorName }),
        },
        {
          text: "Done",
          onPress: () => navigation.navigate("VisitDetails", { appointmentId }),
          style: "default",
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to submit follow-up");
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Appointment Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Follow-up for Appointment</Text>
          <Divider style={styles.divider} />

          <Text style={styles.doctorName}>Dr. {doctorName}</Text>
          {appointment && (
            <Text style={styles.appointmentDate}>Visit Date: {formatDate(appointment.date)}</Text>
          )}

          {appointment && appointment.reason && (
            <View style={styles.reasonSection}>
              <Text style={styles.reasonLabel}>Original Reason for Visit:</Text>
              <Text style={styles.reasonText}>{appointment.reason}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Follow-up Form */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Follow-up Details</Text>
          <Divider style={styles.divider} />

          <Text style={styles.inputLabel}>Please describe any issues or follow-up concerns:</Text>
          <TextInput
            style={styles.textArea}
            value={followUpText}
            onChangeText={setFollowUpText}
            placeholder="Enter your follow-up details here, including any symptoms, concerns, or questions for the doctor..."
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />

          <Text style={styles.helpText}>
            This information will be shared with your doctor. You can also upload documents after
            submitting.
          </Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Submit Follow-up"
          onPress={handleSubmit}
          disabled={!followUpText.trim()}
        />
        <SecondaryButton title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  appointmentDate: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  reasonSection: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f0f7fa",
    borderRadius: 6,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#555",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 200,
    backgroundColor: "white",
    color: "#333",
  },
  helpText: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

export default FollowUpScreen;
