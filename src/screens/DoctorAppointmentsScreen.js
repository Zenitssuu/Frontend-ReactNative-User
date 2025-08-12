import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Pressable,
} from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header, EmptyState, LoadingSpinner } from "../components/UIComponents";
import { Color } from "../constants/GlobalStyles";

const DoctorAppointmentsScreen = ({ navigation, route }) => {
  const { doctor, appointments: initialAppointments } = route.params || {};
  const [appointments, setAppointments] = useState(initialAppointments || []);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sort appointments by date (newest first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const formatTime = timeString => {
    if (!timeString) return "N/A";

    // Handle different time formats
    if (typeof timeString === "object") {
      return timeString?.startTime || timeString?.endTime || "N/A";
    }

    // If time already includes AM/PM, return as-is but format properly
    if (timeString.toLowerCase().includes("am") || timeString.toLowerCase().includes("pm")) {
      return timeString.replace(/\s*(am|pm)\s*/i, (match, ampm) => ` ${ampm.toUpperCase()}`);
    }

    // Convert 24-hour format to 12-hour format with AM/PM
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDate = dateString => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if it's today
      if (date.toDateString() === today.toDateString()) {
        return "Today";
      }

      // Check if it's tomorrow
      if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      }

      // Format as readable date
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#4CAF50";
      case "booked":
        return "#2196F3";
      case "pending":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getStatusText = status => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "booked":
        return "Booked";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  const getInitials = (firstName, middleName, lastName) => {
    const names = [firstName, middleName, lastName].filter(name => name && name.trim());
    return names
      .map(name => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you would refetch the appointments here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderAppointmentCard = appointment => {
    const startTime = formatTime(appointment.startTime);
    const endTime = formatTime(appointment.endTime);
    const appointmentDate = formatDate(appointment.date);
    const statusColor = getStatusColor(appointment.bookingStatus);
    const statusText = getStatusText(appointment.bookingStatus);

    return (
      <Pressable
        key={appointment._id}
        onPress={() =>
          navigation.navigate("VisitDetails", {
            appDetails: appointment,
          })
        }
      >
        <Card style={styles.appointmentCard}>
          <Card.Content style={styles.cardContent}>
            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{statusText}</Text>
              </View>
            </View>

            {/* Date and Time */}
            <View style={styles.dateTimeSection}>
              <View style={styles.dateTimeRow}>
                <MaterialCommunityIcons name="calendar-outline" size={20} color="#01869e" />
                <Text style={styles.dateText}>{appointmentDate}</Text>
              </View>
              <View style={styles.dateTimeRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#01869e" />
                <Text style={styles.timeText}>
                  {startTime} - {endTime}
                </Text>
              </View>
            </View>

            {/* Location */}
            {appointment.location && (
              <View style={styles.locationSection}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" />
                <Text style={styles.locationText}>{appointment.location}</Text>
              </View>
            )}

            {/* Behalf User Info */}
            {appointment.behalfUserId && (
              <View style={styles.behalfSection}>
                <MaterialCommunityIcons name="account-multiple-outline" size={20} color="#666" />
                <Text style={styles.behalfText}>
                  For: {appointment.behalfUserId.firstName} {appointment.behalfUserId.lastName}
                  {appointment.behalfUserId.relationship &&
                    ` (${appointment.behalfUserId.relationship})`}
                </Text>
              </View>
            )}

            {/* Appointment ID */}
            <View style={styles.appointmentIdSection}>
              <Text style={styles.appointmentIdLabel}>Appointment ID:</Text>
              <Text style={styles.appointmentIdText}>
                {appointment.appointmentId || appointment._id}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Pressable>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  if (!doctor) {
    return (
      <>
        <Header title="Doctor Appointments" onBackPress={() => navigation.goBack()} />
        <EmptyState message="Doctor information not found" icon="doctor" />
      </>
    );
  }

  const doctorFullName = [doctor.firstName, doctor.middleName, doctor.lastName]
    .filter(name => name && name.trim())
    .join(" ");

  const doctorInitials = getInitials(doctor.firstName, doctor.middleName, doctor.lastName);

  const specialization = doctor.professionalDetails?.specialization?.[0] || "General Physician";

  const isEmpty = sortedAppointments.length === 0;

  return (
    <>
      <Header title="Doctor Appointments" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Color.bcHeader]}
            tintColor={Color.bcHeader}
          />
        }
      >
        {/* Doctor Header */}
        <Card style={styles.doctorHeaderCard}>
          <Card.Content style={styles.doctorHeaderContent}>
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
                <Text style={styles.appointmentCount}>
                  {sortedAppointments.length} appointment
                  {sortedAppointments.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Appointments List */}
        {isEmpty ? (
          <EmptyState message="No appointments found for this doctor" icon="calendar-blank" />
        ) : (
          <View style={styles.appointmentsList}>
            <Text style={styles.sectionTitle}>All Appointments</Text>
            {sortedAppointments.map(appointment => renderAppointmentCard(appointment))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8F9FA",
    flexGrow: 1,
  },
  doctorHeaderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  doctorHeaderContent: {
    padding: 16,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  doctorAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#01869e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  doctorAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  appointmentCount: {
    fontSize: 12,
    color: "#01869e",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  statusContainer: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  dateTimeSection: {
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#01869e",
    fontWeight: "500",
    marginLeft: 8,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  behalfSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  behalfText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    fontStyle: "italic",
  },
  appointmentIdSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  appointmentIdLabel: {
    fontSize: 12,
    color: "#999",
    marginRight: 8,
  },
  appointmentIdText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
});

export default DoctorAppointmentsScreen;
