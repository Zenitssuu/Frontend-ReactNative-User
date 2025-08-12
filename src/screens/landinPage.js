import React, { useEffect, useState } from "react";
import {
  BackHandler,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BehalfUserSelector } from "./appointments/OtherScreen.js";
import Modal from "react-native-modal";
import { Color } from "../constants/GlobalStyles.js";
import { useSelector, useDispatch } from "react-redux";
import apiService from "../services/api";
import { handleApiMutation } from "../services/apiUtils";
import { addBehalfUser } from "../Redux/Slices/UserSlice";

export default function HomeScreen() {
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigation = useNavigation();
  const { profile } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleOtherSubmit = async otherFormData => {
    try {
      // If this is a new user (no behalfUserId), save to database first
      if (!otherFormData.behalfUserId) {
        setLoadingSubmit(true);

        // Convert form data to the format expected by the API
        const [day, month, year] = otherFormData.birthdate.split("/");
        const dateOfBirth = new Date(year, month - 1, day);

        // Extract names from the full name
        const nameParts = otherFormData.name.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts[nameParts.length - 1] || "";
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

        const userData = {
          firstName,
          middleName,
          lastName,
          gender: otherFormData.gender,
          dateOfBirth: dateOfBirth.toISOString(),
          relationship: otherFormData.relation,
          ...(otherFormData.parentalConsent !== undefined && { parentalConsent: otherFormData.parentalConsent }),
        };

        await handleApiMutation(apiService.profile.addBehalfUser, {
          args: [userData],
          successMessage: "Profile created successfully",
          onSuccess: response => {
            const modifiedData = {
              ...response.data.newBehalfUser,
              dateOfBirth: new Date(response.data.newBehalfUser.dateOfBirth).toISOString(),
            };

            dispatch(addBehalfUser(modifiedData));

            // Update otherFormData with the new behalfUserId
            otherFormData.behalfUserId = response.data.newBehalfUser._id;
          },
        });
      }

      // Close the modal
      setShowOtherModal(false);

      // Navigate to Survey Details with the form data
      navigation.navigate("SurveyDetails", {
        form: { name: "Other", ...otherFormData },
      });
    } catch (error) {
      console.log("Error in handleOtherSubmit:", error);
      // Keep modal open if there's an error
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (showOtherModal) {
        setShowOtherModal(false);
        return true;
      }
      if (showChoiceModal) {
        setShowChoiceModal(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [showOtherModal, showChoiceModal]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to MedSurvey</Text>
        <Text style={styles.subtitle}>Your trusted health assessment assistant</Text>

        <Pressable style={styles.button} onPress={() => setShowChoiceModal(true)}>
          <Text style={styles.buttonText}>Start Survey</Text>
        </Pressable>
      </View>
      {/* Choice Modal */}
      <Modal
        isVisible={showChoiceModal}
        swipeDirection="down"
        transparent={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={false}
        backdropOpacity={0.5}
        style={styles.modal}
        onSwipeComplete={() => setShowChoiceModal(false)}
        onBackdropPress={() => setShowChoiceModal(false)}
        onBackButtonPress={() => setShowChoiceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.choiceContent}>
            <Text style={styles.modalTitle}>Symptoms For</Text>

            <View style={styles.optionsRow}>
              <Pressable
                style={styles.optionButton}
                onPress={() => {
                  setShowChoiceModal(false);
                  setShowOtherModal(false);
                  navigation.navigate("SurveyDetails", {
                    form: { name: "Self" },
                  });
                }}
              >
                <Image source={require("../../assets/self.png")} style={styles.optionImage} />
                <Text style={styles.optionText}>Self</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => {
                  setShowChoiceModal(false);
                  setShowOtherModal(true);
                }}
              >
                <Image source={require("../../assets/other.png")} style={styles.optionImage} />
                <Text style={styles.optionText}>Other</Text>
              </Pressable>
            </View>

            <Pressable style={styles.cancelBtn} onPress={() => setShowChoiceModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={showOtherModal}
        swipeDirection="down"
        transparent={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={false}
        backdropOpacity={0.5}
        style={styles.modal}
        onSwipeComplete={() => setShowOtherModal(false)}
        onBackdropPress={() => setShowOtherModal(false)}
        onBackButtonPress={() => setShowOtherModal(false)}
      >
        <View style={styles.dynamicModalContainer}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidContainer}
              keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
              <BehalfUserSelector
                profile={profile}
                onSubmit={handleOtherSubmit}
                onCancel={() => setShowOtherModal(false)}
                loading={loadingSubmit}
              />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#EAF3F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#5E6C84",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#50A3C8",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  keyboardAvoidContainer: {
    width: "100%",
  },
  choiceContent: {
    backgroundColor: Color.colorWhite,
    padding: 24,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  optionButton: {
    alignItems: "center",
    justifyContent: "center",
    // resizeMode="cover"
  },
  optionImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#50A3C8",
    backgroundColor: "#E1F5FE",
    resizeMode: "cover",
  },
  optionText: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
  },
  cancelBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    backgroundColor: "#E4EAF1",
  },
  cancelBtnText: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modal: {
    justifyContent: "flex-end", // 👈 aligns modal to bottom
    margin: 0, // 👈 removes top & bottom space
    overflow: "hidden", // 👈 prevents overflow issues
  },
  modalContainer: {
    height: "40%", // 👈 modal height
    backgroundColor: Color.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  dynamicModalContainer: {
    maxHeight: "85%",
    minHeight: "50%",
    backgroundColor: Color.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    overflow: "hidden",
  },
});
