import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  ToastAndroid,
  StatusBar,
  Image,
} from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
// import { addAppointment } from "../utils/storage";
import { PrimaryButton, SecondaryButton, LoadingSpinner } from "../components/UIComponents";
import apiService from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnalyticsService } from "../utils/analytics";

const { width } = Dimensions.get("window");
const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BookAppointmentScreen = ({ route, navigation }) => {
  const {
    doctor, // Doctor data
    surveyDetails, // symptoms data
    form, // Patient details
    appointmentId, // If appointmentId is present, it means the user is booking a follow-up appointment
  } = route.params;

  // Add scrollView ref for automatic scrolling
  const scrollViewRef = useRef(null);

  // Get doctor's details using doctorId
  const [doctorDetails, setDoctorDetails] = useState(null);
  const getDoctorDetails = async () => {
    try {
      const response = await apiService.profile.getDoctorDetails(doctor.doctorId);
      setDoctorDetails(response.data);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  useEffect(() => {
    getDoctorDetails();
  }, [doctor.doctorId]);

  // Track screen view
  useEffect(() => {
    AnalyticsService.logScreenView("BookAppointment", "BookAppointmentScreen");

    // Track doctor profile view
    AnalyticsService.logDoctorProfileViewed({
      id: doctor.doctorId,
      specialty: doctorDetails?.specialty || "unknown",
      rating: doctorDetails?.rating || null,
    });
  }, [doctor.doctorId, doctorDetails]);

  // const checkOngoingTreatments = async () => {
  //   try {
  //     // Prepare params: always doctorId, add behalfUserId if present
  //     const params = { doctorId: doctor.doctorId };
  //     if (form?.behalfUserId) {
  //       params.behalfUserId = form.behalfUserId;
  //     }

  //     const response = await apiService.appointments.checkOngoingTreatments(params);

  //     if (response.data.type === "ongoing") {
  //       // If ongoing treatment exists, show note
  //       setTreatmentModalData({
  //         type: "ongoing",
  //         doctorName: doctor.firstName + " " + doctor.lastName,
  //       });
  //     } else if (response.data.type === "upcoming") {
  //       // If upcoming appointment exists, show note
  //       setTreatmentModalData({
  //         type: "upcoming",
  //         doctorName: doctor.firstName + " " + doctor.lastName,
  //         appointments: response.data.appointments || [response.data], // Handle both single and multiple appointments
  //       });
  //     } else {
  //       // No ongoing treatment, proceed with booking
  //       console.log("No ongoing treatment found, proceeding with booking.");
  //     }
  //   } catch (error) {
  //     console.log("Error checking ongoing treatments:", error);
  //   }
  // };

  // useEffect(() => {
  //   checkOngoingTreatments();
  // }, [doctor.doctorId]);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState(null);
  const [selectedDateData, setSelectedDateData] = useState(null); // Store the selected date's full data
  const [doctorScheduleData, setDoctorScheduleData] = useState([]); // Store complete schedule data
  const [availableDates, setAvailableDates] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [allTimeSlotsForDate, setAllTimeSlotsForDate] = useState([]); // NEW: all time slots for selected date
  const [reason, setReason] = useState("");
  const [hasSurvey, setHasSurvey] = useState(!!surveyDetails);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [treatmentModalData, setTreatmentModalData] = useState(null);

  // Generate available dates and calendar layout
  const getAvailableDates = async () => {
    try {
      setLoadingDates(true);
      const response = await apiService.doctors.getAvailableDates(doctor.doctorId);

      if (response.status === 200 || response.status === 201) {
        // Store the complete schedule data
        setDoctorScheduleData(response.data);

        // Extract all unique dates from all locations
        const allDates = [];
        response.data.forEach(locationData => {
          locationData.specificDates.forEach(dateData => {
            allDates.push({
              date: new Date(dateData.date),
              locationId: locationData._id,
              location: locationData.location,
              dateId: dateData._id,
              timeSlots: dateData.timeSlots,
            });
          });
        });

        setAvailableDates(allDates);
        generateCalendarDates(currentMonth, allDates);
      }
    } catch (error) {
      console.error("Error fetching available dates:", error);
      // Fallback to empty array if API fails
      setAvailableDates([]);
      setDoctorScheduleData([]);
      generateCalendarDates(currentMonth, []);
    } finally {
      setLoadingDates(false);
    }
  };
  useEffect(() => {
    getAvailableDates();
  }, []);

  // Update calendar when month changes
  useEffect(() => {
    if (availableDates.length > 0) {
      generateCalendarDates(currentMonth, availableDates);
    }
  }, [currentMonth, availableDates]);

  const getLocationsForDate = selectedDate => {
    try {
      setLoadingLocations(true);

      // Find all locations that have the selected date
      const locationsForDate = [];
      const selectedDateString = selectedDate.toDateString();

      // Group available dates by location for the selected date
      const locationMap = new Map();

      availableDates.forEach(dateData => {
        if (dateData.date.toDateString() === selectedDateString) {
          if (!locationMap.has(dateData.location)) {
            locationMap.set(dateData.location, {
              location: dateData.location,
              locationId: dateData.locationId,
              dateId: dateData.dateId,
              timeSlots: dateData.timeSlots,
            });
          }
        }
      });

      const locationsArray = Array.from(locationMap.values());
      setAvailableLocations(locationsArray);
    } catch (error) {
      console.error("Error processing locations for date:", error);
      setAvailableLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const generateCalendarDates = (month, availableDatesData) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    // Get first day of the month and number of days
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const dates = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const today = new Date();

      // Find if this date is available in any location
      const isAvailable = availableDatesData.some(
        item => item.date.toDateString() === date.toDateString()
      );
      const isPast = date < today;

      dates.push({
        date,
        day,
        isAvailable,
        isPast,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    setCalendarDates(dates);
  };

  // Update available locations and all time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableLocations([]);
      setSelectedLocation(null);
      setSelectedTime(null);
      setSelectedTimeSlotId(null);
      setSelectedDateData(null);
      setAllTimeSlotsForDate([]); // reset
      return;
    }

    // Get locations for the selected date
    getLocationsForDate(selectedDate);

    // Gather all time slots for all locations for this date
    const selectedDateString = selectedDate.toDateString();
    const allSlots = [];
    availableDates.forEach(dateData => {
      if (dateData.date.toDateString() === selectedDateString) {
        (dateData.timeSlots || []).forEach(slot => {
          allSlots.push({
            ...slot,
            location: dateData.location,
            locationId: dateData.locationId,
          });
        });
      }
    });
    setAllTimeSlotsForDate(allSlots);

    // Reset selected location and time when date changes
    setSelectedLocation(null);
    setSelectedTime(null);
    setSelectedTimeSlotId(null);
  }, [selectedDate, availableDates]);

  // Update available time slots when location is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      setSelectedTime(null);
      setSelectedTimeSlotId(null);
      return;
    }
    if (!selectedLocation) {
      // No location selected: show all time slots for the date
      setAvailableTimeSlots(allTimeSlotsForDate);
      setSelectedTime(null);
      setSelectedTimeSlotId(null);
      return;
    }
    // Filter time slots for selected location
    const filtered = allTimeSlotsForDate.filter(
      slot => slot.locationId === selectedLocation.locationId
    );
    setAvailableTimeSlots(filtered);
    
    // Only reset selected time if it's not available for the selected location
    if (selectedTime && !filtered.some(slot => slot._id === selectedTime._id)) {
      setSelectedTime(null);
      setSelectedTimeSlotId(null);
    }
  }, [selectedLocation, allTimeSlotsForDate, selectedDate]);

  const formatDate = date => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatDateShort = date => {
    return `${date.getDate()}`;
  };

  const getMonthYear = date => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const navigateMonth = direction => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
    // Calendar will be regenerated by the useEffect that depends on currentMonth
  };

  const renderCalendar = () => {
    // Group calendar dates into weeks
    const weeks = [];
    let currentWeek = [];

    calendarDates.forEach((dateObj, index) => {
      currentWeek.push(dateObj);
      if (currentWeek.length === 7 || index === calendarDates.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return (
      <View style={styles.calendarContainer}>
        {/* Calendar Header with Navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth(-1)}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#007bff" />
          </TouchableOpacity>

          <Text style={styles.monthTitle}>{getMonthYear(currentMonth)}</Text>

          <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth(1)}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={styles.weekDaysHeader}>
          {dayMap.map(day => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((dateObj, dayIndex) => {
              if (!dateObj) {
                return <View key={`empty-${dayIndex}`} style={styles.dateCell} />;
              }

              const { date, day, isAvailable, isPast, isToday } = dateObj;
              const isSelected = selectedDate?.toDateString() === date?.toDateString();
              const canSelect = isAvailable && !isPast && !isToday;

              const handleDatePress = () => {
                if (canSelect) {
                  setSelectedDate(date);
                  // Scroll to bottom to show location and time options with smooth animation
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({
                      animated: true,
                    });
                  }, 300);
                } else if (!isPast && !isToday && !isAvailable) {
                  Alert.alert("Unavailable Date", "The doctor doesn't see patients on this day.");
                }
              };

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dateCell,
                    isSelected && styles.selectedDateCell,
                    isPast && styles.pastDateCell,
                    isToday && styles.todayDateCell,
                  ]}
                  onPress={handleDatePress}
                  disabled={isPast || isToday}
                >
                  <Text
                    style={[
                      styles.dateCellText,
                      isSelected && styles.selectedDateCellText,
                      isPast && styles.pastDateCellText,
                      isToday && styles.todayDateCellText,
                    ]}
                  >
                    {day}
                  </Text>
                  {/* Dot indicator for available dates */}
                  {isAvailable && !isPast && !isToday && (
                    <View
                      style={[styles.availableDot, isSelected && styles.selectedAvailableDot]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
            {/* Fill remaining cells in the week */}
            {week.length < 7 &&
              Array.from({ length: 7 - week.length }).map((_, index) => (
                <View key={`fill-${index}`} style={styles.dateCell} />
              ))}
          </View>
        ))}
      </View>
    );
  };

  const handleShowSummary = () => {
    if (!selectedDate || !selectedLocation || !selectedTime) {
      Alert.alert("Error", "Please select date, location and time");
      return;
    }
    setShowSummaryModal(true);
  };

  const deleteSavedSymtomsInStorage = async () => {
    try {
      await AsyncStorage.multiRemove(["surveyAnswer", "answersWithLabels"]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      setLoading(true);

      // Convert selectedDate to ISO string format while preserving the local date
      // This prevents timezone conversion issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const isoDate = `${year}-${month}-${day}T00:00:00.000Z`;

      // Create appointment object
      const data = {
        ...form,
        date: isoDate,
        appointmentCreatedId: selectedLocation?.locationId,
        parentAppointmentId: appointmentId, // If appointmentId is present, it means the user is booking a follow-up appointment
        timeSlotId: selectedTimeSlotId,
        symptoms: surveyDetails,
      };

      const response = await apiService.appointments.bookAppointment(doctor.doctorId, data);

      if (response.status === 200) {
        ToastAndroid.show("Appointment booked successfully", ToastAndroid.SHORT);

        // Track appointment booking analytics
        await AnalyticsService.logAppointmentBooked({
          doctorId: doctor.doctorId,
          specialty: doctorDetails?.specialty || "unknown",
          type: appointmentId ? "follow_up" : "new",
          bookingMethod: "app",
        });

        // Track additional appointment details
        await AnalyticsService.logEvent("appointment_booking_details", {
          appointment_date: isoDate,
          time_slot_id: selectedTimeSlotId,
          location_id: selectedLocation?.locationId,
          has_symptoms: !!surveyDetails,
          symptoms_count: surveyDetails?.length || 0,
          is_follow_up: !!appointmentId,
        });

        await deleteSavedSymtomsInStorage();
        // Reset navigation stack and navigate to AppointmentsScreen
        navigation.reset({
          index: 1,
          routes: [
            {
              name: "MainDrawer",
            },
            {
              name: "AppointmentsScreen",
              params: {
                screen: "RequestedAppointmentsScreen",
              },
            },
          ],
        });
      } else {
        ToastAndroid.show("Failed to book appointment", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Check for specific error codes
      if (error.status === 409) {
        ToastAndroid.show(
          "You have already booked an appointment for this date",
          ToastAndroid.SHORT
        );
        return;
      }
    } finally {
      setLoading(false);
      setShowSummaryModal(false);
    }
  };

  // Animated Shimmer Component
  const ShimmerBox = ({ style }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const shimmer = () => {
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => shimmer());
      };
      shimmer();
    }, [shimmerAnimation]);

    const opacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return <Animated.View style={[styles.skeletonBox, style, { opacity }]} />;
  };

  // Skeleton loader components
  const CalendarSkeleton = () => (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <ShimmerBox style={{ width: 40, height: 40, borderRadius: 8 }} />
        <ShimmerBox style={{ width: 150, height: 24, borderRadius: 4 }} />
        <ShimmerBox style={{ width: 40, height: 40, borderRadius: 8 }} />
      </View>
      <View style={styles.weekDaysHeader}>
        {Array.from({ length: 7 }).map((_, index) => (
          <ShimmerBox key={index} style={{ width: 30, height: 16, borderRadius: 2 }} />
        ))}
      </View>
      {Array.from({ length: 6 }).map((_, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <ShimmerBox key={dayIndex} style={[styles.dateCell, { borderRadius: 8 }]} />
          ))}
        </View>
      ))}
    </View>
  );

  const LocationsSkeleton = () => (
    <View style={styles.optionsContainer}>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={[styles.optionCard, styles.skeletonContainer]}>
          <ShimmerBox style={{ width: 24, height: 24, borderRadius: 4 }} />
          <ShimmerBox style={{ flex: 1, height: 20, borderRadius: 4, marginLeft: 12 }} />
        </View>
      ))}
    </View>
  );

  const TimeSlotsSkeleton = () => (
    <View style={styles.timeSlotsContainer}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={[styles.timeSlotCard, styles.skeletonContainer]}>
          <ShimmerBox style={{ width: 20, height: 20, borderRadius: 4 }} />
          <ShimmerBox style={{ width: 120, height: 16, borderRadius: 4, marginLeft: 8 }} />
        </View>
      ))}
    </View>
  );

  // Handler for treatment modal actions

  const formatAppointmentDate = dateString => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Set status bar based on modal visibility */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={showSummaryModal ? "rgba(0, 0, 0, 0.6)" : "#f8f9fa"}
        translucent={showSummaryModal}
      />

      <ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
        {/* Doctor Details Card at the very top */}
        {doctorDetails && (
          <View style={styles.doctorDetailsCard}>
            <View style={styles.doctorAvatarRow}>
              {doctorDetails.profileImage ? (
                <Image source={{ uri: doctorDetails.profileImage }} style={styles.doctorAvatar} />
              ) : (
                <View style={styles.doctorAvatarFallback}>
                  <Text style={styles.doctorAvatarInitials}>
                    {doctorDetails.firstName?.[0] || ""}
                    {doctorDetails.lastName?.[0] || ""}
                  </Text>
                </View>
              )}
              <View style={styles.doctorInfoCol}>
                <Text style={styles.doctorName}>
                  Dr. {doctorDetails.firstName} {doctorDetails.middleName} {doctorDetails.lastName}
                </Text>
                <Text style={styles.doctorSpecialization}>
                  {doctorDetails.professionalDetails?.specialization?.join(", ") ||
                    "Specialization N/A"}
                </Text>
              </View>
            </View>
          </View>
        )}
        {/* Patient Details (if booking for someone else) */}
        {form?.name !== "Self" && (
          <Card style={styles.patientDetailsCard}>
            <Card.Content>
              <View style={styles.patientHeader}>
                <MaterialCommunityIcons name="account-plus" size={24} color="#1976d2" />
                <Text style={styles.patientTitle}>Booking for: {form?.name}</Text>
              </View>
              <View style={styles.patientInfo}>
                <View style={styles.patientDetailRow}>
                  <MaterialCommunityIcons name="cake-variant" size={16} color="#666" />
                  <Text style={styles.patientDetail}>{form?.birthdate}</Text>
                </View>
                <View style={styles.patientDetailRow}>
                  <MaterialCommunityIcons name="human-male-female" size={16} color="#666" />
                  <Text style={styles.patientDetail}>{form?.gender}</Text>
                </View>
                <View style={styles.patientDetailRow}>
                  <MaterialCommunityIcons name="account-heart" size={16} color="#666" />
                  <Text style={styles.patientDetail}>{form?.relation}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Treatment/Appointment Note */}
        {/* {treatmentModalData && (
          <View style={styles.treatmentNoteContainer}>
            <View style={styles.treatmentNoteHeader}>
              <MaterialCommunityIcons
                name={treatmentModalData?.type === "ongoing" ? "medical-bag" : "calendar-alert"}
                size={20}
                color="#ff6b35"
              />
              <Text style={styles.treatmentNoteTitle}>
                {treatmentModalData?.type === "ongoing"
                  ? "Ongoing Treatment"
                  : "Upcoming Appointment"}
              </Text>
            </View>
            <View style={styles.treatmentNoteContent}>
              {treatmentModalData?.type === "ongoing" ? (
                <Text style={styles.treatmentNoteText}>
                  You are currently being treated by Dr. {treatmentModalData.doctorName}. Continuing
                  will end your current treatment and start a new one.
                </Text>
              ) : (
                <Text style={styles.treatmentNoteText}>
                  You have{" "}
                  {treatmentModalData?.appointments?.length > 1
                    ? "upcoming appointments"
                    : "an upcoming appointment"}{" "}
                  with Dr. {treatmentModalData?.doctorName}. Continuing will cancel{" "}
                  {treatmentModalData?.appointments?.length > 1
                    ? "these appointments"
                    : "this appointment"}
                  .
                </Text>
              )}
            </View>
          </View>
        )} */}

        {/* Behalf user details card */}

        {/* Date Display Above Calendar */}
        <Text style={styles.selectedDateDisplay}>
          Date: {selectedDate ? formatDate(selectedDate) : "No date selected"}
        </Text>
        {/* Calendar Section */}
        <View style={styles.stepContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar" size={24} color="#007bff" />
            <Text style={styles.sectionTitle}>Choose Date</Text>
          </View>
          {loadingDates ? <CalendarSkeleton /> : renderCalendar()}
        </View>

        {/* Location Selection */}
        {selectedDate && (
          <View style={styles.stepContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="map-marker" size={24} color="#007bff" />
              <Text style={styles.sectionTitle}>Choose Location</Text>
            </View>

            {loadingLocations ? (
              <LocationsSkeleton />
            ) : availableLocations.length > 0 ? (
              <View style={styles.optionsContainer}>
                {availableLocations.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionCard,
                      selectedLocation?.location === loc.location && styles.selectedOptionCard,
                    ]}
                    onPress={() => setSelectedLocation(loc)}
                  >
                    <MaterialCommunityIcons
                      name="hospital-building"
                      size={20}
                      color={selectedLocation?.location === loc.location ? "#fff" : "#007bff"}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selectedLocation?.location === loc.location && styles.selectedOptionText,
                      ]}
                    >
                      {loc.location}
                    </Text>
                    {selectedLocation?.location === loc.location && (
                      <MaterialCommunityIcons name="check" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noOptionsContainer}>
                <MaterialCommunityIcons name="information-outline" size={24} color="#666" />
                <Text style={styles.noOptionsText}>No locations available for selected date</Text>
              </View>
            )}
          </View>
        )}

        {/* Time Slot Selection */}
        {selectedDate && (
          <View style={styles.stepContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clock" size={24} color="#007bff" />
              <Text style={styles.sectionTitle}>Choose Time</Text>
            </View>

            {availableTimeSlots.length > 0 ? (
              <View style={styles.timeSlotsGrid}>
                {availableTimeSlots.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlotCard,
                      selectedTime?._id === time._id && styles.selectedTimeSlotCard,
                    ]}
                    onPress={() => {
                      setSelectedTime(time);
                      setSelectedTimeSlotId(time._id);
                      
                      // If no location is selected, automatically select the location for this time slot
                      if (!selectedLocation) {
                        const associatedLocation = availableLocations.find(
                          loc => loc.locationId === time.locationId
                        );
                        if (associatedLocation) {
                          setSelectedLocation(associatedLocation);
                        }
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={18}
                      color={selectedTime?._id === time._id ? "#fff" : "#007bff"}
                    />
                    <View style={{ flexDirection: "column", marginLeft: 6 }}>
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime?._id === time._id && styles.selectedTimeSlotText,
                        ]}
                      >
                        {time.startTime} - {time.endTime}
                      </Text>
                      {/* Show location name if no location is selected */}
                      {!selectedLocation && (
                        <Text style={{ fontSize: 11, color: "#666" }}>{time.location}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noOptionsContainer}>
                <MaterialCommunityIcons name="information-outline" size={24} color="#666" />
                <Text style={styles.noOptionsText}>No time slots available</Text>
              </View>
            )}
          </View>
        )}

        {/* Spacer to prevent content from being hidden behind floating buttons */}
        <View style={styles.bottomSpacer} />

        {/* Enhanced Appointment Summary Modal */}
        <Modal
          visible={showSummaryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowSummaryModal(false)}
          style={{ margin: 0, overflow: "hidden" }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <MaterialCommunityIcons name="calendar-check" size={24} color="#007bff" />
                  <Text style={styles.modalTitle}>Confirm Appointment</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowSummaryModal(false)}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Compact Doctor & Appointment Info */}
                <View style={styles.compactInfoCard}>
                  <View style={styles.compactRow}>
                    <View style={styles.compactIconContainer}>
                      <MaterialCommunityIcons name="doctor" size={20} color="#007bff" />
                    </View>
                    <View style={styles.compactTextContainer}>
                      <Text style={styles.compactLabel}>Doctor</Text>
                      <Text style={styles.compactValue}>
                        Dr. {doctor.firstName || ""} {doctor.middleName || ""}{" "}
                        {doctor.lastName || ""}
                      </Text>
                      {doctor.professionalDetails?.specialization && (
                        <Text style={styles.compactSubtext}>
                          {doctor.professionalDetails.specialization}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.compactDivider} />

                  <View style={styles.compactRow}>
                    <View style={styles.compactIconContainer}>
                      <MaterialCommunityIcons name="calendar" size={20} color="#007bff" />
                    </View>
                    <View style={styles.compactTextContainer}>
                      <Text style={styles.compactLabel}>Date & Time</Text>
                      <Text style={styles.compactValue}>
                        {selectedDate && formatDate(selectedDate)}
                      </Text>
                      <Text style={styles.compactSubtext}>
                        {selectedTime?.startTime} - {selectedTime?.endTime}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.compactDivider} />

                  <View style={styles.compactRow}>
                    <View style={styles.compactIconContainer}>
                      <MaterialCommunityIcons name="map-marker" size={20} color="#007bff" />
                    </View>
                    <View style={styles.compactTextContainer}>
                      <Text style={styles.compactLabel}>Location</Text>
                      <Text style={styles.compactValue}>{selectedLocation?.location}</Text>
                    </View>
                  </View>
                </View>

                {/* Patient Details (if booking for someone else) */}
                {form?.name !== "Self" && (
                  <View style={styles.compactInfoCard}>
                    <View style={styles.compactRow}>
                      <View style={styles.compactIconContainer}>
                        <MaterialCommunityIcons name="account" size={20} color="#007bff" />
                      </View>
                      <View style={styles.compactTextContainer}>
                        <Text style={styles.compactLabel}>Patient</Text>
                        <Text style={styles.compactValue}>{form?.name}</Text>
                        <Text style={styles.compactSubtext}>
                          {form?.gender} • {form?.birthdate} • {form?.relation}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Symptoms Summary */}
                {hasSurvey && (
                  <View style={styles.compactInfoCard}>
                    <View style={styles.compactRow}>
                      <View style={styles.compactIconContainer}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#28a745" />
                      </View>
                      <View style={styles.compactTextContainer}>
                        <Text style={styles.compactLabel}>Symptoms</Text>
                        <Text style={styles.compactValue}>Symptoms recorded</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Reason for Visit */}
                {!hasSurvey && reason.trim() && (
                  <View style={styles.compactInfoCard}>
                    <View style={styles.compactRow}>
                      <View style={styles.compactIconContainer}>
                        <MaterialCommunityIcons name="note-text" size={20} color="#007bff" />
                      </View>
                      <View style={styles.compactTextContainer}>
                        <Text style={styles.compactLabel}>Reason</Text>
                        <Text style={styles.compactValue}>{reason}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Modal Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <SecondaryButton
                  title="Edit"
                  onPress={() => setShowSummaryModal(false)}
                  style={styles.modalButton}
                />
                <PrimaryButton
                  title={loading ? "Booking..." : "Confirm Booking"}
                  onPress={handleBookAppointment}
                  disabled={loading}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Floating Bottom Buttons */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[styles.floatingButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.floatingButton,
            styles.bookButton,
            (!selectedDate || !selectedLocation || !selectedTime) && styles.disabledButton,
          ]}
          onPress={handleShowSummary}
          disabled={!selectedDate || !selectedLocation || !selectedTime}
        >
          <Text
            style={[
              styles.bookButtonText,
              (!selectedDate || !selectedLocation || !selectedTime) && styles.disabledButtonText,
            ]}
          >
            Book Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },

  // Patient Details
  patientDetailsCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  patientTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#1976d2",
  },
  patientInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  patientDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: "30%",
  },
  patientDetail: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "500",
  },

  // Step Containers
  stepContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  selectedInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  selectedInfo: {
    fontSize: 14,
    color: "#007bff",
    marginLeft: 8,
    fontWeight: "500",
  },

  // Calendar Styles
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  weekDaysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    width: (width - 88) / 7,
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  dateCell: {
    width: (width - 88) / 7,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    position: "relative",
  },
  selectedDateCell: {
    backgroundColor: "#007bff",
    elevation: 2,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pastDateCell: {
    opacity: 0.3,
  },
  todayDateCell: {
    backgroundColor: "#fff3cd",
    borderWidth: 2,
    borderColor: "#ffc107",
  },
  dateCellText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedDateCellText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pastDateCellText: {
    color: "#ccc",
  },
  todayDateCellText: {
    color: "#856404",
    fontWeight: "600",
  },
  availableDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#28a745",
  },
  selectedAvailableDot: {
    backgroundColor: "#fff",
  },

  // Options Container
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOptionCard: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
    elevation: 6,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Time Slots
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: "48%",
    maxWidth: "48%",
  },
  selectedTimeSlotCard: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  timeSlotText: {
    fontSize: 13,
    marginLeft: 6,
    color: "#333",
    fontWeight: "500",
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "600",
  },

  // No Options
  noOptionsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontStyle: "italic",
  },
  noOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  // Symptoms Card
  symptomsCard: {
    borderRadius: 12,
    backgroundColor: "#e8f5e8",
    elevation: 2,
  },
  symptomsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  symptomsSummary: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginLeft: 8,
  },
  symptomsSubtext: {
    fontSize: 14,
    color: "#4caf50",
  },

  // Reason Input
  reasonInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    elevation: 1,
  },

  // Preview
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  previewCard: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },

  // Buttons
  buttonContainer: {
    gap: 12,
    paddingBottom: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 16,
    maxHeight: "80%",
    width: width - 32,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  modalContent: {
    padding: 16,
  },
  compactInfoCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  compactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  compactValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 2,
  },
  compactSubtext: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  compactDivider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 12,
  },
  modalButtonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalButton: {
    flex: 1,
  },

  // Skeleton Loader Styles
  skeletonBox: {
    backgroundColor: "#e1e9ee",
    opacity: 0.7,
  },
  skeletonContainer: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e1e9ee",
  },

  // Treatment Note Styles
  treatmentNoteContainer: {
    backgroundColor: "#fff5f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b35",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  treatmentNoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  treatmentNoteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b35",
    marginLeft: 8,
  },
  treatmentNoteContent: {
    marginTop: 4,
  },
  treatmentNoteText: {
    fontSize: 14,
    color: "#d63384",
    lineHeight: 20,
  },

  // Floating Button Styles
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  floatingButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#dee2e6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },
  bookButton: {
    backgroundColor: "#007bff",
    elevation: 2,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#e9ecef",
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledButtonText: {
    color: "#adb5bd",
  },
  bottomSpacer: {
    height: 80,
  },
  selectedDateDisplay: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 12,
    marginLeft: 4,
    textAlign: "center",
  },
  doctorDetailsCard: {
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  patientDetailsCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  treatmentNoteContainer: {
    backgroundColor: "#fff5f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b35",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doctorAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0e7ff",
    marginRight: 12,
  },
  doctorAvatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#b3c6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  doctorAvatarInitials: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  doctorInfoCol: {
    flex: 1,
    justifyContent: "center",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007bff",
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    marginBottom: 2,
  },
  doctorExpertise: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  doctorHospital: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },
  doctorLanguages: {
    fontSize: 13,
    color: "#555",
  },
});

export default BookAppointmentScreen;
