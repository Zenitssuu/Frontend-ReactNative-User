import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AppointmentCard = ({ appointment }) => {
  const {
    _id,
    date,
    startTime,
    endTime,
    location,
    bookingStatus,
    symptoms,
    doctorDetails,
    otherDetails,
  } = appointment;

  const formattedDate = date ? new Date(date).toDateString() : "N/A";
  const fullName = `${doctorDetails?.firstName || ""} ${
    doctorDetails?.middleName || ""
  } ${doctorDetails?.lastName || ""}`.trim();
  const specialization = doctorDetails?.professionalDetails?.specialization?.[0] || "";

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          {doctorDetails?.profileImage ? (
            <Image source={{ uri: doctorDetails.profileImage }} style={styles.image} />
          ) : (
            <MaterialCommunityIcons name="account-circle" size={48} color="#ccc" />
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>Dr. {fullName}</Text>
            <Text style={styles.specialty}>{specialization}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={16} />
          <Text style={styles.infoText}> {formattedDate}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="clock" size={16} />
          <Text style={styles.infoText}>
            {(typeof startTime === "object" ? startTime?.startTime : startTime) || "N/A"} -
            {(typeof endTime === "object" ? endTime?.endTime : endTime) || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={16} />
          <Text style={styles.infoText}> {location}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account" size={16} />
          {otherDetails ? (
            otherDetails.name === "Self" ? (
              <Text style={styles.infoText}>For: {otherDetails.name}</Text>
            ) : (
              <Text style={styles.infoText}>
                For: {otherDetails.name} ({otherDetails.relation}) — {otherDetails.gender}, Age:{" "}
                {otherDetails.age}
              </Text>
            )
          ) : (
            <Text style={styles.infoText}>For: Self</Text>
          )}
        </View>

        <Text style={styles.status}>Status: {bookingStatus}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 14,
    color: "#555",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#333",
  },
  status: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#007bff",
  },
});

export default AppointmentCard;
