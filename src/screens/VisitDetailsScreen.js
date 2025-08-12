import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  RefreshControl,
  Animated,
  ToastAndroid,
  Linking,
  Share,
} from "react-native";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import DocumentUploader from "../components/DocumentUploader";
import UploadedDocumentItem from "../components/UploadedDocumentItem";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAppointments, getSavedDoctors } from "../utils/storage"; // Import your storage functions
import apiService from "../services/api";
import { createMultipleFileFormData } from "../services/apiUtils";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// const Tab = createMaterialTopTabNavigator();

// Helper function to get doctor initials
const getInitials = (firstName, middleName, lastName) => {
  const names = [firstName, middleName, lastName].filter(name => name && name.trim());
  return names
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Symptom group color mapping
const SYMPTOM_GROUPS = {
  general: {
    color: "#1abc9c",
    names: ["Fever", "Cough", "Headache", "Vomiting", "Hair Loss", "Bleeding", "Injury", "Burn"],
  },
  bodyParts: {
    color: "#3498db",
    names: [
      "Skin",
      "Eyes",
      "Forehead",
      "Ears",
      "Nose",
      "Mouth/Lips",
      "Neck",
      "Upper Arm",
      "Elbow",
      "Forearm",
      "Hands",
      "Fingers",
      "Chest",
      "Abdomen",
      "Upper Back",
      "Lower Back",
      "Thigh",
      "Knee",
      "Calf",
      "Ankle",
      "Feet",
      "Toes",
    ],
  },
  bodyExcretion: {
    color: "#e67e22",
    names: ["Stool", "Sputum", "Sweat", "Saliva", "Menstrual", "Urination"],
  },
  others: {
    color: "#9b59b6",
    names: ["Others"],
  },
};

function getSymptomGroupColor(symptomName) {
  for (const group of Object.values(SYMPTOM_GROUPS)) {
    if (
      group.names.some(
        n =>
          n.toLowerCase().replace(/\s|\//g, "") === symptomName.toLowerCase().replace(/\s|\//g, "")
      )
    ) {
      return group.color;
    }
  }
  return undefined;
}

// Helper function to remove symptom name prefix from property labels
function cleanSymptomPropertyLabel(propertyKey, symptomKey) {
  // Create friendly label for the property
  let friendlyPropertyLabel = propertyKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())
    .replace(/-/g, " ")
    .trim();

  // Handle body parts patterns (e.g., "bodyPartsUpperArmPain" -> "Pain", "bodyPartsForeheadPainIntensity" -> "Pain Intensity")
  if (propertyKey.startsWith("bodyParts")) {
    // Remove the "bodyParts" prefix first
    let withoutBodyParts = propertyKey.substring(9); // Remove "bodyParts"

    // Find known body part names and remove them
    const bodyPartNames = [
      "Abdomen",
      "Ankle",
      "Calf",
      "Chest",
      "Ears",
      "Elbow",
      "Eyes",
      "Feet",
      "Fingers",
      "Forearm",
      "Forehead",
      "Hands",
      "Knee",
      "LowerBack",
      "MouthLip",
      "Neck",
      "Nose",
      "Thigh",
      "Toes",
      "UpperBack",
      "UpperArm",
    ];

    for (const bodyPart of bodyPartNames) {
      if (withoutBodyParts.startsWith(bodyPart)) {
        withoutBodyParts = withoutBodyParts.substring(bodyPart.length);
        break;
      }
    }

    // Convert to friendly format
    friendlyPropertyLabel = withoutBodyParts
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim();
  } else {
    // Remove symptom name prefix for other types (e.g., "Fever Grade" -> "Grade", "Sputum Color" -> "Color")
    const symptomNameFormatted = symptomKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim();

    if (friendlyPropertyLabel.toLowerCase().startsWith(symptomNameFormatted.toLowerCase())) {
      friendlyPropertyLabel = friendlyPropertyLabel.substring(symptomNameFormatted.length).trim();
    }
  }

  // Ensure proper capitalization of the final result
  if (friendlyPropertyLabel && friendlyPropertyLabel.length > 0) {
    friendlyPropertyLabel =
      friendlyPropertyLabel.charAt(0).toUpperCase() + friendlyPropertyLabel.slice(1);
  }

  return friendlyPropertyLabel;
}

// Doctor Profile Card Component
const DoctorProfileCard = ({ doctorDetails }) => {
  if (!doctorDetails || typeof doctorDetails !== "object") return null;

  const doctorName = `Dr. ${doctorDetails.firstName || ""} ${
    doctorDetails.middleName || ""
  } ${doctorDetails.lastName || ""}`
    .replace(/\s+/g, " ")
    .trim();

  const specializations = doctorDetails.professionalDetails?.specialization || [];
  const experience = doctorDetails.professionalDetails?.yearsOfExperience;
  const doctorInitials = getInitials(
    doctorDetails.firstName,
    doctorDetails.middleName,
    doctorDetails.lastName
  );

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        {doctorDetails.profileImage ? (
          <Image source={{ uri: doctorDetails.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileAvatarContainer}>
            <Text style={styles.profileAvatarText}>{doctorInitials}</Text>
          </View>
        )}

        <View style={styles.profileInfo}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{doctorName}</Text>
            {doctorDetails.isVerified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={20}
                color="#4CAF50"
                style={styles.verifiedIcon}
              />
            )}
          </View>

          {specializations.length > 0 && (
            <Text style={styles.profileSpecialization}>{specializations.join(", ")}</Text>
          )}

          {experience > 0 && (
            <Text style={styles.profileExperience}>{experience}+ years experience</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Expandable Follow-up Appointment Card Component
const FollowupAppointmentCard = ({ appointment, isExpanded, onToggle }) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = timeString => {
    if (!timeString) return "N/A";

    // Handle format like "06 AM" or "12 PM"
    const timeMatch = timeString.match(/^(\d{1,2})\s*(AM|PM)$/i);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      const period = timeMatch[2].toUpperCase();
      return `${hour} ${period}`;
    }

    // Handle format like "HH:MM"
    const [hours, minutes] = timeString.split(":");
    if (hours && minutes) {
      const hour = parseInt(hours, 10);
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes}`;
    }

    // Return original if no pattern matches
    return timeString;
  };

  return (
    <>
      <TouchableOpacity onPress={onToggle} style={styles.followupAppointmentHeader}>
        <View style={styles.followupAppointmentInfo}>
          <View style={styles.followupAppointmentTitle}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color="#01869e" />
            <Text style={styles.followupAppointmentDate}>{formatDate(appointment.date)}</Text>
          </View>
          <Text style={styles.followupAppointmentTime}>
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </Text>
          <View style={styles.followupAppointmentStatus}>
            <MaterialCommunityIcons
              name={appointment.bookingStatus === "Completed" ? "check-circle" : "clock-outline"}
              size={16}
              color={appointment.bookingStatus === "Completed" ? "#4CAF50" : "#FF9800"}
            />
            <Text
              style={[
                styles.followupAppointmentStatusText,
                { color: appointment.bookingStatus === "Completed" ? "#4CAF50" : "#FF9800" },
              ]}
            >
              {appointment.bookingStatus || "Scheduled"}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.followupAppointmentDetails}>
          {/* Appointment Details */}
          <View style={styles.followupDetailsSection}>
            <Text style={styles.followupDetailsSectionTitle}>Appointment Details</Text>
            <View style={styles.followupDetailRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.followupDetailLabel}>Location:</Text>
              <Text style={styles.followupDetailValue}>{appointment.location || "TBD"}</Text>
            </View>
            {appointment.appointmentType && (
              <View style={styles.followupDetailRow}>
                <MaterialCommunityIcons name="medical-bag" size={16} color="#666" />
                <Text style={styles.followupDetailLabel}>Type:</Text>
                <Text style={styles.followupDetailValue}>{appointment.appointmentType}</Text>
              </View>
            )}
          </View>

          {/* Symptoms Section */}
          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <View style={styles.followupDetailsSection}>
              <Text style={styles.followupDetailsSectionTitle}>Symptoms</Text>
              {appointment.symptoms.map((symptomData, index) => {
                // Transform the symptom data to a readable format
                const symptomEntries = [];

                // Process each symptom category
                Object.entries(symptomData).forEach(([category, categoryData]) => {
                  if (category === "_id" || !categoryData || typeof categoryData !== "object")
                    return;

                  Object.entries(categoryData).forEach(([subCategory, subCategoryData]) => {
                    if (!subCategoryData || typeof subCategoryData !== "object") return;

                    Object.entries(subCategoryData).forEach(([symptomKey, symptomValue]) => {
                      if (symptomValue && symptomValue !== "") {
                        const friendlyLabel = symptomKey
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, str => str.toUpperCase())
                          .trim();

                        symptomEntries.push({
                          label: friendlyLabel,
                          value: symptomValue,
                        });
                      }
                    });
                  });
                });

                return (
                  <View key={index} style={styles.followupSymptomContainer}>
                    {symptomEntries.map((symptom, symIndex) => (
                      <View key={symIndex} style={styles.followupSymptomItem}>
                        <Text style={styles.followupSymptomText}>
                          {symptom.label}:{" "}
                          {Array.isArray(symptom.value)
                            ? symptom.value.join(", ")
                            : typeof symptom.value === "object" && symptom.value !== null
                              ? Object.entries(symptom.value)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")
                              : symptom.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {/* Prescriptions Section */}
          {appointment.prescriptions && appointment.prescriptions.length > 0 && (
            <View style={styles.followupDetailsSection}>
              <Text style={styles.followupDetailsSectionTitle}>Prescriptions</Text>
              {appointment.prescriptions.map((prescription, index) => (
                <View key={index} style={styles.followupPrescriptionItem}>
                  <Text style={styles.followupPrescriptionName}>Prescription {index + 1}</Text>
                  <Text style={styles.followupPrescriptionDate}>
                    Uploaded:{" "}
                    {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  {prescription.fileUris && prescription.fileUris.length > 0 && (
                    <Text style={styles.followupPrescriptionFiles}>
                      {prescription.fileUris.length} file(s) attached
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Doctor Notes Section */}
          {appointment.doctorNotes && appointment.doctorNotes.length > 0 && (
            <View style={styles.followupDetailsSection}>
              <Text style={styles.followupDetailsSectionTitle}>Doctor Notes</Text>
              {appointment.doctorNotes.map((note, index) => (
                <View key={index} style={styles.followupNoteItem}>
                  <Text style={styles.followupNoteText}>{note.note || note.text}</Text>
                  {note.date && (
                    <Text style={styles.followupNoteDate}>
                      {new Date(note.date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </>
  );
};

// Tab Components
const AppointmentsTab = ({
  appointment,
  appDetails,
  navigation,
  navigateToBookAppointment,
  followupAppointments,
  expandedAppointments,
  setExpandedAppointments,
  refreshing,
  onRefresh,
}) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleAppointmentExpansion = appointmentId => {
    setExpandedAppointments(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
  };

  return (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#01869e" />
      }
    >
      {/* Current Appointment Details Card */}
      <View style={styles.appointmentDetailsCard}>
        <View style={styles.appointmentDetailsHeader}>
          <MaterialCommunityIcons name="calendar-clock" size={20} color="#01869e" />
          <Text style={styles.appointmentDetailsTitle}>
            Last Appointment ({formatDate(appDetails.date)})
          </Text>
        </View>
      </View>

      {/* Book Follow-up Button */}
      <TouchableOpacity style={styles.followUpButton} onPress={navigateToBookAppointment}>
        <MaterialCommunityIcons name="calendar-plus" size={20} color="#fff" />
        <Text style={styles.followUpButtonText}>Book Follow-up</Text>
      </TouchableOpacity>

      {/* Follow-up Appointments List */}
      {followupAppointments && followupAppointments.length > 0 ? (
        <View style={styles.followupAppointmentsContainer}>
          <Text style={styles.followupAppointmentsTitle}>Follow-up Appointments</Text>
          {followupAppointments.map((followupAppointment, index) => (
            <View
              key={followupAppointment._id || index}
              style={[
                styles.followupAppointmentCard,
                index === followupAppointments.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <FollowupAppointmentCard
                appointment={followupAppointment}
                isExpanded={expandedAppointments[followupAppointment._id] || false}
                onToggle={() => toggleAppointmentExpansion(followupAppointment._id)}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.followupAppointmentsContainer}>
          <Text style={styles.followupAppointmentsTitle}>Follow-up Appointments</Text>
          <View style={styles.emptyFollowupContent}>
            <Text style={styles.emptyTabText}>No follow-up appointments found</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const SymptomsTab = ({ appointment, navigateToSurvey, handleViewImage, refreshing, onRefresh }) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedDates, setExpandedDates] = useState({});

  // Function to render grouped symptoms by date
  const renderGroupedSymptoms = (groupedSymptoms, maxItems = 3) => {
    if (!groupedSymptoms || groupedSymptoms.length === 0) return null;

    const toggleGroupExpansion = groupIndex => {
      setExpandedGroups(prev => ({
        ...prev,
        [groupIndex]: !prev[groupIndex],
      }));
    };

    const toggleDateExpansion = groupIndex => {
      setExpandedDates(prev => ({
        ...prev,
        [groupIndex]: !prev[groupIndex],
      }));
    };

    return groupedSymptoms.map((group, groupIndex) => {
      const isGroupExpanded = expandedGroups[groupIndex];
      const isDateExpanded = expandedDates[groupIndex];

      // Group symptoms by their symptomName
      const symptomsByCategory = {};
      group.symptoms.forEach(symptom => {
        const symptomName = symptom.symptomName;
        if (!symptomsByCategory[symptomName]) {
          symptomsByCategory[symptomName] = [];
        }
        symptomsByCategory[symptomName].push(symptom);
      });

      // Convert to array and limit items if needed
      const symptomCategories = Object.entries(symptomsByCategory);
      const shouldShowToggle = symptomCategories.length > maxItems;
      const displayedCategories = isGroupExpanded
        ? symptomCategories
        : symptomCategories.slice(0, maxItems);

      return (
        <View key={groupIndex} style={styles.symptomsGroup}>
          <TouchableOpacity
            style={styles.symptomsDateHeader}
            onPress={() => toggleDateExpansion(groupIndex)}
          >
            <View style={styles.symptomsDateContent}>
              <MaterialCommunityIcons name="calendar" size={16} color="#01869e" />
              <Text style={styles.symptomsDateText}>
                {(() => {
                  try {
                    const date = new Date(group.date);
                    if (isNaN(date.getTime())) {
                      return "Invalid Date";
                    }
                    return date.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } catch (error) {
                    return "Invalid Date";
                  }
                })()}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={isDateExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#01869e"
            />
          </TouchableOpacity>

          {isDateExpanded && (
            <>
              <View style={styles.symptomsContainer}>
                {displayedCategories.map(([symptomName, symptoms], categoryIndex) => {
                  // Get color for this symptom group
                  const groupColor = getSymptomGroupColor(symptomName);
                  return (
                    <View key={categoryIndex} style={styles.symptomCategory}>
                      <View
                        style={[
                          styles.symptomCategoryTitleWrapper,
                          groupColor
                            ? { backgroundColor: groupColor + "22", borderLeftColor: groupColor }
                            : {},
                        ]}
                      >
                        <Text
                          style={[
                            styles.symptomCategoryTitle,
                            groupColor ? { color: groupColor } : {},
                          ]}
                        >
                          {symptomName
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, str => str.toUpperCase())
                            .trim()}
                        </Text>
                      </View>

                      {/* Render individual symptom items */}
                      {symptoms.map((symptom, symptomIndex) => {
                        // Apply label cleaning to remove symptom name prefix
                        let label = symptom.label;

                        // Remove symptom name prefix if it exists (e.g., "Sputum Color" -> "Color")
                        const symptomNameFormatted = symptomName
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, str => str.toUpperCase())
                          .trim();
                        if (label.toLowerCase().startsWith(symptomNameFormatted.toLowerCase())) {
                          label = label.substring(symptomNameFormatted.length).trim();
                        }

                        // Ensure proper capitalization
                        if (label && label.length > 0) {
                          label = label.charAt(0).toUpperCase() + label.slice(1);
                        }

                        // Optionally, customize label for certain keys
                        if (label.toLowerCase().includes("duration")) label = "Duration(in days)";
                        if (label.toLowerCase().includes("type")) label = "Type";
                        if (label.toLowerCase().includes("timing")) label = "Timing";

                        // Handle display value - hide URLs when image is available
                        let displayValue;
                        if (symptom.hasImage && symptom.imageUrl) {
                          // If this symptom has an image, show a clean display value without the URL
                          if (Array.isArray(symptom.value)) {
                            // Filter out URLs from arrays
                            const filteredValues = symptom.value.filter(
                              val =>
                                typeof val === "string" &&
                                !val.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi)
                            );
                            displayValue =
                              filteredValues.length > 0 ? filteredValues.join(", ") : "";
                          } else if (typeof symptom.value === "string") {
                            // If it's a string that contains an image URL, replace with clean text
                            const hasUrl = symptom.value.match(
                              /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi
                            );
                            displayValue = hasUrl ? "" : symptom.value;
                          } else {
                            displayValue = "";
                          }
                        } else {
                          // Normal display for non-image values
                          displayValue = Array.isArray(symptom.value)
                            ? symptom.value.join(", ")
                            : typeof symptom.value === "object" && symptom.value !== null
                              ? Object.entries(symptom.value)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")
                              : symptom.value;
                        }

                        return (
                          <View key={symptomIndex} style={styles.symptomItem}>
                            <View style={styles.symptomContent}>
                              <Text style={styles.symptomLabel}>{label}:</Text>
                              <Text style={styles.symptomValue}>{displayValue}</Text>
                            </View>
                            {symptom.hasImage && symptom.imageUrl && (
                              <TouchableOpacity
                                style={styles.viewImageButton}
                                onPress={() => handleViewImage(symptom.imageUrl)}
                              >
                                <MaterialCommunityIcons name="image" size={16} color="#01869e" />
                                <Text style={styles.viewImageText}>View Image</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>

              {shouldShowToggle && (
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleGroupExpansion(groupIndex)}
                >
                  <MaterialCommunityIcons
                    name={isGroupExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#01869e"
                  />
                  <Text style={styles.toggleButtonText}>
                    {isGroupExpanded
                      ? "View less"
                      : `View ${symptomCategories.length - maxItems} more`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      );
    });
  };

  const transformSymptomsToArray = symptomsData => {
    if (!symptomsData) return [];

    const symptomsGroupedByDate = [];

    // Symptoms will always come as an array
    const symptomsList = Array.isArray(symptomsData) ? symptomsData : [symptomsData];

    symptomsList.forEach((symptomsObj, index) => {
      if (!symptomsObj || typeof symptomsObj !== "object") return;

      const createdAt = symptomsObj.createdAt;
      const symptomsForThisDate = [];

      // Validate the createdAt date and provide fallback
      let validDate = createdAt;
      if (!createdAt) {
        validDate = new Date().toISOString(); // Use current date as fallback
      }

      // Process each symptom section (generalSymptoms, bodyExcretion, skin, bodyParts, others)
      Object.entries(symptomsObj).forEach(([sectionKey, sectionData]) => {
        if (sectionKey === "createdAt" || sectionKey === "behalfUserId" || !sectionData) return;

        if (typeof sectionData === "object" && sectionData !== null) {
          Object.entries(sectionData).forEach(([categoryKey, categoryData]) => {
            if (categoryData === null) return; // skip null categories
            if (typeof categoryData === "object" && categoryData !== null) {
              // Check if the categoryData is a nested object with properties
              const hasNestedProperties = Object.values(categoryData).some(
                value => typeof value === "object" && value !== null && !Array.isArray(value)
              );

              if (hasNestedProperties) {
                // Handle nested symptom objects (like cough with coughType, coughTiming, etc.)
                Object.entries(categoryData).forEach(([symptomKey, symptomValue]) => {
                  if (
                    typeof symptomValue === "object" &&
                    symptomValue !== null &&
                    !Array.isArray(symptomValue)
                  ) {
                    // This is a nested symptom object
                    Object.entries(symptomValue).forEach(([propertyKey, propertyValue]) => {
                      // Skip empty values
                      if (
                        !propertyValue ||
                        (Array.isArray(propertyValue) && propertyValue.length === 0)
                      )
                        return;

                      // Create friendly label for the property
                      const friendlyPropertyLabel = cleanSymptomPropertyLabel(
                        propertyKey,
                        symptomKey
                      );

                      // Check if the value contains an image URL
                      const imageUrl = detectImageUrl(propertyValue);

                      symptomsForThisDate.push({
                        label: friendlyPropertyLabel,
                        value: propertyValue,
                        imageUrl: imageUrl,
                        hasImage: !!imageUrl,
                        section: sectionKey,
                        category: categoryKey,
                        symptomName: symptomKey, // Store the main symptom name
                        isNested: true,
                      });
                    });
                  } else {
                    // This is a simple value
                    if (!symptomValue || (Array.isArray(symptomValue) && symptomValue.length === 0))
                      return;

                    // Create friendly label
                    const friendlyLabel = symptomKey
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, str => str.toUpperCase())
                      .replace(/-/g, " ")
                      .trim();

                    // Check if the value contains an image URL
                    const imageUrl = detectImageUrl(symptomValue);

                    symptomsForThisDate.push({
                      label: friendlyLabel,
                      value: symptomValue,
                      imageUrl: imageUrl,
                      hasImage: !!imageUrl,
                      section: sectionKey,
                      category: categoryKey,
                      symptomName: categoryKey,
                      isNested: false,
                    });
                  }
                });
              } else {
                // Handle simple key-value pairs
                Object.keys(categoryData).forEach(key => {
                  const value = categoryData[key];

                  // Skip empty values
                  if (!value || (Array.isArray(value) && value.length === 0)) return;

                  // Create friendly label
                  const friendlyLabel = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/-/g, " ")
                    .trim();

                  // Check if the value contains an image URL
                  const imageUrl = detectImageUrl(value);

                  symptomsForThisDate.push({
                    label: friendlyLabel,
                    value: value,
                    imageUrl: imageUrl,
                    hasImage: !!imageUrl,
                    section: sectionKey,
                    category: categoryKey,
                    symptomName: categoryKey,
                    isNested: false,
                  });
                });
              }
            }
          });
        }
      });

      if (symptomsForThisDate.length > 0) {
        symptomsGroupedByDate.push({
          date: validDate,
          symptoms: symptomsForThisDate,
        });
      }
    });
    return symptomsGroupedByDate;
  };

  // Function to detect and handle image URLs
  const detectImageUrl = value => {
    // Handle arrays of URLs
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          const imageUrlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi;
          const match = item.match(imageUrlRegex);
          if (match) {
            return match[0];
          }
        }
      }
      return null;
    }

    // Handle string values
    if (typeof value !== "string") return null;

    const imageUrlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi;
    const match = value.match(imageUrlRegex);

    return match ? match[0] : null;
  };

  // Check if symptoms exist - handle both array and object structures
  const hasSymptoms =
    appointment?.symptoms &&
    (Array.isArray(appointment.symptoms)
      ? appointment.symptoms.length > 0
      : Object.keys(appointment.symptoms).length > 0);

  // Check if appointment is for someone else
  const isForSomeoneElse =
    appointment?.behalfUserId &&
    typeof appointment.behalfUserId === "object" &&
    appointment.behalfUserId.firstName;

  return (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#01869e" />
      }
    >
      {/* Always show Add Symptoms button */}
      <TouchableOpacity style={styles.addButton} onPress={navigateToSurvey}>
        <MaterialCommunityIcons name="plus" size={16} color="#fff" />
        <Text style={styles.addButtonText}>Add Symptoms</Text>
      </TouchableOpacity>

      {/* Show behalf user information if appointment is for someone else */}
      {isForSomeoneElse && (
        <View style={styles.behalfUserInfo}>
          <MaterialCommunityIcons name="account-multiple" size={16} color="#01869e" />
          <Text style={styles.behalfUserText}>
            Appointment for: {appointment.behalfUserId.firstName}{" "}
            {appointment.behalfUserId.lastName}
          </Text>
          <Text style={styles.behalfUserRelation}>({appointment.behalfUserId.relationship})</Text>
        </View>
      )}

      {hasSymptoms ? (
        <View style={styles.symptomsViewer}>
          {renderGroupedSymptoms(transformSymptomsToArray(appointment.symptoms))}
        </View>
      ) : (
        <View style={styles.emptyTabContent}>
          <MaterialCommunityIcons name="clipboard-pulse" size={48} color="#ccc" />
          <Text style={styles.emptyTabText}>No symptoms recorded</Text>
          <Text style={styles.emptyTabSubtext}>
            Add symptoms to help your doctor prepare for the consultation
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const PrescriptionsTab = ({
  appointment,
  appDetails,
  handleFileUpload,
  setUploadType,
  setShowUploadModal,
  refreshing,
  onRefresh,
  getPrescriptions,
}) => {
  const deletePrescription = async prescriptionId => {
    try {
      const response = await apiService.healthRecords.deletePrescription(prescriptionId);

      if (response.status === 200) {
        ToastAndroid.show("Prescription deleted successfully", ToastAndroid.SHORT);
        await getPrescriptions();
      }
    } catch (error) {
      console.log("Error deleting prescription:", error);
    }
  };

  const sharePrescription = async (fileUri, description) => {
    try {
      const shareOptions = {
        url: fileUri,
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log("Prescription shared via:", result.activityType);
          ToastAndroid.show("Prescription shared successfully", ToastAndroid.SHORT);
        } else {
          // Shared
          console.log("Prescription shared successfully");
          ToastAndroid.show("Prescription shared successfully", ToastAndroid.SHORT);
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share dismissed");
      }
    } catch (error) {
      console.log("Error sharing prescription:", error);
      Alert.alert("Error", "Unable to share prescription. Please try again.");
    }
  };

  return (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#01869e" />
      }
    >
      {/* Always show Add Prescription button to allow multiple prescriptions */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setUploadType("prescription");
          setShowUploadModal(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={16} color="#fff" />
        <Text style={styles.addButtonText}>Add Prescription</Text>
      </TouchableOpacity>

      {appointment?.prescriptions?.length > 0 ? (
        <View style={{ paddingBottom: 20 }}>
          {appointment.prescriptions.map((prescription, index) => (
            <UploadedDocumentItem
              key={index}
              file={{
                uri: prescription.fileUri,
                s3Key: prescription.s3Key,
                prescriptionId: prescription.prescriptionId,
              }}
              description={prescription.description}
              date={prescription.date}
              onShare={() => sharePrescription(prescription.fileUri, prescription.description)}
              onDelete={() => deletePrescription(prescription.prescriptionId)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyTabContent}>
          <MaterialCommunityIcons name="pill" size={48} color="#ccc" />
          <Text style={styles.emptyTabText}>No prescriptions available</Text>
          <Text style={styles.emptyTabSubtext}>Prescriptions will appear here when uploaded</Text>
        </View>
      )}
    </ScrollView>
  );
};

const ReportsTab = ({
  appointment,
  setUploadType,
  setShowUploadModal,
  refreshing,
  onRefresh,
  getReports,
}) => {
  const shareReport = async (fileUri, description) => {
    try {
      const shareOptions = {
        url: fileUri,
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log("Report shared via:", result.activityType);
          ToastAndroid.show("Report shared successfully", ToastAndroid.SHORT);
        } else {
          // Shared
          console.log("Report shared successfully");
          ToastAndroid.show("Report shared successfully", ToastAndroid.SHORT);
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Share dismissed");
      }
    } catch (error) {
      console.log("Error sharing report:", error);
      Alert.alert("Error", "Unable to share report. Please try again.");
    }
  };

  const deleteReport = async (reportId, s3Key) => {
    try {
      const response = await apiService.healthRecords.deleteSpecificReport(reportId, s3Key);

      if (response.status === 200) {
        ToastAndroid.show("Report deleted successfully", ToastAndroid.SHORT);
        await getReports();
      }
    } catch (error) {
      console.log("Error deleting report:", error);
    }
  };

  return (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#01869e" />
      }
    >
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setUploadType("report");
          setShowUploadModal(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={16} color="#fff" />
        <Text style={styles.addButtonText}>Add Report</Text>
      </TouchableOpacity>

      {appointment?.reports?.length > 0 ? (
        <View style={{ paddingBottom: 20 }}>
          {appointment.reports.map((report, index) => {
            return (
              <UploadedDocumentItem
                key={index}
                file={{ uri: report.fileUri, s3Key: report.s3Key }}
                description={report.description}
                date={report.date}
                onShare={() => shareReport(report.fileUri, report.description)}
                onDelete={() => deleteReport(report.reportId, report.s3Key)}
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyTabContent}>
          <MaterialCommunityIcons name="file-document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyTabText}>No reports available</Text>
          <Text style={styles.emptyTabSubtext}>Reports will appear here when uploaded</Text>
        </View>
      )}
    </ScrollView>
  );
};

const NotesTab = ({ appointment, refreshing, onRefresh }) => {
  return (
    <ScrollView
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#01869e" />
      }
    >
      {appointment?.doctorNotes?.length > 0 ? (
        <View style={styles.notesContainer}>
          {appointment.doctorNotes.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <View style={styles.noteHeader}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={16}
                  color="#01869e"
                  style={styles.noteIcon}
                />
                <Text style={styles.noteDate}>
                  {new Date(note.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View style={styles.noteContent}>
                <Text style={styles.noteText}>{note.note}</Text>
              </View>
              {index < appointment.doctorNotes.length - 1 && <View style={styles.noteDivider} />}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyTabContent}>
          <MaterialCommunityIcons name="notebook-outline" size={48} color="#ccc" />
          <Text style={styles.emptyTabText}>No doctor notes available</Text>
          <Text style={styles.emptyTabSubtext}>
            Doctor's notes will appear here after consultation
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

// Real-time data will be populated from API calls

const VisitDetailsScreen = ({ route, navigation }) => {
  const { appDetails, showUpdated, message } = route.params;

  // Show success message if coming back from symptoms saving
  useEffect(() => {
    if (showUpdated && message) {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      // Refresh symptoms when returning with success message
      getSymptoms();
    }
  }, [showUpdated, message]);

  // Watch for route params changes that indicate symptoms were updated
  useEffect(() => {
    if (route.params?.symptomsUpdated || route.params?.refreshSymptoms) {
      getSymptoms();

      // Clear the param to avoid repeated refreshes
      navigation.setParams({
        symptomsUpdated: false,
        refreshSymptoms: false,
      });
    }
  }, [route.params?.symptomsUpdated, route.params?.refreshSymptoms]);

  const [appointment, setAppointment] = useState({
    _id: appDetails._id,
    date: appDetails.date,
    startTime: appDetails.startTime,
    endTime: appDetails.endTime,
    location: appDetails.location,
    bookingStatus: appDetails.bookingStatus,
    doctorId: appDetails.doctorId,
    symptomId: appDetails.symptomId,
    appointmentId: appDetails.appointmentId,
    behalfUserId: appDetails.behalfUserId,
    symptoms: null, // Will be populated from API
    reports: [], // Will be populated from API if available
    prescriptions: [], // Will be populated from API if available
    doctorNotes: [], // Will be populated from API if available
    symptomUpdates: [], // Will be populated from API if available
  });
  const [doctorDetails, setDoctorDetails] = useState(null); // Will be populated from API
  const [loading, setLoading] = useState(true); // Set to true while fetching data
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Will be populated from API if available
  const [uploadType, setUploadType] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [followupAppointments, setFollowupAppointments] = useState([]);
  const [expandedAppointments, setExpandedAppointments] = useState({});
  const [activeTab, setActiveTab] = useState("appointments");

  // Get doctor details
  const getDoctorDetails = async () => {
    const doctorUDI_Id = appDetails.doctorUDI_id;

    try {
      const response = await apiService.profile.getDoctorDetails(doctorUDI_Id);

      if (response.data) {
        const doctorData = response.data;

        // Update the doctor details state with the fetched data
        setDoctorDetails({
          firstName: doctorData.firstName || "",
          middleName: doctorData.middleName || "",
          lastName: doctorData.lastName || "",
          profileImage: doctorData.profileImage || "",
          professionalDetails: {
            specialization: doctorData.professionalDetails?.specialization || [],
            areaOfExpertise: doctorData.professionalDetails?.areaOfExpertise || [],
            qualification: doctorData.professionalDetails?.qualification || [],
            yearsOfExperience: doctorData.professionalDetails?.yearsOfExperience || 0,
            languagesSpoken: [
              ...(doctorData.languages?.speak || []),
              ...(doctorData.languages?.understand || []),
              ...(doctorData.languages?.readWrite || []),
            ].filter((lang, index, self) => self.indexOf(lang) === index), // Remove duplicates
          },
          rating: doctorData.rating || 0,
          reviewsCount: doctorData.reviewsCount || 0,
          doctorUDI_Id: doctorData.UDI_id || "",
          isVerified: doctorData.isVerified || false,
          gender: doctorData.gender || "",
          dob: doctorData.dob || "",
        });
      }
    } catch (error) {
      console.log("Error fetching doctor details:", error);
    }
  };

  // Get Symptoms from appointmentId
  const getSymptoms = useCallback(async () => {
    const appointmentId = appDetails.appointmentId;

    try {
      console.log("Fetching symptoms for appointmentId:", appointmentId);
      const response = await apiService.healthRecords.getSymptoms(appointmentId);

      if (response.data && response.data.patientSymptoms) {
        const patientSymptoms = response.data.patientSymptoms;
        console.log("Received symptoms:", patientSymptoms.length, "entries");

        // Extract behalfUserId from the first symptom if available
        let behalfUserId = null;
        if (patientSymptoms.length > 0 && patientSymptoms[0].behalfUserId) {
          behalfUserId = patientSymptoms[0].behalfUserId;
        }

        setAppointment(prev => ({
          ...prev,
          symptoms: patientSymptoms, // Store the patientSymptoms array
          behalfUserId: behalfUserId || null,
        }));
      } else {
        console.log("No symptoms data received");
      }
    } catch (error) {
      console.log("Error fetching symptoms:", error);
    }
  }, [appDetails.appointmentId]);

  // Get Notes
  const getNotes = async () => {
    const appointmentId = appDetails.appointmentId;
    try {
      const response = await apiService.appointments.getNotes(appointmentId);

      console.log("Notes response:", JSON.stringify(response.data, null, 2));

      if (response.data && response.data.notes && Array.isArray(response.data.notes)) {
        // Transform the response data to match the expected format
        const transformedNotes = response.data.notes.map(note => ({
          note: note.note,
          date: note.date,
          _id: note._id,
          appointmentId: note.appointmentId,
          appointmentDate: note.appointmentDate,
        }));

        setAppointment(prev => ({
          ...prev,
          doctorNotes: transformedNotes,
        }));
      }
    } catch (error) {
      console.log("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // Get Reports
  const getReports = async () => {
    const appointmentId = appDetails.appointmentId;
    try {
      const response = await apiService.healthRecords.getReports(appointmentId);

      if (response.data && Array.isArray(response.data)) {
        // Transform the response data to match the expected format
        const transformedReports = response.data.flatMap(reportGroup =>
          reportGroup.fileUris.map((uri, index) => ({
            reportId: reportGroup._id, // Use the original group ID for deletion
            fileUri: uri,
            title: `Report ${index + 1}`,
            description: `Uploaded on ${new Date(reportGroup.createdAt).toLocaleDateString()}`,
            date: reportGroup.createdAt,
            s3Key: reportGroup.s3Keys[index],
          }))
        );

        // Sort reports by date (latest first)
        const sortedReports = transformedReports.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAppointment(prev => ({
          ...prev,
          reports: sortedReports,
        }));
      }
    } catch (error) {
      console.log("Error fetching reports:", error);
    }
  };

  // Get Prescriptions
  const getPrescriptions = async () => {
    const appointmentId = appDetails.appointmentId;
    try {
      const response = await apiService.healthRecords.getPrescriptions(appointmentId);

      console.log("Prescriptions:", JSON.stringify(response.data, null, 2));

      if (response.data && Array.isArray(response.data)) {
        // Transform the array of prescription objects
        const transformedPrescriptions = response.data.flatMap(
          (prescriptionObj, prescriptionIndex) =>
            prescriptionObj.fileUris.map((uri, fileIndex) => ({
              fileUri: uri,
              title:
                prescriptionObj.fileUris.length > 1
                  ? `Prescription ${prescriptionIndex + 1} - File ${fileIndex + 1}`
                  : `Prescription ${prescriptionIndex + 1}`,
              description: `Uploaded on ${new Date(prescriptionObj.createdAt).toLocaleDateString()}`,
              date: prescriptionObj.createdAt,
              s3Key: prescriptionObj.s3Keys[fileIndex],
              prescriptionId: prescriptionObj._id,
            }))
        );

        // Sort prescriptions by date (latest first)
        const sortedPrescriptions = transformedPrescriptions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAppointment(prev => ({
          ...prev,
          prescriptions: sortedPrescriptions,
        }));
      }
    } catch (error) {
      console.log("Error fetching prescriptions:", error);
    }
  };

  // Get followup appointments
  const getFollowupAppointments = async () => {
    try {
      const response = await apiService.appointments.getFollowupAppointments(
        appDetails.appointmentId
      );

      if (response.data && response.data.followupAppointments) {
        // Transform the response data to match our component expectations
        const transformedAppointments = response.data.followupAppointments.map(
          (appointment, index) => ({
            _id: `followup_${index}`, // Generate an ID since the API doesn't provide one
            date: appointment.date,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            location: appointment.location,
            bookingStatus: appointment.isVisited ? "Completed" : "Scheduled",
            appointmentType: "Follow-up Consultation",
            symptoms: appointment.symptoms || [],
            prescriptions: appointment.prescriptions || [],
            doctorNotes: appointment.doctorNotes || [],
          })
        );

        setFollowupAppointments(transformedAppointments);
      } else {
        setFollowupAppointments([]);
      }
    } catch (error) {
      console.log("Error fetching follow-up appointments:", error);
      setFollowupAppointments([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const promises = [
        getDoctorDetails(),
        getFollowupAppointments(),
        getSymptoms(),
        getPrescriptions(),
        getReports(),
        getNotes(),
      ];

      const results = await Promise.allSettled(promises);

      // Log any failed requests without breaking the flow
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`API call ${index} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getDoctorDetails(),
          getFollowupAppointments(),
          getSymptoms(),
          getPrescriptions(),
          getReports(),
          getNotes(),
        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Call getSymptoms on every page load as a separate effect
  useEffect(() => {
    getSymptoms();
  }, []);

  // Use useFocusEffect to refresh symptoms when returning from other screens
  useFocusEffect(
    useCallback(() => {
      console.log("VisitDetailsScreen focused - refreshing symptoms");
      getSymptoms();
    }, [getSymptoms])
  );

  // Enhanced listener for route params changes (when returning from SurveyDetails)
  useEffect(() => {
    const unsubscribe = navigation.addListener("state", e => {
      // Check if we're returning from SurveyDetails with updated symptoms
      if (route.params?.showUpdated || route.params?.symptomsUpdated) {
        console.log("Route params changed - refreshing symptoms");
        getSymptoms();
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // Pull-to-refresh functionality
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getDoctorDetails(),
        getFollowupAppointments(),
        getSymptoms(), // Ensure symptoms are refreshed
        getNotes(),
        getReports(),
        getPrescriptions(),
      ]);
    } catch (error) {
      console.log("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderSymptomUpdates = () => {
    if (!appointment?.symptomUpdates?.length) return null;

    return (
      <Card style={styles.symptomsCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="history" size={24} color="#01869e" />
          <Text style={styles.cardTitle}>Symptom Updates</Text>
          <TouchableOpacity style={styles.addSymptom} onPress={navigateToSurvey}>
            <MaterialCommunityIcons name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {appointment.symptomUpdates.map((update, index) => (
          <View key={index} style={styles.updateBlock}>
            <Text style={styles.updateDate}>{new Date(update.date).toLocaleString()}</Text>

            {renderGroupedSymptoms(transformSymptomsToArray(update.symptoms))}
          </View>
        ))}
      </Card>
    );
  };

  const renderReports = () => {
    return (
      <Card style={styles.documentsCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#01869e" />
          <Text style={styles.cardTitle}>Reports</Text>
        </View>

        {appointment?.reports?.length > 0 ? (
          appointment.reports.map((report, index) => (
            <UploadedDocumentItem
              key={index}
              file={{ uri: report.fileUri, s3Key: report.s3Key }}
              description={report.description}
              date={report.date}
              onShare={id => console.log("Share report:", id)}
              onDelete={id => console.log("Delete report:", id)}
            />
          ))
        ) : (
          <View style={styles.emptySection}>
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No reports available</Text>
            <Text style={styles.emptySubtext}>Reports will appear here when uploaded</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setUploadType("report");
            setShowUploadModal(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add Report</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderPrescriptions = () => {
    return (
      <Card style={styles.documentsCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="pill" size={24} color="#01869e" />
          <Text style={styles.cardTitle}>Prescriptions</Text>
        </View>

        {appointment?.prescriptions?.length > 0 ? (
          <>
            {appointment.prescriptions.map((prescription, index) => (
              <UploadedDocumentItem
                key={index}
                file={{
                  uri: prescription.fileUri,
                  s3Key: prescription.s3Key,
                  prescriptionId: prescription.prescriptionId,
                }}
                description={prescription.description}
                date={prescription.date}
                onShare={id => console.log("Share prescription:", id)}
                onDelete={id => console.log("Delete prescription:", id)}
              />
            ))}
            <View style={styles.prescriptionNote}>
              <MaterialCommunityIcons name="information" size={16} color="#666" />
              <Text style={styles.prescriptionNoteText}>
                Only one prescription per appointment is allowed
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptySection}>
            <MaterialCommunityIcons name="pill" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No prescriptions available</Text>
            <Text style={styles.emptySubtext}>Prescriptions will appear here when uploaded</Text>
          </View>
        )}

        {/* Only show Add Prescription button if no prescriptions exist */}
        {(!appointment?.prescriptions || appointment.prescriptions.length === 0) && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setUploadType("prescription");
              setShowUploadModal(true);
            }}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Prescription</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  // const renderDoctorNotes = () => {
  //   return (
  //     <Card style={styles.notesCard}>
  //       <View style={styles.cardHeader}>
  //         <MaterialCommunityIcons name="notebook-outline" size={24} color="#01869e" />
  //         <Text style={styles.cardTitle}>Doctor's Notes</Text>
  //       </View>

  //       {appointment?.doctorNotes?.length > 0 ? (
  //         <View style={styles.notesContainer}>
  //           {appointment.doctorNotes.map((note, index) => (
  //             <View key={index} style={styles.noteItem}>
  //               <View style={styles.noteHeader}>
  //                 <MaterialCommunityIcons
  //                   name="stethoscope"
  //                   size={16}
  //                   color="#01869e"
  //                   style={styles.noteIcon}
  //                 />
  //                 <Text style={styles.noteDate}>
  //                   {new Date(note.date).toLocaleDateString("en-US", {
  //                     weekday: "short",
  //                     year: "numeric",
  //                     month: "short",
  //                     day: "numeric",
  //                     hour: "2-digit",
  //                     minute: "2-digit",
  //                   })}
  //                 </Text>
  //               </View>
  //               <View style={styles.noteContent}>
  //                 <Text style={styles.noteText}>{note.note}</Text>
  //               </View>
  //               {index < appointment.doctorNotes.length - 1 && <View style={styles.noteDivider} />}
  //             </View>
  //           ))}
  //         </View>
  //       ) : (
  //         <View style={styles.emptySection}>
  //           <MaterialCommunityIcons name="notebook-outline" size={48} color="#ccc" />
  //           <Text style={styles.emptyText}>No doctor notes available</Text>
  //           <Text style={styles.emptySubtext}>
  //             Doctor's notes will appear here after consultation
  //           </Text>
  //         </View>
  //       )}
  //     </Card>
  //   );
  // };

  // Navigation for adding symptoms for the same appointment
  const navigateToSurvey = () => {
    // Check if appointment is for someone else
    const isForSomeoneElse =
      appointment?.behalfUserId &&
      typeof appointment.behalfUserId === "object" &&
      appointment.behalfUserId.firstName;

    const form = isForSomeoneElse
      ? {
          name: "Other",
          firstName: appointment.behalfUserId.firstName,
          lastName: appointment.behalfUserId.lastName,
          relationship: appointment.behalfUserId.relationship,
        }
      : { name: "Self" };

    navigation.navigate("SurveyDetails", {
      doctor: doctorDetails,
      appointmentId: appointment.appointmentId,
      // fromBooking: false,
      forSaving: true,
      onlySave: true,
      returnToVisit: true,
      form,
      appDetails: appDetails, // Pass the original appDetails for proper navigation back
      // Add callback to refresh symptoms when returning
      onSymptomsUpdated: () => {
        getSymptoms();
      },
      // Add a flag to indicate this is from VisitDetails to prevent navigation loops
      fromVisitDetails: true,
    });
  };

  // Function to handle image viewing
  const handleViewImage = async imageUrl => {
    try {
      const response = await apiService.uploadFile.getURL(imageUrl);

      if (response.status === 200 && response.data.signedUrl) {
        const signedUrl = response.data.signedUrl;
        setSelectedImageUri(signedUrl);
        setShowImageModal(true);
      } else {
        Alert.alert("Error", "Unable to load image at this time");
      }
    } catch (error) {
      console.log("Error fetching image URL:", error);
      Alert.alert("Error", "Failed to load image");
    }
  };

  // Handle file upload for prescriptions and reports
  const handleFileUpload = async (file, type = "report") => {
    try {
      const files = file.files || [];
      const note = file.note || "";

      // Create FormData with proper structure for Multer
      const formData = createMultipleFileFormData(files, {
        note: note,
        doctorId: appDetails.doctorId, // Add doctorId if needed by backend
      });

      // Choose the correct API endpoint based on type
      const response =
        type === "prescription"
          ? await apiService.healthRecords.uploadPrescription(formData, appDetails.appointmentId)
          : await apiService.healthRecords.uploadReport(formData, appDetails.appointmentId);

      if (response.status === 200 || response.status === 201) {
        // Show success message
        ToastAndroid.show(
          `${type === "prescription" ? "Prescription" : "Report"} uploaded successfully!`,
          ToastAndroid.SHORT
        );

        setShowUploadModal(false);

        // Refresh the data to show newly uploaded files
        if (type === "prescription") {
          await getPrescriptions();
        } else {
          await getReports();
        }
      } else {
        ToastAndroid.show(`Failed to upload ${type}. Please try again.`, ToastAndroid.SHORT);
        console.log(`Failed to upload ${type}:`, response);
      }
    } catch (err) {
      console.log("🚨 Failed to upload file:", err);

      // More specific error handling
      if (err.response?.status === 400) {
        ToastAndroid.show("Invalid file format or missing required fields.", ToastAndroid.SHORT);
      } else if (err.response?.status === 413) {
        ToastAndroid.show("File size too large. Please choose smaller files.", ToastAndroid.SHORT);
      } else if (err.response?.status === 500) {
        ToastAndroid.show("Server error. Please try again later.", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Could not save document. Please try again.", ToastAndroid.SHORT);
      }
    }
  };

  // Helper function to format date from ISO string to DD/MM/YYYY
  const formatBirthDate = isoDateString => {
    if (!isoDateString) return null;

    try {
      const date = new Date(isoDateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.log("Error formatting birth date:", error);
      return null;
    }
  };

  // Navigate for Booking an appointment
  const navigateToBookAppointment = () => {
    // Create the data object for navigation
    let data;

    // Create the objects for behalfuserid present and absent
    if (appDetails.behalfUserId) {
      data = {
        form: {
          name: appDetails.behalfUserId.fullName,
          birthDate: formatBirthDate(appDetails.behalfUserId.birthDate),
          gender: appDetails.behalfUserId.gender,
          relation: appDetails.behalfUserId.relationship,
          age: appDetails.behalfUserId.age,
          behalfUserId: appDetails.behalfUserId.behalfUserId,
        },
        doctor: {
          doctorId: appDetails.doctorId,
        },
        appointmentId: appDetails.appointmentId,
        fromVisitDetails: true, // Add flag to prevent navigation loops
      };
    } else {
      data = {
        form: {
          name: "Self",
        },
        doctor: {
          doctorId: appDetails.doctorId,
        },
        appointmentId: appDetails.appointmentId,
        fromVisitDetails: true, // Add flag to prevent navigation loops
      };
    }

    navigation.navigate("SurveyDetails", data);
  };

  const renderSymptomsSection = () => {
    // Check if symptoms exist - handle both array and object structures
    const hasSymptoms =
      appointment?.symptoms &&
      (Array.isArray(appointment.symptoms)
        ? appointment.symptoms.length > 0
        : Object.keys(appointment.symptoms).length > 0);

    // Check if appointment is for someone else
    const isForSomeoneElse =
      appointment?.behalfUserId &&
      typeof appointment.behalfUserId === "object" &&
      appointment.behalfUserId.firstName;

    return (
      <View style={styles.symptomsMainContainer}>
        <View style={styles.symptomsHeader}>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="clipboard-pulse" size={24} color="#01869e" />
            <Text style={styles.symptomsTitle}>Symptoms</Text>
          </View>
        </View>

        {/* Show behalf user information if appointment is for someone else */}
        {isForSomeoneElse && (
          <View style={styles.behalfUserInfo}>
            <MaterialCommunityIcons name="account-multiple" size={16} color="#01869e" />
            <Text style={styles.behalfUserText}>
              Appointment for: {appointment.behalfUserId.firstName}{" "}
              {appointment.behalfUserId.lastName}
            </Text>
            <Text style={styles.behalfUserRelation}>({appointment.behalfUserId.relationship})</Text>
          </View>
        )}

        {hasSymptoms ? (
          <View style={styles.symptomsContentContainer}>
            <View style={styles.symptomsViewer}>
              {renderGroupedSymptoms(transformSymptomsToArray(appointment.symptoms))}
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={navigateToSurvey} style={styles.noSymptomsContainer}>
            <View style={styles.noSymptomsIconContainer}>
              <MaterialCommunityIcons
                name="clipboard-plus"
                size={48}
                color="#01869e"
                style={styles.noSymptomsIcon}
              />
            </View>
            <Text style={styles.noSymptomsText}>No symptoms recorded yet</Text>
            <Text style={styles.noSymptomsSubtext}>
              Add symptoms to help your doctor prepare for the consultation
            </Text>
            <View style={styles.noSymptomsButton}>
              <MaterialCommunityIcons name="plus" size={16} color="#01869e" />
              <Text style={styles.noSymptomsButtonText}>Tap to add symptoms</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.addSymptomsButton} onPress={navigateToSurvey}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addSymptomsText}>Add Symptoms</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Function to render grouped symptoms by date
  const renderGroupedSymptoms = (groupedSymptoms, maxItems = 3) => {
    if (!groupedSymptoms || groupedSymptoms.length === 0) return null;

    const toggleGroupExpansion = groupIndex => {
      setExpandedGroups(prev => ({
        ...prev,
        [groupIndex]: !prev[groupIndex],
      }));
    };

    const toggleDateExpansion = groupIndex => {
      setExpandedDates(prev => ({
        ...prev,
        [groupIndex]: !prev[groupIndex],
      }));
    };

    return groupedSymptoms.map((group, groupIndex) => {
      const isGroupExpanded = expandedGroups[groupIndex];
      const isDateExpanded = expandedDates[groupIndex];

      // Group symptoms by their symptomName
      const symptomsByCategory = {};
      group.symptoms.forEach(symptom => {
        const symptomName = symptom.symptomName;
        if (!symptomsByCategory[symptomName]) {
          symptomsByCategory[symptomName] = [];
        }
        symptomsByCategory[symptomName].push(symptom);
      });

      // Convert to array and limit items if needed
      const symptomCategories = Object.entries(symptomsByCategory);
      const shouldShowToggle = symptomCategories.length > maxItems;
      const displayedCategories = isGroupExpanded
        ? symptomCategories
        : symptomCategories.slice(0, maxItems);

      return (
        <View key={groupIndex} style={styles.symptomsGroup}>
          <TouchableOpacity
            style={styles.symptomsDateHeader}
            onPress={() => toggleDateExpansion(groupIndex)}
          >
            <View style={styles.symptomsDateContent}>
              <MaterialCommunityIcons name="calendar" size={16} color="#01869e" />
              <Text style={styles.symptomsDateText}>
                {(() => {
                  try {
                    const date = new Date(group.date);
                    if (isNaN(date.getTime())) {
                      return "Invalid Date";
                    }
                    return date.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } catch (error) {
                    return "Invalid Date";
                  }
                })()}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={isDateExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#01869e"
            />
          </TouchableOpacity>

          {isDateExpanded && (
            <>
              <View style={styles.symptomsContainer}>
                {displayedCategories.map(([symptomName, symptoms], categoryIndex) => {
                  // Get color for this symptom group
                  const groupColor = getSymptomGroupColor(symptomName);
                  return (
                    <View key={categoryIndex} style={styles.symptomCategory}>
                      <View
                        style={[
                          styles.symptomCategoryTitleWrapper,
                          groupColor
                            ? { backgroundColor: groupColor + "22", borderLeftColor: groupColor }
                            : {},
                        ]}
                      >
                        <Text
                          style={[
                            styles.symptomCategoryTitle,
                            groupColor ? { color: groupColor } : {},
                          ]}
                        >
                          {symptomName
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, str => str.toUpperCase())
                            .trim()}
                        </Text>
                      </View>

                      {/* Render individual symptom items */}
                      {symptoms.map((symptom, symptomIndex) => {
                        // Use the enhanced cleanSymptomPropertyLabel function
                        let label = symptom.label;

                        // Re-apply cleanSymptomPropertyLabel with the available data
                        // Extract property key from the label for body parts symptoms
                        if (symptom.section === "bodyParts") {
                          // Try to reconstruct the original property key from the symptom name and label
                          const symptomNameCamelCase = symptomName
                            .replace(/\s+/g, "")
                            .replace(/[^a-zA-Z]/g, "");
                          const possiblePropertyKey = `bodyParts${symptomNameCamelCase}${label.replace(/\s+/g, "").replace(/[^a-zA-Z]/g, "")}`;
                          label = cleanSymptomPropertyLabel(possiblePropertyKey, symptomName);
                        } else {
                          // Apply the standard logic for non-body parts
                          const symptomNameFormatted = symptomName
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, str => str.toUpperCase())
                            .trim();
                          if (label.toLowerCase().startsWith(symptomNameFormatted.toLowerCase())) {
                            label = label.substring(symptomNameFormatted.length).trim();
                          }
                        }

                        // Ensure proper capitalization
                        if (label && label.length > 0) {
                          label = label.charAt(0).toUpperCase() + label.slice(1);
                        }

                        // Optionally, customize label for certain keys
                        if (label.toLowerCase().includes("duration")) label = "Duration (in days)";
                        if (label.toLowerCase().includes("type")) label = "Type";
                        if (label.toLowerCase().includes("timing")) label = "Timing";

                        // Handle display value - hide URLs when image is available
                        let displayValue;
                        if (symptom.hasImage && symptom.imageUrl) {
                          // If this symptom has an image, show a clean display value without the URL
                          if (Array.isArray(symptom.value)) {
                            // Filter out URLs from arrays
                            const filteredValues = symptom.value.filter(
                              val =>
                                typeof val === "string" &&
                                !val.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi)
                            );
                            displayValue =
                              filteredValues.length > 0 ? filteredValues.join(", ") : "";
                          } else if (typeof symptom.value === "string") {
                            // If it's a string that contains an image URL, replace with clean text
                            const hasUrl = symptom.value.match(
                              /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi
                            );
                            displayValue = hasUrl ? "" : symptom.value;
                          } else {
                            displayValue = "";
                          }
                        } else {
                          // Normal display for non-image values
                          displayValue = Array.isArray(symptom.value)
                            ? symptom.value.join(", ")
                            : typeof symptom.value === "object" && symptom.value !== null
                              ? Object.entries(symptom.value)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")
                              : symptom.value;
                        }

                        return (
                          <View key={symptomIndex} style={styles.symptomItem}>
                            <View style={styles.symptomContent}>
                              <Text style={styles.symptomLabel}>{label}:</Text>
                              <Text style={styles.symptomValue}>{displayValue}</Text>
                            </View>
                            {symptom.hasImage && symptom.imageUrl && (
                              <TouchableOpacity
                                style={styles.viewImageButton}
                                onPress={() => handleViewImage(symptom.imageUrl)}
                              >
                                <MaterialCommunityIcons name="image" size={16} color="#01869e" />
                                <Text style={styles.viewImageText}>View Image</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>

              {shouldShowToggle && (
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleGroupExpansion(groupIndex)}
                >
                  <MaterialCommunityIcons
                    name={isGroupExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#01869e"
                  />
                  <Text style={styles.toggleButtonText}>
                    {isGroupExpanded
                      ? "View less"
                      : `View ${symptomCategories.length - maxItems} more`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      );
    });
  };

  const transformSymptomsToArray = symptomsData => {
    if (!symptomsData) return [];

    const symptomsGroupedByDate = [];

    // Symptoms will always come as an array
    const symptomsList = Array.isArray(symptomsData) ? symptomsData : [symptomsData];

    symptomsList.forEach((symptomsObj, index) => {
      if (!symptomsObj || typeof symptomsObj !== "object") return;

      const createdAt = symptomsObj.createdAt;
      const symptomsForThisDate = [];

      // Validate the createdAt date and provide fallback
      let validDate = createdAt;
      if (!createdAt) {
        validDate = new Date().toISOString(); // Use current date as fallback
      }

      // Process each symptom section (generalSymptoms, bodyExcretion, skin, bodyParts, others)
      Object.entries(symptomsObj).forEach(([sectionKey, sectionData]) => {
        if (sectionKey === "createdAt" || sectionKey === "behalfUserId" || !sectionData) return;

        if (typeof sectionData === "object" && sectionData !== null) {
          Object.entries(sectionData).forEach(([categoryKey, categoryData]) => {
            if (categoryData === null) return; // skip null categories
            if (typeof categoryData === "object" && categoryData !== null) {
              // Check if the categoryData is a nested object with properties
              const hasNestedProperties = Object.values(categoryData).some(
                value => typeof value === "object" && value !== null && !Array.isArray(value)
              );

              if (hasNestedProperties) {
                // Handle nested symptom objects (like cough with coughType, coughTiming, etc.)
                Object.entries(categoryData).forEach(([symptomKey, symptomValue]) => {
                  if (
                    typeof symptomValue === "object" &&
                    symptomValue !== null &&
                    !Array.isArray(symptomValue)
                  ) {
                    // This is a nested symptom object
                    Object.entries(symptomValue).forEach(([propertyKey, propertyValue]) => {
                      // Skip empty values
                      if (
                        !propertyValue ||
                        (Array.isArray(propertyValue) && propertyValue.length === 0)
                      )
                        return;

                      // Create friendly label for the property
                      const friendlyPropertyLabel = cleanSymptomPropertyLabel(
                        propertyKey,
                        symptomKey
                      );

                      // Check if the value contains an image URL
                      const imageUrl = detectImageUrl(propertyValue);

                      symptomsForThisDate.push({
                        label: friendlyPropertyLabel,
                        value: propertyValue,
                        imageUrl: imageUrl,
                        hasImage: !!imageUrl,
                        section: sectionKey,
                        category: categoryKey,
                        symptomName: symptomKey, // Store the main symptom name
                        isNested: true,
                      });
                    });
                  } else {
                    // This is a simple value
                    if (!symptomValue || (Array.isArray(symptomValue) && symptomValue.length === 0))
                      return;

                    // Create friendly label
                    const friendlyLabel = symptomKey
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, str => str.toUpperCase())
                      .replace(/-/g, " ")
                      .trim();

                    // Check if the value contains an image URL
                    const imageUrl = detectImageUrl(symptomValue);

                    symptomsForThisDate.push({
                      label: friendlyLabel,
                      value: symptomValue,
                      imageUrl: imageUrl,
                      hasImage: !!imageUrl,
                      section: sectionKey,
                      category: categoryKey,
                      symptomName: categoryKey,
                      isNested: false,
                    });
                  }
                });
              } else {
                // Handle simple key-value pairs
                Object.keys(categoryData).forEach(key => {
                  const value = categoryData[key];

                  // Skip empty values
                  if (!value || (Array.isArray(value) && value.length === 0)) return;

                  // Create friendly label
                  const friendlyLabel = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/-/g, " ")
                    .trim();

                  // Check if the value contains an image URL
                  const imageUrl = detectImageUrl(value);

                  symptomsForThisDate.push({
                    label: friendlyLabel,
                    value: value,
                    imageUrl: imageUrl,
                    hasImage: !!imageUrl,
                    section: sectionKey,
                    category: categoryKey,
                    symptomName: categoryKey,
                    isNested: false,
                  });
                });
              }
            }
          });
        }
      });

      if (symptomsForThisDate.length > 0) {
        symptomsGroupedByDate.push({
          date: validDate,
          symptoms: symptomsForThisDate,
        });
      }
    });
    return symptomsGroupedByDate;
  };

  // Function to detect and handle image URLs
  const detectImageUrl = value => {
    // Handle arrays of URLs
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          const imageUrlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi;
          const match = item.match(imageUrlRegex);
          if (match) {
            return match[0];
          }
        }
      }
      return null;
    }

    // Handle string values
    if (typeof value !== "string") return null;

    const imageUrlRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|webp))/gi;
    const match = value.match(imageUrlRegex);

    return match ? match[0] : null;
  };

  // Skeleton loader component
  const SkeletonLoader = () => {
    const [fadeAnim] = useState(new Animated.Value(0.3));

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [fadeAnim]);

    return (
      <ScrollView style={styles.container}>
        {/* Doctor Card Skeleton */}
        <View style={styles.skeletonCard}>
          <Animated.View style={[styles.skeletonDoctorGradient, { opacity: fadeAnim }]}>
            <View style={styles.skeletonDoctorHeader}>
              <Animated.View style={[styles.skeletonDoctorImage, { opacity: fadeAnim }]} />
              <View style={styles.skeletonDoctorInfo}>
                <Animated.View style={[styles.skeletonDoctorName, { opacity: fadeAnim }]} />
                <Animated.View style={[styles.skeletonDoctorSpecialty, { opacity: fadeAnim }]} />
                <Animated.View style={[styles.skeletonDoctorExperience, { opacity: fadeAnim }]} />
              </View>
            </View>
          </Animated.View>
          <View style={styles.skeletonDoctorDetails}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.skeletonDetailRow}>
                <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
                <View style={styles.skeletonDetailContent}>
                  <Animated.View style={[styles.skeletonDetailLabel, { opacity: fadeAnim }]} />
                  <Animated.View style={[styles.skeletonDetailValue, { opacity: fadeAnim }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Appointment Card Skeleton */}
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonCardHeader}>
            <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonCardTitle, { opacity: fadeAnim }]} />
          </View>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonAppointmentRow}>
              <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.skeletonLabel, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.skeletonValue, { opacity: fadeAnim }]} />
            </View>
          ))}
        </View>

        {/* Symptoms Card Skeleton */}
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonCardHeader}>
            <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonCardTitle, { opacity: fadeAnim }]} />
          </View>
          <View style={styles.skeletonSymptomsContent}>
            <Animated.View style={[styles.skeletonSymptomsBlock, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonSymptomsBlock, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonButton, { opacity: fadeAnim }]} />
          </View>
        </View>

        {/* Documents Skeletons */}
        {Array.from({ length: 2 }).map((_, cardIndex) => (
          <View key={cardIndex} style={styles.skeletonCard}>
            <View style={styles.skeletonCardHeader}>
              <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.skeletonCardTitle, { opacity: fadeAnim }]} />
            </View>
            <View style={styles.skeletonEmptySection}>
              <Animated.View style={[styles.skeletonEmptyIcon, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.skeletonEmptyText, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.skeletonEmptySubtext, { opacity: fadeAnim }]} />
            </View>
            <Animated.View style={[styles.skeletonButton, { opacity: fadeAnim }]} />
          </View>
        ))}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="clock-outline" size={48} color="#01869e" />
          <Text style={styles.loadingText}>Loading appointment details...</Text>
        </View>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#dc3545" />
        <Text style={styles.errorText}>Appointment not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Doctor Profile Section */}
      <View style={styles.profileSection}>
        <DoctorProfileCard doctorDetails={doctorDetails} />
      </View>

      {/* Button Navigation */}
      <View style={styles.buttonNavigation}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === "appointments" && styles.activeNavButton]}
          onPress={() => setActiveTab("appointments")}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={18}
            color={activeTab === "appointments" ? "#fff" : "#01869e"}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === "appointments" && styles.activeNavButtonText,
            ]}
            numberOfLines={1}
          >
            Appointments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === "symptoms" && styles.activeNavButton]}
          onPress={() => setActiveTab("symptoms")}
        >
          <MaterialCommunityIcons
            name="clipboard-pulse"
            size={18}
            color={activeTab === "symptoms" ? "#fff" : "#01869e"}
          />
          <Text
            style={[styles.navButtonText, activeTab === "symptoms" && styles.activeNavButtonText]}
            numberOfLines={1}
          >
            Symptoms
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === "prescriptions" && styles.activeNavButton]}
          onPress={() => setActiveTab("prescriptions")}
        >
          <MaterialCommunityIcons
            name="pill"
            size={18}
            color={activeTab === "prescriptions" ? "#fff" : "#01869e"}
          />
          <Text
            style={[
              styles.navButtonText,
              activeTab === "prescriptions" && styles.activeNavButtonText,
            ]}
            numberOfLines={1}
          >
            Prescriptions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === "reports" && styles.activeNavButton]}
          onPress={() => setActiveTab("reports")}
        >
          <MaterialCommunityIcons
            name="file-document-outline"
            size={18}
            color={activeTab === "reports" ? "#fff" : "#01869e"}
          />
          <Text
            style={[styles.navButtonText, activeTab === "reports" && styles.activeNavButtonText]}
            numberOfLines={1}
          >
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'notes' && styles.activeNavButton]}
          onPress={() => setActiveTab('notes')}
        >
          <MaterialCommunityIcons 
            name="notebook-outline" 
            size={18} 
            color={activeTab === 'notes' ? '#fff' : '#01869e'} 
          />
          <Text style={[styles.navButtonText, activeTab === 'notes' && styles.activeNavButtonText]} numberOfLines={1}>
            Notes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {activeTab === "appointments" && (
          <AppointmentsTab
            appointment={appointment}
            appDetails={appDetails}
            navigation={navigation}
            navigateToBookAppointment={navigateToBookAppointment}
            followupAppointments={followupAppointments}
            expandedAppointments={expandedAppointments}
            setExpandedAppointments={setExpandedAppointments}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === "symptoms" && (
          <SymptomsTab
            appointment={appointment}
            navigateToSurvey={navigateToSurvey}
            handleViewImage={handleViewImage}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === "prescriptions" && (
          <PrescriptionsTab
            appointment={appointment}
            appDetails={appDetails}
            handleFileUpload={handleFileUpload}
            setUploadType={setUploadType}
            setShowUploadModal={setShowUploadModal}
            refreshing={refreshing}
            onRefresh={onRefresh}
            getPrescriptions={getPrescriptions}
          />
        )}

        {activeTab === "reports" && (
          <ReportsTab
            appointment={appointment}
            handleFileUpload={handleFileUpload}
            setUploadType={setUploadType}
            setShowUploadModal={setShowUploadModal}
            refreshing={refreshing}
            onRefresh={onRefresh}
            getReports={getReports}
          />
        )}

        {activeTab === 'notes' && (
          <NotesTab appointment={appointment} refreshing={refreshing} onRefresh={onRefresh} />
        )}
      </View>

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal
          isVisible={showUploadModal}
          onBackdropPress={() => setShowUploadModal(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <DocumentUploader
            onUpload={handleFileUpload}
            uploadType={uploadType} // report or prescription
          />
        </Modal>
      )}

      {/* Image Viewer Modal */}
      <Modal
        isVisible={showImageModal}
        onBackdropPress={() => setShowImageModal(false)}
        style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
      >
        <View style={styles.imageModalContent}>
          <View style={styles.imageModalHeader}>
            <Text style={styles.imageModalTitle}>Symptom Image</Text>
            <TouchableOpacity
              onPress={() => setShowImageModal(false)}
              style={styles.imageModalCloseButton}
            >
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {selectedImageUri ? (
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.modalImage}
              resizeMode="contain"
              onLoadStart={() => console.log("🖼️ Image loading started")}
              onLoad={() => console.log("✅ Image loaded successfully")}
              onError={error => {
                console.log("❌ Image failed to load:", error);
                console.log("🔗 Failed URL:", selectedImageUri);
              }}
              onLoadEnd={() => console.log("🏁 Image loading ended")}
            />
          ) : (
            <View style={styles.modalImagePlaceholder}>
              <MaterialCommunityIcons name="image-off" size={64} color="#666" />
              <Text style={styles.modalImagePlaceholderText}>No image URL available</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  profileSection: {
    height: 140,
    backgroundColor: "#f8f9fa",
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "#01869e",
    justifyContent: "center",
  },
  // Profile Card Styles - Updated for compact design
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#01869e",
    padding: 16,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileAvatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e8f4f8",
  },
  profileAvatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#01869e",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  profileSpecialization: {
    fontSize: 14,
    color: "#e8f4f8",
    marginBottom: 3,
  },
  profileExperience: {
    fontSize: 12,
    color: "#e8f4f8",
    marginBottom: 2,
  },
  profileId: {
    fontSize: 11,
    color: "#e8f4f8",
    fontStyle: "italic",
  },
  // Tab Content Styles
  tabContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    paddingBottom: 100, // Provides gap after the lists
  },
  emptyTabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTabText: {
    fontSize: 18,
    color: "#666",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyTabSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  // Appointment Details Card Styles
  appointmentDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appointmentDetailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#01869e",
    marginLeft: 8,
  },
  appointmentDetailsContent: {
    padding: 16,
    paddingTop: 12,
  },
  appointmentDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  appointmentDetailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    minWidth: 60,
  },
  appointmentDetailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  // Appointments Tab Styles
  appointmentsList: {
    marginBottom: 20,
  },
  appointmentItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#01869e",
    marginLeft: 8,
  },
  appointmentType: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  appointmentStatus: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  completedStatus: {
    color: "#4CAF50",
  },
  followUpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01869e",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  followUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Modal Styles
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "80%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#dc3545",
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#01869e",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  //button styles
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01869e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 16,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Doctor Card Styles
  doctorCard: {
    margin: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  doctorGradient: {
    padding: 20,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#e8f4f8",
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 14,
    color: "#e8f4f8",
    marginBottom: 4,
  },
  doctorId: {
    fontSize: 12,
    color: "#e8f4f8",
    fontStyle: "italic",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#e8f4f8",
  },
  doctorDetails: {
    padding: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  addSymptom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01869e",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginLeft: "auto",
    marginTop: 10,
    // marginRight: 8,
    // width: "100%",
  },

  appointmentCard: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    borderRadius: 10,
    padding: 10,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },

  // Behalf user styles
  behalfUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#01869e",
  },
  behalfUserText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
  },
  behalfUserRelation: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontStyle: "italic",
  },

  appointmentDetails: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },

  icon: {
    marginRight: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 6,
    minWidth: 75,
  },

  value: {
    fontSize: 14,
    color: "#555",
    flexShrink: 1,
  },

  // Symptoms Card Styles
  symptomsContainerCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 12,
    paddingVertical: 10,
  },

  // Enhanced Symptoms Section Styles
  symptomsMainContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },

  symptomsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f4f8",
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  symptomsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#01869e",
    marginLeft: 12,
  },

  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
  },

  statusComplete: {
    backgroundColor: "#e8f5e8",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },

  statusPending: {
    backgroundColor: "#fff3e0",
    borderWidth: 1,
    borderColor: "#FF9800",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  statusCompleteText: {
    color: "#4CAF50",
  },

  statusPendingText: {
    color: "#FF9800",
  },

  symptomsContentContainer: {
    marginTop: 8,
  },

  symptomsTimestamp: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#01869e",
  },

  symptomsViewer: {
    backgroundColor: "#fdfdfd",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8f4f8",
  },

  noSymptomsContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e8f4f8",
    borderStyle: "dashed",
    marginVertical: 16,
  },

  noSymptomsIconContainer: {
    backgroundColor: "#e8f4f8",
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },

  noSymptomsIcon: {
    opacity: 0.7,
  },

  noSymptomsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#01869e",
    marginBottom: 8,
    textAlign: "center",
  },

  noSymptomsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  noSymptomsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#01869e",
  },

  noSymptomsButtonText: {
    fontSize: 14,
    color: "#01869e",
    fontWeight: "600",
    marginLeft: 6,
  },

  addSymptomsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01869e",
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: "#01869e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  addSymptomsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  symptomsCard: {
    margin: 10,
    marginTop: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 12,
    padding: 10,
  },
  symptomsContent: {
    padding: 20,
    paddingTop: 16,
  },
  symptomSection: {
    marginBottom: 20,
  },
  symptomSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#01869e",
    marginBottom: 12,
    textTransform: "capitalize",
  },
  symptomCategory: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f4f8",
  },
  symptomCategoryTitleWrapper: {
    borderLeftWidth: 6,
    borderRadius: 6,
    marginBottom: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: "#e8f4f8",
    alignSelf: "flex-start",
  },
  symptomCategoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#01869e",
    textTransform: "capitalize",
  },
  symptomQuestion: {
    marginBottom: 12,
  },
  questionAnswerRow: {
    paddingLeft: 12,
  },
  questionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: "#666",
    paddingLeft: 8,
  },
  answerListContainer: {
    paddingLeft: 8,
  },
  answerListItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  updateDate: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    fontStyle: "italic",
  },

  // Action Container Styles
  actionContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#01869e",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#01869e",
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: "#01869e",
    fontSize: 16,
    fontWeight: "600",
  },
  documentsCard: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  uploadedItemContainer: {
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 10,
  },

  uploadedImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },

  uploadedNote: {
    marginTop: 6,
    fontSize: 14,
    color: "#333",
  },

  emptySection: {
    alignItems: "center",
    padding: 30,
    paddingTop: 20,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
    marginBottom: 4,
  },

  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },

  // Doctor Notes Styles
  notesCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 10,
  },

  notesContainer: {
    padding: 10,
  },

  noteItem: {
    marginBottom: 16,
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  noteIcon: {
    marginRight: 8,
  },

  noteDate: {
    fontSize: 13,
    color: "#01869e",
    fontWeight: "600",
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },

  noteContent: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#01869e",
  },

  noteText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    fontStyle: "italic",
  },

  noteDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 12,
    marginHorizontal: 8,
  },

  // Prescription note styles
  prescriptionNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#01869e",
  },
  prescriptionNoteText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    fontStyle: "italic",
  },

  // Skeleton Loader Styles
  skeletonCard: {
    margin: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skeletonDoctorGradient: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f4f8",
  },
  skeletonDoctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skeletonDoctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
  },
  skeletonDoctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonDoctorName: {
    width: "60%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonDoctorSpecialty: {
    width: "40%",
    height: 14,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonDoctorExperience: {
    width: "30%",
    height: 14,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  skeletonDoctorDetails: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  skeletonDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  skeletonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    width: "50%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginLeft: 10,
  },
  skeletonAppointmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  skeletonLabel: {
    width: "30%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  skeletonValue: {
    width: "70%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "#e0e0e0",
  },
  skeletonSymptomsContent: {
    padding: 16,
  },
  skeletonSymptomsBlock: {
    height: 14,
    borderRadius: 7,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  skeletonButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "#01869e",
    marginTop: 12,
  },
  skeletonEmptySection: {
    alignItems: "center",
    padding: 30,
    paddingTop: 20,
  },
  skeletonEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  skeletonEmptyText: {
    width: "60%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonEmptySubtext: {
    width: "80%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },

  // Image Modal styles
  imageModalContent: {
    backgroundColor: "#000",
    borderRadius: 12,
    width: "95%",
    height: "80%",
    overflow: "hidden",
  },
  imageModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 16,
  },
  imageModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  imageModalCloseButton: {
    padding: 8,
  },
  modalImage: {
    flex: 1,
    width: "100%",
  },
  modalImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  modalImagePlaceholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },

  // Grouped symptoms styles
  symptomsGroup: {
    marginBottom: 20,
  },
  symptomsDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#01869e",
  },
  symptomsDateContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  symptomsDateText: {
    fontSize: 16,
    color: "#01869e",
    fontWeight: "bold",
    marginLeft: 6,
  },
  symptomsContainer: {
    backgroundColor: "#fdfdfd",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8f4f8",
  },
  symptomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  symptomValueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  symptomValue: {
    // flex: 1,
    fontSize: 14,
    color: "#01869e",
    fontWeight: "400",
    textAlign: "right",
    width: "48%",
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  symptomContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  symptomLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    width: "48%",
    textAlign: "left",
  },
  viewImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewImageText: {
    fontSize: 12,
    color: "#01869e",
    marginLeft: 4,
    fontWeight: "600",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  toggleButtonText: {
    fontSize: 12,
    color: "#01869e",
    fontWeight: "600",
    marginLeft: 4,
  },

  // Follow-up Appointment Card Styles
  followupAppointmentCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  followupAppointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  followupAppointmentInfo: {
    flex: 1,
  },
  followupAppointmentTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  followupAppointmentDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#01869e",
    marginLeft: 8,
  },
  followupAppointmentTime: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  followupAppointmentStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  followupAppointmentStatusText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "600",
  },
  followupAppointmentDetails: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#f8f9fa",
  },
  followupDetailsSection: {
    marginBottom: 16,
  },
  followupDetailsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#01869e",
    marginBottom: 12,
  },
  followupDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  followupDetailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    minWidth: 80,
  },
  followupDetailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  followupSymptomItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  followupSymptomText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  followupSeverityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  followupSeverityText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  followupPrescriptionItem: {
    marginBottom: 12,
  },
  followupPrescriptionName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  followupPrescriptionDosage: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  followupPrescriptionInstructions: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  followupNoteItem: {
    marginBottom: 12,
  },
  followupNoteText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  followupNoteDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  followupAppointmentsContainer: {
    backgroundColor: "#fff",
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  followupAppointmentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#01869e",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  followupSymptomContainer: {
    marginBottom: 8,
  },
  followupPrescriptionDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  followupPrescriptionFiles: {
    fontSize: 12,
    color: "#01869e",
    marginTop: 4,
    fontStyle: "italic",
  },
  emptyFollowupContent: {
    padding: 16,
    alignItems: "center",
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },

  // Button Navigation Styles
  buttonNavigation: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 1,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minHeight: 50,
  },
  activeNavButton: {
    backgroundColor: "#01869e",
    borderColor: "#01869e",
  },
  navButtonText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#01869e",
    marginTop: 2,
    textAlign: "center",
    numberOfLines: 1,
  },
  activeNavButtonText: {
    color: "#fff",
  },
  tabContentContainer: {
    flex: 1,
  },
});

export default VisitDetailsScreen;
