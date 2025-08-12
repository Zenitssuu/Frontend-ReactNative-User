import AsyncStorage from "@react-native-async-storage/async-storage";

// User Profile
export const saveUserProfile = async profileData => {
  try {
    await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userProfile");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Saved Doctors
export const saveDoctorsList = async doctors => {
  try {
    await AsyncStorage.setItem("savedDoctors", JSON.stringify(doctors));
    return true;
  } catch (error) {
    console.error("Error saving doctors list:", error);
    return false;
  }
};

export const getSavedDoctors = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("savedDoctors");
    const savedDoctors = jsonValue != null ? JSON.parse(jsonValue) : [];

    // If no saved doctors, return dummy data
    if (savedDoctors.length === 0) {
      const rawDummyDoctors = [
        {
          _id: "685d051fe481bf23798fc23f",
          doctorId: "685d0510e481bf23798fc239",
          firstName: "Ankan",
          middleName: "Kumar",
          lastName: "Chakraborty",
          gender: "Female",
          UDI_id: "DAGMONC517056",
          dob: "2004-06-10T00:00:00.000Z",
          isVerified: true,
          isActive: true,
          // profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
          profileImage:
            "https://me-app-tellyoudoc.s3.ap-south-1.amazonaws.com/doctor/685d0510e481bf23798fc239/profile/9a168173-8926-4522-8560-5e690769aa2d.jpg",
          contact: {
            phone: "+91-9876543210",
            email: "alice.johnson@hospital.com",
          },
          address: {
            city: "Dimapur",
            state: "Nagaland",
            pin: "797112",
          },
          professionalDetails: {
            specialization: ["Oncology", "Radiology"],
            areaOfExpertise: ["Breast Cancer", "Lung Cancer", "Chemotherapy"],
            qualification: [
              "MBBS - AIIMS, Delhi",
              "MD - Oncology, Tata Memorial",
              "DM - Radiology, PGI Chandigarh",
            ],
            yearsOfExperience: 15,
            languagesSpoken: ["English", "Hindi", "Assamese"],
            registrationNumber: "NMC123456",
            certifications: [
              "Advanced Oncology Research Grant - WHO",
              "Fellowship in Interventional Oncology - Harvard Medical",
            ],
          },
          clinicDetails: [
            {
              location: "Dimapur Local, Dimapur",
              daysAvailable: ["Mon", "Wed", "Fri"],
              timeSlots: [
                {
                  startTime: "10:00 AM",
                  endTime: "11:00 AM",
                  maxPatients: 3,
                  isActive: true,
                  status: "available",
                  _id: "slot1",
                },
                {
                  startTime: "2:00 PM",
                  endTime: "3:00 PM",
                  maxPatients: 2,
                  isActive: true,
                  status: "available",
                  _id: "slot2",
                },
              ],
            },
            {
              location: "City Hospital, Kohima",
              daysAvailable: ["Tue", "Thu"],
              timeSlots: [
                {
                  startTime: "9:30 AM",
                  endTime: "10:30 AM",
                  maxPatients: 4,
                  isActive: true,
                  status: "available",
                  _id: "slot3",
                },
                {
                  startTime: "4:00 PM",
                  endTime: "5:00 PM",
                  maxPatients: 1,
                  isActive: true,
                  status: "available",
                  _id: "slot4",
                },
              ],
            },
          ],
          about:
            "Dr. Alice Johnson is a highly experienced oncologist specializing in early detection, diagnosis, and treatment of cancer. She brings over 15 years of expertise and is known for her compassionate approach to patient care.",
          rating: 4.9,
          reviewsCount: 120,
          isFavorite: true,
          consultationFee: {
            online: 500,
            offline: 700,
          },
        },
      ];

      const normalizeDoctor = raw => ({
        id: raw._id || raw.doctorId || Date.now().toString(),
        name: `Dr. ${raw.firstName || ""} ${raw.middleName || ""} ${raw.lastName || ""}`.trim(),
        specialty: raw.professionalDetails?.specialization?.[0] || "General",
        photo: raw.profileImage,
        locations: raw.clinicDetails?.map(c => ({
          locationName: c.location,
          daysAvailable: c.daysAvailable,
          timeSlots: {
            morning: c.timeSlots.filter(slot => slot.startTime.includes("AM")),
            afternoon: c.timeSlots.filter(slot => {
              const hour = parseInt(slot.startTime);
              return hour >= 12 && hour < 4;
            }),
            evening: c.timeSlots.filter(slot => {
              const hour = parseInt(slot.startTime);
              return slot.startTime.includes("PM") && hour >= 4;
            }),
          },
        })),
      });

      const normalizedDoctors = rawDummyDoctors.map(normalizeDoctor);

      await saveDoctorsList(normalizedDoctors);
      return normalizedDoctors;
    }

    return savedDoctors;
  } catch (error) {
    console.error("Error getting saved doctors:", error);
    return [];
  }
};

