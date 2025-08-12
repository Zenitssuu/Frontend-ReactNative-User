import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getSavedDoctors, removeDoctor } from "../utils/storage";
import { DoctorCard, EmptyState, LoadingSpinner } from "../components/UIComponents";
import { Header } from "../components/UIComponents";
import { Color } from "../constants/GlobalStyles";
import apiService from "../services/api";

const MyDoctorsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Get
  const getDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiService.profile.getDoctors();

      if (response.status === 200 || response.status === 201) {
        // Transform the API response to match the expected format
        const transformedDoctors = response.data.data.map(doctor => ({
          id: doctor._id,
          doctorId: doctor.doctorId,
          name: `${doctor.firstName} ${doctor.middleName ? doctor.middleName + " " : ""}${doctor.lastName}`.trim(),
          profileImage: doctor.profileImage || null, // Will fall back to text avatar if no image
          firstName: doctor.firstName,
          middleName: doctor.middleName,
          lastName: doctor.lastName,
          gender: doctor.gender,
          specialty: doctor.professionalDetails?.specialization?.[0] || "General",
          qualification: doctor.professionalDetails?.qualification?.join(", ") || "",
          experience: doctor.professionalDetails?.yearsOfExperience || "",
          areaOfExpertise: doctor.professionalDetails?.areaOfExpertise?.join(", ") || "",
          registrationNumber: doctor.professionalDetails?.registrationNumber || "",
          medicalCouncil: doctor.professionalDetails?.medicalCouncil || "",
          location: doctor.practiceInfo?.[0]?.hospitalName || "",
          hospitalName: doctor.practiceInfo?.[0]?.hospitalName || "",
          designation: doctor.practiceInfo?.[0]?.designation || "",
          departmentName: doctor.practiceInfo?.[0]?.departmentName || "",
          practiceAddress: doctor.practiceInfo?.[0]?.practiceAddress || "",
          practiceState: doctor.practiceInfo?.[0]?.practiceState || "",
          practiceDistrict: doctor.practiceInfo?.[0]?.practiceDistrict || "",
          UDI_id: doctor.UDI_id,
          isVerified: doctor.isVerified,
          requestStatus: doctor.requestStatus,
          isFavorite: false, // Initialize as false, can be updated later
        }));

        setDoctors(transformedDoctors);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    // Filter doctors based on search query and active filter
    let filtered = doctors;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor => {
        const fullName = doctor.name.toLowerCase();
        const specialty = (doctor.specialty || "").toLowerCase();
        const qualification = (doctor.qualification || "").toLowerCase();
        const hospitalName = (doctor.hospitalName || "").toLowerCase();

        return (
          fullName.includes(searchQuery.toLowerCase()) ||
          specialty.includes(searchQuery.toLowerCase()) ||
          qualification.includes(searchQuery.toLowerCase()) ||
          hospitalName.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const handleSearchChange = query => {
    setSearchQuery(query);
  };

  const handleToggleFavorite = async doctor => {
    const updatedDoctors = doctors.map(d => {
      if (d.id === doctor.id) {
        return { ...d, isFavorite: !d.isFavorite };
      }
      return d;
    });

    setDoctors(updatedDoctors);

    // Update favorites
    const updatedFavorites = updatedDoctors.filter(d => d.isFavorite).map(d => d.id);
    setFavorites(updatedFavorites);

    // Save to storage
    await getSavedDoctors();
  };

  const handleSelectDoctor = doctor => {
    if (route.params?.fromSurvey) {
      // If coming from symptom survey, pass survey data to BookAppointment
      navigation.navigate("BookAppointment", {
        doctor,
        surveyDetails: route.params.surveyDetails,
        answersWithLabels: route.params.answersWithLabels,
        form: route.params.form,
        symptoms: route.params.symptoms,
      });
    } else {
      // Regular navigation to BookAppointment
      navigation.navigate("DoctorDetails", { doctorId: doctor.UDI_id });
    }
  };

  const navigateToScanQR = () => {
    navigation.navigate("Scan QR");
  };

  const renderDoctorItem = ({ item }) => {
    return (
      <DoctorCard
        doctor={item}
        onPress={() => handleSelectDoctor(item)}
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* New Header Design */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Saved Doctors</Text>
          <TouchableOpacity style={styles.addDoctorButton} onPress={navigateToScanQR}>
            <MaterialCommunityIcons name="plus" size={20} color="white" />
            <Text style={styles.addDoctorText}>Add Doctor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {filteredDoctors.length > 0 ? (
          <FlatList
            data={filteredDoctors}
            renderItem={renderDoctorItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              message={
                searchQuery
                  ? "No doctors found matching your search."
                  : "No doctors found. Add doctors by scanning their QR code."
              }
              icon="doctor"
            />
            <TouchableOpacity style={styles.addDoctorButton} onPress={navigateToScanQR}>
              <MaterialCommunityIcons name="plus" size={20} color="white" />
              <Text style={styles.addDoctorText}>Add new doctor</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bcBackground,
  },
  headerContainer: {
    backgroundColor: Color.headingColor,
    paddingTop: 50, // Add top padding for status bar
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Color.colorWhite,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  searchBar: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addDoctorButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  addDoctorText: {
    color: Color.colorWhite,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MyDoctorsScreen;
