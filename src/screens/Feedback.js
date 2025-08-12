import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize, SHADOWS } from "../constants/GlobalStyles";
import { Header, PrimaryButton, LoadingSpinner } from "../components/UIComponents";
import apiService from "../services/api";

const Feedback = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    overallExperience: null,
    appUsability: null,
    doctorInteraction: null,
    appointmentBooking: null,
    informationAccuracy: null,
    recommendToOthers: null,
    mostHelpfulFeature: "",
    improvementSuggestions: "",
    additionalComments: "",
  });

  const ratingQuestions = [
    {
      key: "overallExperience",
      question: "How would you rate your overall experience with the app?",
      icon: "star-outline",
    },
    {
      key: "appUsability",
      question: "How easy is it to navigate and use the app?",
      icon: "cellphone",
    },
    {
      key: "doctorInteraction",
      question: "How satisfied are you with doctor interactions through the app?",
      icon: "doctor",
    },
    {
      key: "appointmentBooking",
      question: "How convenient is the appointment booking process?",
      icon: "calendar-check",
    },
    {
      key: "recommendToOthers",
      question: "How likely are you to recommend this app to others?",
      icon: "account-group",
    },
  ];

  const handleRatingChange = (questionKey, rating) => {
    setFeedbackData(prev => ({
      ...prev,
      [questionKey]: rating,
    }));
  };

  const handleTextChange = (field, value) => {
    setFeedbackData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateFeedback = () => {
    const requiredRatings = ratingQuestions.map(q => q.key);
    const missingRatings = requiredRatings.filter(key => feedbackData[key] === null);

    if (missingRatings.length > 0) {
      Alert.alert(
        "Incomplete Feedback",
        "Please provide ratings for all questions before submitting."
      );
      return false;
    }
    return true;
  };

  const submitFeedback = async () => {
    if (!validateFeedback()) return;

    try {
      setLoading(true);

      const response = await apiService.feedbackService.submitFeedback(feedbackData);

      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const renderSuccessModal = () => {
    return (
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successModalContent}>
              <View style={styles.successIconContainer}>
                <MaterialCommunityIcons name="check-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.modalTitle}>Thank You!</Text>
              <Text style={styles.modalMessage}>
                Your feedback has been submitted successfully. We appreciate your input to help us
                improve our services.
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleSuccessModalClose}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderErrorModal = () => {
    return (
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleErrorModalClose}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.errorModalContent}>
              <View style={styles.errorIconContainer}>
                <MaterialCommunityIcons name="alert-circle" size={60} color="#F44336" />
              </View>
              <Text style={styles.modalTitle}>Submission Failed</Text>
              <Text style={styles.modalMessage}>
                Unable to submit feedback. Please check your connection and try again later.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={handleErrorModalClose}
                >
                  <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    handleErrorModalClose();
                    submitFeedback();
                  }}
                >
                  <Text style={styles.modalButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderStarRating = (questionKey, currentRating) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingChange(questionKey, star)}
            style={styles.starButton}
          >
            <MaterialCommunityIcons
              name={star <= currentRating ? "star" : "star-outline"}
              size={32}
              color={star <= currentRating ? "#FFD700" : COLORS.textLighter}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRatingQuestion = question => {
    return (
      <Surface key={question.key} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <MaterialCommunityIcons name={question.icon} size={24} color={COLORS.headingColor} />
          <Text style={styles.questionText}>{question.question}</Text>
        </View>
        {renderStarRating(question.key, feedbackData[question.key])}
        <View style={styles.ratingLabels}>
          <Text style={styles.ratingLabel}>Poor</Text>
          <Text style={styles.ratingLabel}>Excellent</Text>
        </View>
      </Surface>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Submitting your feedback..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Feedback"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.headerSection}>
            <MaterialCommunityIcons name="comment-text" size={48} color={COLORS.headingColor} />
            <Text style={styles.headerTitle}>We Value Your Feedback</Text>
            <Text style={styles.headerSubtitle}>
              Help us improve our services by sharing your experience
            </Text>
          </View>

          {/* Rating Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate Your Experience</Text>
            {ratingQuestions.map(renderRatingQuestion)}
          </View>

          {/* Additional Comments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Comments</Text>
            <Surface style={styles.textInputCard}>
              <Text style={styles.inputLabel}>
                Share any additional thoughts or suggestions (optional)
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Your comments here..."
                multiline
                numberOfLines={4}
                maxLength={200}
                value={feedbackData.additionalComments}
                onChangeText={text => handleTextChange("additionalComments", text)}
                placeholderTextColor={COLORS.textLighter}
              />
              <Text style={styles.characterCount}>
                {feedbackData.additionalComments.length}/200 characters
              </Text>
            </Surface>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <PrimaryButton title="Submit Feedback" onPress={submitFeedback} icon="send" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderSuccessModal()}
      {renderErrorModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: FontSize.heading_H1,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginTop: 12,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.headingColor,
    marginBottom: 16,
  },
  questionCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  questionText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  starButton: {
    paddingHorizontal: 4,
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingLabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLighter,
  },
  textInputCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  inputLabel: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.text,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    minHeight: 120,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLighter,
    textAlign: "right",
    marginTop: 8,
  },
  submitSection: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    margin: 20,
    maxWidth: 350,
    width: "90%",
    overflow: "hidden",
  },
  successModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    ...SHADOWS.large,
  },
  errorModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    ...SHADOWS.large,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: COLORS.headingColor,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  modalSecondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
    flex: 1,
  },
  modalSecondaryButtonText: {
    color: COLORS.text,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
  },
});

export default Feedback;