export const addDoctor = async doctorData => {
  try {
    const currentDoctors = await getSavedDoctors();
    // Check if doctor already exists
    const doctorExists = currentDoctors.some(doctor => doctor.id === doctorData.id);
    if (!doctorExists) {
      const updatedDoctors = [...currentDoctors, doctorData];
      await saveDoctorsList(updatedDoctors);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding doctor:", error);
    return false;
  }
};

export const removeDoctor = async doctorId => {
  try {
    const currentDoctors = await getSavedDoctors();
    const updatedDoctors = currentDoctors.filter(doctor => doctor.id !== doctorId);
    await saveDoctorsList(updatedDoctors);
    return true;
  } catch (error) {
    console.error("Error removing doctor:", error);
    return false;
  }
};

// Appointments
export const saveAppointments = async appointments => {
  try {
    await AsyncStorage.setItem("appointments", JSON.stringify(appointments));
    return true;
  } catch (error) {
    console.error("Error saving appointments:", error);
    return false;
  }
};

export const getAppointments = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("appointments");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error getting appointments:", error);
    return [];
  }
};

export const addAppointment = async appointmentData => {
  try {
    const currentAppointments = await getAppointments();
    const updatedAppointments = [...currentAppointments, appointmentData];
    await saveAppointments(updatedAppointments);
    return true;
  } catch (error) {
    console.error("Error adding appointment:", error);
    return false;
  }
};

export const updateAppointment = async (appointmentId, updatedData) => {
  try {
    const currentAppointments = await getAppointments();
    const updatedAppointments = currentAppointments.map(appointment =>
      appointment._id === appointmentId ? { ...appointment, ...updatedData } : appointment
    );
    await saveAppointments(updatedAppointments);
    return true;
  } catch (error) {
    console.error("Error updating appointment:", error);
    return false;
  }
};

// Documents and Prescriptions
export const saveDocuments = async documents => {
  try {
    await AsyncStorage.setItem("documents", JSON.stringify(documents));
    return true;
  } catch (error) {
    console.error("Error saving documents:", error);
    return false;
  }
};

export const getDocuments = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("documents");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
};

export const addDocument = async documentData => {
  try {
    const currentDocuments = await getDocuments();
    const updatedDocuments = [...currentDocuments, documentData];
    await saveDocuments(updatedDocuments);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
};

export const getDocumentsByAppointment = async appointmentId => {
  try {
    const allDocuments = await getDocuments();
    return allDocuments.filter(doc => doc.appointmentId === appointmentId);
  } catch (error) {
    console.error("Error getting documents by appointment:", error);
    return [];
  }
};

// Symptom Surveys
export const saveSurveys = async surveys => {
  try {
    await AsyncStorage.setItem("symptomSurveys", JSON.stringify(surveys));
    return true;
  } catch (error) {
    console.error("Error saving symptom surveys:", error);
    return false;
  }
};

export const getSurveys = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("symptomSurveys");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error getting symptom surveys:", error);
    return [];
  }
};

export const addSurvey = async surveyData => {
  try {
    const currentSurveys = await getSurveys();
    // Add unique ID and timestamp to survey
    const surveyWithMetadata = {
      ...surveyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedSurveys = [...currentSurveys, surveyWithMetadata];
    await saveSurveys(updatedSurveys);
    return surveyWithMetadata;
  } catch (error) {
    console.error("Error adding symptom survey:", error);
    return null;
  }
};

export const getSurveysByAppointment = async appointmentId => {
  try {
    const allSurveys = await getSurveys();
    return allSurveys.filter(survey => survey.appointmentId === appointmentId);
  } catch (error) {
    console.error("Error getting surveys by appointment:", error);
    return [];
  }
};
