import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Searchbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getSavedDoctors, removeDoctor } from "../utils/storage";
import { DoctorCard, EmptyState, LoadingSpinner } from "../components/UIComponents";
import { Header } from "../components/UIComponents";
import { Color } from "../constants/GlobalStyles";
import apiService from "../services/api";

const MyDoctorsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Get doctors function
  const getDoctors = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
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
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Handle pull to refresh
  const onRefresh = () => {
    getDoctors(true);
  };

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
      <Header title={"My Doctors"} onBackPress={() => navigation.goBack()} rightComponent={null} />
      <View style={styles.contentContainer}>
        {/* <Searchbar
          placeholder="Search doctors by name or specialty"
          onChangeText={handleSearchChange}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#0077B6"
        /> */}

        {/* {renderFilterChips()} */}

        {filteredDoctors.length > 0 ? (
          <FlatList
            data={filteredDoctors}
            renderItem={renderDoctorItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Color.headingColor]} // Android
                tintColor={Color.headingColor} // iOS
              />
            }
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

        {filteredDoctors.length > 0 && (
          <TouchableOpacity style={styles.addDoctorFloatingButton} onPress={navigateToScanQR}>
            <MaterialCommunityIcons name="plus" size={20} color="white" />
            <Text style={styles.addDoctorFloatingText}>Scan & Add Doctor</Text>
          </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  searchBar: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  // filtersContainer: {
  //   marginBottom: 16,
  // },
  // filtersContent: {
  //   paddingRight: 16,
  // },
  // filterChip: {
  //   marginRight: 8,
  //   backgroundColor: "#f0f0f0",
  // },
  // activeFilterChip: {
  //   backgroundColor: "#0077B6",
  // },
  // filterChipText: {
  //   color: "#555",
  // },
  // activeFilterChipText: {
  //   color: "white",
  // },
  listContent: {
    paddingBottom: 80, // to account for the floating button
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addDoctorButton: {
    flexDirection: "row",
    backgroundColor: Color.headingColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  addDoctorText: {
    color: Color.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addDoctorFloatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: Color.headingColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 8,
  },
  addDoctorFloatingText: {
    color: Color.colorWhite,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MyDoctorsScreen;
