import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS } from "../constants/GlobalStyles";
import AdvertBanner from "../components/AdvertBanner";
import { mockAdvertisements } from "../utils/mockData";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { translatedSymptomSection } from "../utils/translatedSymptomSection";
import { BehalfUserSelector } from "./appointments/OtherScreen";

const DashboardScreen = ({ navigation }) => {
  const { profile } = useSelector(state => state.user) || {};
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const modalScale = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // Get symptom icons from general symptoms
  const symptomIcons =
    translatedSymptomSection.find(section => section.key === "generalSymptoms")?.categories || [];

  // Scroll event handlers for symptoms scroll
  const handleScroll = event => {
    try {
      const { contentOffset, contentSize, layoutMeasurement } = event?.nativeEvent || {};

      if (!contentOffset || !contentSize || !layoutMeasurement) {
        return;
      }

      const scrollX = contentOffset.x || 0;
      const maxScrollX = Math.max(0, (contentSize.width || 0) - (layoutMeasurement.width || 0));

      setShowLeftArrow(scrollX > 10);
      setShowRightArrow(scrollX < maxScrollX - 10);
    } catch (error) {
      console.log("Error in handleScroll:", error);
    }
  };

  const handleContentLayout = (width, height) => {
    // Content layout handler for scroll arrows
  };

  const handleScrollViewLayout = event => {
    // ScrollView layout handler for scroll arrows
  };

  useEffect(() => {
    if (symptomIcons.length > 4) {
      setShowRightArrow(true);
      setShowLeftArrow(false);
    }
  }, [symptomIcons.length]);

  const showChoiceModalWithAnimation = (symptom = null) => {
    const serializableSymptom = symptom
      ? {
          key: symptom.key,
          translations: symptom.translations,
        }
      : null;

    setSelectedSymptom(serializableSymptom);
    setShowChoiceModal(true);
    Animated.spring(modalScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const hideChoiceModalWithAnimation = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowChoiceModal(false);
      setSelectedSymptom(null);
    });
  };

  const handleOtherSubmit = async otherFormData => {
    setShowOtherModal(false);

    const navigationParams = {
      form: { name: "Other", ...(otherFormData || {}) },
    };

    if (selectedSymptom && selectedSymptom.key) {
      navigationParams.selectedSymptom = selectedSymptom;
    }

    navigation.navigate("SurveyDetails", navigationParams);
  };

  const onBannerPress = item => {};

  const renderFeelingSection = () => (
    <View style={styles.feelingContainer}>
      <Text style={styles.feelingTitle}>Record Symptoms</Text>

      <View style={styles.symptomScrollContainer}>
        {showLeftArrow && (
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={() => {
              if (scrollViewRef.current) {
                const currentOffset = scrollViewRef.current.contentOffset?.x || 0;
                const newOffset = Math.max(0, currentOffset - 120);
                scrollViewRef.current.scrollTo({
                  x: newOffset,
                  animated: true,
                });
              }
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={COLORS.headingColor} />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentLayout}
          onLayout={handleScrollViewLayout}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          bounces={false}
        >
          <View style={styles.symptomIconsContainer}>
            {symptomIcons.map((symptom, index) => (
              <TouchableOpacity
                key={`${symptom.key}-${index}`}
                style={styles.symptomIconItem}
                onPress={() => showChoiceModalWithAnimation(symptom)}
              >
                <View style={styles.symptomIconWrapper}>
                  <Image source={symptom.image} style={styles.symptomIcon} />
                </View>
                <Text style={styles.symptomIconText}>{symptom.translations.en}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {showRightArrow && (
          <TouchableOpacity
            style={styles.rightArrow}
            onPress={() => {
              if (scrollViewRef.current) {
                const currentOffset = scrollViewRef.current.contentOffset?.x || 0;
                const newOffset = currentOffset + 120;
                scrollViewRef.current.scrollTo({
                  x: newOffset,
                  animated: true,
                });
              }
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.headingColor} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.recordSymptomsButton} onPress={showChoiceModalWithAnimation}>
        <Text style={styles.recordSymptomsButtonText}>Record</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full Width Slider Container */}
      <View style={styles.sliderContainer}>
        <AdvertBanner advertisements={mockAdvertisements} onBannerPress={onBannerPress} />
      </View>

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <View style={styles.profileIcon}>
              {profile?.profileImage ? (
                <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profileIconText}>
                  {profile?.firstName ? profile.firstName.charAt(0) : "U"}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>
              Hello {profile?.firstName ? profile.firstName : "there"}!
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications" color={COLORS.colorWhite} size={24} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Record Symptoms Section */}
        {renderFeelingSection()}

        {/* Treatments Card */}
        <View style={styles.treatmentsCard}>
          <Text style={styles.treatmentsLabel}>Treatments</Text>
          <View style={styles.treatmentsContainer}>
            <TouchableOpacity style={styles.treatmentSubBox} onPress={showChoiceModalWithAnimation}>
              <View style={styles.treatmentIconContainer}>
                <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.headingColor} />
              </View>
              <Text style={[styles.treatmentText, { textAlign: "center" }]}>Start New</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.treatmentSubBox}
              onPress={() => navigation.navigate("CurrentTreatment")}
            >
              <View style={styles.treatmentIconContainer}>
                <MaterialCommunityIcons name="medical-bag" size={24} color={COLORS.headingColor} />
              </View>
              <Text style={[styles.treatmentText, { textAlign: "center" }]}>Ongoing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("My Doctors")}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="doctor" size={28} color={COLORS.headingColor} />
            </View>
            <Text style={styles.actionButtonText}>My Doctors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Appointments")}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="calendar-clock" size={28} color={COLORS.headingColor} />
            </View>
            <Text style={styles.actionButtonText}>Appointments</Text>
          </TouchableOpacity>
        </View>

        {/* Upload Documents */}
        <View style={styles.treatmentsCard}>
          <Text style={styles.treatmentsLabel}>Upload Documents</Text>
          <View style={styles.treatmentsContainer}>
            <TouchableOpacity
              style={styles.treatmentSubBox}
              onPress={() => navigation.navigate("UploadDocument", { section: "reports" })}
            >
              <View style={styles.treatmentIconContainer}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={24}
                  color={COLORS.headingColor}
                />
              </View>
              <Text style={styles.treatmentText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.treatmentSubBox}
              onPress={() => navigation.navigate("UploadDocument", { section: "prescriptions" })}
            >
              <View style={styles.treatmentIconContainer}>
                <MaterialCommunityIcons name="file-plus" size={24} color={COLORS.headingColor} />
              </View>
              <Text style={styles.treatmentText}>Prescriptions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Options */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Feedback")}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="message-text" size={28} color={COLORS.headingColor} />
            </View>
            <Text style={styles.actionButtonText}>Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Manual")}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="book-open-variant" size={28} color={COLORS.headingColor} />
            </View>
            <Text style={styles.actionButtonText}>Manual</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ marginBottom: 120 }} />
      </ScrollView>

      {/* Choice Modal - Who are these symptoms for? */}
      <Modal
        visible={showChoiceModal}
        animationType="fade"
        transparent={true}
        onRequestClose={hideChoiceModalWithAnimation}
      >
        <View style={styles.choiceModalOverlay}>
          <Animated.View
            style={[
              styles.choiceModal,
              {
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.choiceModalTitle}>Symptoms For</Text>
              <Text style={styles.choiceModalSubtitle}>Choose Person</Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  hideChoiceModalWithAnimation();
                  setTimeout(() => {
                    const navigationParams = {
                      form: { name: "Self" },
                    };

                    if (selectedSymptom && selectedSymptom.key) {
                      navigationParams.selectedSymptom = selectedSymptom;
                    }

                    navigation.navigate("SurveyDetails", navigationParams);
                  }, 200);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.optionImageContainer}>
                  <Image source={require("../../assets/self.png")} style={styles.optionImage} />
                  <View style={styles.optionBadge}>
                    <MaterialCommunityIcons name="account" size={16} color={COLORS.white} />
                  </View>
                </View>
                <Text style={styles.optionText}>For Myself</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  hideChoiceModalWithAnimation();
                  setTimeout(() => {
                    setShowOtherModal(true);
                  }, 200);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.optionImageContainer}>
                  <Image source={require("../../assets/other.png")} style={styles.optionImage} />
                  <View style={styles.optionBadge}>
                    <MaterialCommunityIcons
                      name="account-multiple"
                      size={16}
                      color={COLORS.white}
                    />
                  </View>
                </View>
                <Text style={styles.optionText}>For Others</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={hideChoiceModalWithAnimation}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Other Person Modal */}
      <Modal
        visible={showOtherModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOtherModal(false)}
      >
        <View style={styles.otherModalOverlay}>
          <View style={styles.otherModal}>
            <BehalfUserSelector
              profile={profile}
              onSubmit={handleOtherSubmit}
              onCancel={() => setShowOtherModal(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 0,
  },
  sliderContainer: {
    height: 280,
    width: "100%",
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  floatingHeader: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  profileIconText: {
    color: COLORS.headingColor,
    fontWeight: "600",
    fontSize: 18,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.white,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -15,
    paddingTop: 20,
  },
  feelingContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
  },
  feelingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.headingColor,
    textAlign: "center",
    marginBottom: 4,
  },
  symptomScrollContainer: {
    height: 70,
    marginBottom: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  leftArrow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 70,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 10,
  },
  rightArrow: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 70,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 10,
  },
  symptomIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  symptomIconItem: {
    alignItems: "center",
    marginHorizontal: 12,
    width: 55,
  },
  symptomIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 2,
    borderColor: COLORS.headingColor,
    shadowColor: COLORS.headingColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  symptomIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  symptomIconText: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  recordSymptomsButton: {
    backgroundColor: COLORS.headingColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.headingColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  recordSymptomsButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: COLORS.white,
    width: "48%",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    transform: [{ translateY: -2 }],
  },
  actionIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.headingColor,
    shadowColor: COLORS.headingColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  treatmentsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    position: "relative",
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  treatmentsLabel: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.headingColor,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    borderRadius: 12,
    zIndex: 1,
  },
  treatmentsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  treatmentSubBox: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.headingColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  treatmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.headingColor,
    shadowColor: COLORS.headingColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  treatmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.headingColor,
    marginBottom: 2,
  },
  choiceModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  choiceModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: "hidden",
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.lightBlue,
    width: "100%",
  },
  choiceModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.headingColor,
    marginBottom: 8,
    textAlign: "center",
  },
  choiceModalSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  option: {
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1 }],
  },
  optionImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  optionImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.lightBlue,
    borderWidth: 3,
    borderColor: COLORS.headingColor,
  },
  optionBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.headingColor,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.headingColor,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.lightBlue,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.headingColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.headingColor,
    fontWeight: "600",
    textAlign: "center",
  },
  otherModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  otherModal: {
    backgroundColor: "#fff",
    maxHeight: "85%",
    minHeight: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
  },
});

export default DashboardScreen;
