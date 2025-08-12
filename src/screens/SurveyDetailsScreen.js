import React, { useEffect, useState, useLayoutEffect, use } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import DropDownPicker from "react-native-dropdown-picker";
import { Header, Icon } from "@rneui/base";
import Modal from "react-native-modal";
import Foundation from "react-native-vector-icons/Foundation";

import AnimatedDropDown from "../components/AnimatedDropDown";
import QuestionScreen from "./QuestionScreen";
import { FontFamily, FontSize, Color, Border } from "../constants/GlobalStyles";
import { translatedSymptomSection } from "../utils/translatedSymptomSection"; // Import the new sections
import Feather from "react-native-vector-icons/Feather";
import { questionTranslations } from "../utils/categories";
import apiService from "../services/api";
import { handleApiMutation } from "../services/apiUtils";
import { bodyExcretion } from "../utils/body_excretion";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SurveyDetailsScreen = ({ route, navigation }) => {
  // route.params has this kind of data
  /* 
  For Self appointment
  {
  "form": {
    "name": "Self"
  },
  "doctor": {
    "_id": "68652dbbee325941e4b36e30",
    "UDI_id": "DAGMONC307460",
    "doctorId": "68652da6ee325941e4b36e2a",
    "firstName": "Prit",
    "middleName": "",
    "lastName": "Ar",
    "profileImage": "https://me-app-tellyoudoc.s3.ap-south-1.amazonaws.com/doctor/68652da6ee325941e4b36e2a/profile/b8e0b148-f453-4daf-9c78-61e8853c45e2.jpg",
    "isVerified": false,
    "professionalDetails": {
      "registrationNumber": "",
      "medicalCouncil": "",
      "yearOfRegistration": "",
      "yearsOfExperience": "",
      "areaOfExpertise": [
        "Surgery"
      ],
      "qualification": [
        "MD"
      ],
      "specialization": [
        "Oncology"
      ],
      "_id": "68678769cd684d979e62c560"
    }
  }
}


For Other appointment
{
  "form": {
    "name": "Pritam Darling",
    "birthdate": "04/06/2025",
    "gender": "Male",
    "relation": "Dost",
    "behalfUserId": "6867ac4c137ef69b1de6b77c"
  },
  "doctor": {
    "_id": "68652dbbee325941e4b36e30",
    "doctorId": "68652da6ee325941e4b36e2a",
    "UDI_id": "DAGMONC307460",
    "firstName": "Prit",
    "middleName": "",
    "lastName": "Ar",
    "profileImage": "https://me-app-tellyoudoc.s3.ap-south-1.amazonaws.com/doctor/68652da6ee325941e4b36e2a/profile/b8e0b148-f453-4daf-9c78-61e8853c45e2.jpg",
    "isVerified": false,
    "professionalDetails": {
      "registrationNumber": "",
      "medicalCouncil": "",
      "yearOfRegistration": "",
      "yearsOfExperience": "",
      "areaOfExpertise": [
        "Surgery"
      ],
      "qualification": [
        "MD"
      ],
      "specialization": [
        "Oncology"
      ],
      "_id": "68678769cd684d979e62c560"
    }
  }
}
  */

  const {
    form,
    appointmentId,
    forSaving,
    returnToVisit,
    appDetails,
    selectedSymptom = null,
  } = route.params || {
    doctor: {},
    form: { name: "Self" },
    appointmentId: null,
    forSaving: false,
    returnToVisit: false,
    appDetails: null,
    selectedSymptom: null,
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    generalSymptoms: false,
    bodyExcretion: false,
    skin: false,
    others: false,
    bodyParts: false,
  });
  const [surveyAnswer, setSurveyAnswer] = useState({});
  const [answersWithLabels, setAnswersWithLabels] = useState({});
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [tempScale, setTempScale] = useState("°C");
  // const [durationType, setDurationType] = useState("days")
  const [language, setLanguage] = useState("en");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [languageItems, setLanguageItems] = useState([
    { label: "English", value: "en" },
    { label: "বাংলা", value: "bn" },
    { label: "অসমীয়াত", value: "as" },
  ]);

  const loadSavedSymptoms = async () => {
    try {
      const savedSymptoms = await AsyncStorage.getItem("surveyAnswer");
      const savedSymptomsWithLabels = await AsyncStorage.getItem("answersWithLabels");
      console.log("Saved Symptoms : ", savedSymptoms);
      console.log("Saved Answer Labels : ", savedSymptomsWithLabels);
      if (savedSymptoms) {
        setSurveyAnswer(JSON.parse(savedSymptoms));
        setAnswersWithLabels(JSON.parse(savedSymptomsWithLabels));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveSymptomsInStorage = async () => {
    try {
      await AsyncStorage.multiSet([
        ["surveyAnswer", JSON.stringify(surveyAnswer)],
        ["answersWithLabels", JSON.stringify(answersWithLabels)],
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSavedSymtomsInStorage = async () => {
    try {
      await AsyncStorage.multiRemove(["surveyAnswer", "answersWithLabels"]);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Symptoms",
    });
    loadSavedSymptoms();
  }, [navigation]);

  const extractImageUrisWithPaths = surveyData => {
    if (!surveyData || typeof surveyData !== "object") {
      return [];
    }

    const images = [];

    const findUris = (obj, path = "") => {
      // console.log(obj);
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
        return;
      }

      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (Array.isArray(value)) {
          if (value.length && typeof value[0] === "string" && value[0].startsWith("file")) {
            // console.log(`Found image array at ${currentPath}:`, value)
            value.forEach(uri => {
              images.push({ uri, path: currentPath });
            });
          }
        } else if (typeof value === "object" && value !== null) {
          findUris(value, currentPath);
        }
      });
    };

    findUris(surveyData);
    // console.log("All extracted images with paths:", images)
    return images;
  };

  const stripImagesFromSurvey = data => {
    if (!data || typeof data !== "object") {
      return {};
    }

    const clone = JSON.parse(JSON.stringify(data)); // Deep clone
    // console.log("Cloning survey data for cleanup...")

    const removeImageUris = (obj, path = "") => {
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
        return;
      }

      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (
          Array.isArray(value) &&
          value.length &&
          typeof value[0] === "string" &&
          value[0].startsWith("file")
        ) {
          // console.log(`Removing image array from ${currentPath}`)
          delete obj[key];
        } else if (typeof value === "object" && value !== null) {
          removeImageUris(value, currentPath);
        }
      });
    };

    removeImageUris(clone);
    // console.log("Cleaned survey data without images:", clone)
    return clone;
  };

  const submitSurveyForm = async (surveyData, patientId, behalfUserId, appointmentId = null) => {
    // console.log("Received surveyData:", surveyData)
    const imageObjects = extractImageUrisWithPaths(surveyData);
    const cleanedSurveyData = stripImagesFromSurvey(surveyData);

    const formData = new FormData();
    formData.append("patientId", patientId);
    if (appointmentId) {
      formData.append("appointmentId", appointmentId);
    }
    // if (behalfUserId) {
    //   formData.append("behalfUserId", behalfUserId)
    // }

    const surveyJsonString = JSON.stringify(cleanedSurveyData);
    formData.append("surveyData", surveyJsonString);
    // console.log("Appending surveyData JSON to FormData:", surveyJsonString)

    imageObjects.forEach(({ uri, path }, idx) => {
      const filename = uri.split("/").pop();
      const filetype = filename.split(".").pop();

      const fileObj = {
        uri,
        name: filename,
        type: `image/${filetype}`,
        path, // attach currentPath in object as well
      };

      formData.append(`images`, fileObj);
    }); // Debugging FormData (only works in React Native console)

    try {
      await handleApiMutation(apiService.profile.addSymptoms, {
        args: [formData],
        successMessage: "Symptoms submitted successfully",
        onSuccess: res => {
          // navigation.goBack() or other UI actions
          // await AsyncStorage.multiRemove(["surveyAnswer", ""])
        },
        onError: error => {
          console.error("❌ API Error:", error);

          if (error.status === 400) {
            Alert.alert("Error", "Invalid data format. Please review your input.");
          } else if (error.status === 401) {
            Alert.alert("Unauthorized", "Please log in to continue.");
          } else if (error.status === 500) {
            Alert.alert("Server Error", "Please try again later.");
          } else {
            Alert.alert("Error", error.message || "Failed to submit symptoms");
          }
        },
      });
    } catch (err) {
      console.log("❗ Catch block error:", err);
    }
  };

  const getTranslatedLabel = (section, category, question, lang) => {
    // Check if questionTranslations exists and log
    if (!questionTranslations) {
      // console.log("questionTranslations is undefined or null");
      return "";
    }

    // Check and log section
    const sectionObj = questionTranslations[section];
    if (!sectionObj) {
      // console.log(`Section '${section}' not found in questionTranslations`);
      return "";
    }
    // console.log("Available categories in section:", Object.keys(sectionObj))

    // Check and log category
    const categoryObj = sectionObj[category];
    if (!categoryObj) {
      // console.log(`Category '${category}' not found in section '${section}'`)
      return "";
    }
    // console.log("Available questions in category:", Object.keys(categoryObj))

    // Check and log question
    const questionObj = categoryObj[question];
    if (!questionObj) {
      // console.log(`Question '${question}' not found in category '${category}'`)
      return "";
    }
    // console.log("Available languages in question:", Object.keys(questionObj))

    // Check and log language
    const translation = questionObj[lang];
    if (!translation) {
      // console.log(`Translation for lang '${lang}' not found in question '${question}'`)
      return "";
    }
    // console.log("Found translation:", translation)

    return translation;
  };

  const capitalizeHyphenWords = input => {
    if (!input || typeof input !== "string") return "";
    return input
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleSection = sectionKey => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };
  const changeLanguage = value => {
    setLanguage(value);
  };

  const openCategoryModal = (category, sheetname) => {
    setSelectedCategory(category);
    setSelectedSheet(sheetname);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
    setSelectedSheet(null);
  };
  const hasAnsweredQuestions = () => {
    return Object.keys(surveyAnswer).length > 0;
  };

  const handleEdit = (category, sheetname) => {
    openCategoryModal(category, sheetname);
  };
  const getReviewText = () => {
    switch (language) {
      case "bn":
        return "পর্যালোচনা";
      case "as":
        return "পুনৰীক্ষণ";
      default:
        return "Review";
    }
  };
  const handleSubmit = async () => {
    // Add your submit logic here
    let surveyDetails = surveyAnswer;
    if (
      surveyDetails.generalSymptoms &&
      surveyDetails.generalSymptoms.fever &&
      surveyDetails.generalSymptoms.fever.feverTemperatureMeasure
    ) {
      surveyDetails = {
        ...surveyDetails,
        ["generalSymptoms"]: {
          ...surveyDetails.generalSymptoms,
          ["fever"]: {
            ...surveyDetails.generalSymptoms.fever,
            ["feverTemperatureMeasure"]: `${surveyDetails.generalSymptoms.fever.feverTemperatureMeasure}${tempScale}`,
          },
        },
      };
    }

    // If forSaving is true and we have an appointmentId, save symptoms directly
    if (forSaving && appointmentId) {
      submitSurveyForm(surveyDetails, "patientId", "behalfUserId", appointmentId);

      // Navigate back to VisitDetails with success message
      if (returnToVisit && appDetails) {
        await saveSymptomsInStorage();
        navigation.navigate("VisitDetails", {
          appDetails: appDetails,
          showUpdated: true,
          message: "Symptoms saved successfully",
        });
      } else {
        await saveSymptomsInStorage();
        navigation.goBack();
      }
      return;
    }

    // Original flow for booking appointments
    submitSurveyForm(surveyDetails, "patientId", "behalfUserId");
    const flattenedSymptoms = Object.entries(surveyDetails).flatMap(([sectionKey, sectionValue]) =>
      Object.entries(sectionValue).flatMap(([categoryKey, questions]) =>
        Object.entries(questions).map(([questionKey, answer]) => ({
          section: sectionKey,
          category: categoryKey,
          question: questionKey,
          answer: answer,
        }))
      )
    );

    // Save the survey answers to local storage or context if needed

    // Check if we are returning to the booking screen
    if (route.params?.fromBooking && route.params?.returnToBooking) {
      await saveSymptomsInStorage();
      navigation.navigate("BookAppointment", {
        form: form,
        doctor: route.params.doctor,
        // appointmentId: route.params.appointmentId,
        surveyDetails: surveyDetails,
        answersWithLabels: answersWithLabels,
        selectedDate: route.params.selectedDate,
        selectedTime: route.params.selectedTime,
        symptoms: flattenedSymptoms,
      });
    } else if (route.params?.doctor) {
      // Navigate directly to BookAppointment when doctor is selected
      await saveSymptomsInStorage();
      navigation.navigate("BookAppointment", {
        form: form,
        doctor: route.params.doctor,
        appointmentId: route.params.appointmentId,
        surveyDetails: surveyDetails,
        answersWithLabels: answersWithLabels,
        symptoms: flattenedSymptoms,
      });
    } else if (appointmentId && !forSaving) {
      // Save symptoms to the existing appointment and navigate back
      submitSurveyForm(surveyDetails, "patientId", "behalfUserId", appointmentId);
      if (appDetails) {
        await saveSymptomsInStorage();
        navigation.navigate("VisitDetails", {
          appDetails: appDetails,
          showUpdated: true,
          message: "Symptoms saved to appointment",
        });
      } else {
        await saveSymptomsInStorage();
        navigation.goBack();
      }
    } else {
      // If no doctor is selected yet, navigate to My Doctors
      await saveSymptomsInStorage();
      navigation.navigate("My Doctors", {
        surveyDetails: surveyDetails,
        answersWithLabels: answersWithLabels,
        symptoms: flattenedSymptoms,
        form: form,
        fromSurvey: true,
      });
    }
  };

  const getSubmitButtonText = () => {
    if (forSaving && appointmentId) {
      switch (language) {
        case "bn":
          return "সংরক্ষণ করুন";
        case "as":
          return "সংৰক্ষণ কৰক";
        default:
          return "Save";
      }
    } else {
      switch (language) {
        case "bn":
          return "জমা দিন";
        case "as":
          return "জমা দিয়ক";
        default:
          return "Submit";
      }
    }
  };

  const getSummaryButtonConfig = () => {
    // Check if onlySave is true from route params
    const onlySave = route.params?.onlySave;

    if (onlySave) {
      // 2 buttons: Edit and Save Symptoms (when onlySave is true)
      return {
        leftButton: {
          text: language === "en" ? "Edit" : language === "bn" ? "সম্পাদনা" : "সম্পাদনা কৰক",
          onPress: () => setShowSummaryModal(false),
          style: "secondary",
        },
        rightButton: {
          text:
            language === "en"
              ? "Save Symptoms"
              : language === "bn"
                ? "লক্ষণ সংরক্ষণ করুন"
                : "লক্ষণ সংৰক্ষণ কৰক",
          onPress: handleSubmit,
          style: "primary",
        },
      };
    } else {
      // 2 buttons: Edit and Book Appointment (when onlySave is false)
      return {
        leftButton: {
          text: language === "en" ? "Edit" : language === "bn" ? "সম্পাদনা" : "সম্পাদনা কৰক",
          onPress: () => setShowSummaryModal(false),
          style: "secondary",
        },
        rightButton: {
          text:
            language === "en"
              ? "Book Appointment"
              : language === "bn"
                ? "অ্যাপয়েন্টমেন্ট বুক করুন"
                : "এপইণ্টমেণ্ট বুক কৰক",
          onPress: handleSubmit,
          style: "primary",
        },
      };
    }
  };

  // useEffect(() => {
  //   console.log("Survey Answers :", surveyAnswer);
  //   console.log("Label answer :", answersWithLabels);
  // }, [surveyAnswer]);

  // console.log("answer", surveyAnswer);

  useEffect(() => {
    const resetAnswer = async () => {
      await deleteSavedSymtomsInStorage();
      setSurveyAnswer({});
      setAnswersWithLabels({});
    };
    resetAnswer();
  }, [language]);

  // Handle selected symptom from dashboard
  useEffect(() => {
    if (selectedSymptom && selectedSymptom.key) {
      // Find which section the selected symptom belongs to
      const section = translatedSymptomSection.find(
        sec => sec.categories && sec.categories.some(cat => cat.key === selectedSymptom.key)
      );

      if (section) {
        // Expand the section if it's not already expanded
        setExpandedSections(prev => ({
          ...prev,
          [section.key]: true,
        }));

        // Open the modal for the selected symptom
        setTimeout(() => {
          openCategoryModal(selectedSymptom.key, section.key);
        }, 100);
      }
    }
  }, [selectedSymptom]);

  const renderHeader = () => (
    <>
      {/* Custom Header */}
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: async () => {
            await saveSymptomsInStorage();
            navigation.goBack();
          },
        }}
        centerComponent={{
          text:
            language === "en"
              ? "Symptoms"
              : language === "bn"
                ? "লক্ষণসমূহ"
                : language === "as"
                  ? "লক্ষণসমূহ"
                  : "Medical History",
          style: {
            color: "#fff",
            fontSize: 18,
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        rightComponent={<AnimatedDropDown onSelect={changeLanguage} defaultFilter={language} />}
        ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ["#01869e", "#3cb0c4"],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        statusBarProps={{
          barStyle: "light-content",
          backgroundColor: "transparent",
        }}
        containerStyle={{ borderBottomWidth: 0, zIndex: 2 }}
      />
    </>
  );

  const renderSummaryView = () => {
    const newObj = {
      generalSymptoms: null,
      bodyParts: null,
      bodyExcretion: null,
      others: null,
    };
    Object.entries(surveyAnswer).map(([sectionKey, sectionValue]) => {
      if (sectionKey === "generalSymptoms") {
        newObj.generalSymptoms = sectionValue;
      } else if (sectionKey === "bodyParts") {
        // Merge bodyParts section safely
        newObj.bodyParts = {
          ...(newObj.bodyParts || {}),
          ...sectionValue,
        };
      } else if (sectionKey === "skin") {
        // Merge skin.my-skin into bodyParts safely
        newObj.bodyParts = {
          ...(newObj.bodyParts || {}),
          ["my-skin"]: {
            ...(newObj.bodyParts?.["my-skin"] || {}),
            ...sectionValue["my-skin"],
          },
        };
      } else if (sectionKey === "bodyExcretion") {
        newObj.bodyExcretion = sectionValue;
      } else if (sectionKey === "others") {
        newObj.others = sectionValue;
      }
    });

    const cleanedObj = Object.fromEntries(
      Object.entries(newObj).filter(([_, value]) => value !== null)
    );
    // console.log(cleanedObj);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.summaryContainer}
      >
        <Text style={styles.title}>Survey Summary for: {form.name}</Text>
        {Object.entries(cleanedObj).map(([sectionKey, sectionValue]) => {
          return (
            <View key={sectionKey} style={styles.summarySection}>
              <Text style={styles.summarySectionTitle}>
                {translatedSymptomSection.find(sec => sec.key === sectionKey)?.translations?.[
                  language
                ] || capitalizeHyphenWords(sectionKey)}
              </Text>

              {Object.entries(sectionValue).map(([categoryKey, questionMap]) => (
                <View key={categoryKey} style={styles.summaryCategory}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.summaryCategoryTitle}>
                      {/* {capitalizeHyphenWords(categoryKey)} */}
                      {translatedSymptomSection
                        ?.find(sec => sec.key === sectionKey)
                        ?.categories?.find(cat => cat.key === categoryKey)?.translations?.[
                        language
                      ] || capitalizeHyphenWords(categoryKey)}
                    </Text>

                    <Pressable
                      style={styles.editButton}
                      onPress={() => handleEdit(categoryKey, sectionKey)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                  </View>

                  {Object.entries(questionMap).map(([questionKey, _]) => {
                    // Override sectionKey for skin category
                    const effectiveSectionKey = categoryKey === "my-skin" ? "skin" : sectionKey;

                    const labelAnswer =
                      answersWithLabels?.[effectiveSectionKey]?.[categoryKey]?.[questionKey];

                    const translatedLabel = getTranslatedLabel(
                      effectiveSectionKey,
                      categoryKey,
                      questionKey,
                      language
                    );

                    return (
                      <View key={questionKey} style={styles.summaryQuestion}>
                        <View style={styles.questionAnswerRow}>
                          <Text style={styles.questionText}>{translatedLabel}:</Text>

                          {Array.isArray(labelAnswer) ? (
                            <View style={styles.answerListContainer}>
                              {labelAnswer.map((item, index) => (
                                <Text key={index} style={styles.answerListItem}>
                                  • {item}
                                </Text>
                              ))}
                            </View>
                          ) : (
                            <Text style={styles.answerText}>
                              {labelAnswer}
                              {questionKey === "feverTemperatureMeasure" ? tempScale : ""}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })}
        <View style={styles.buttonContainer}>
          {(() => {
            const buttonConfig = getSummaryButtonConfig();
            return (
              <>
                <Pressable
                  style={[
                    styles.backButton,
                    buttonConfig.leftButton.style === "secondary" && styles.secondaryButton,
                  ]}
                  onPress={buttonConfig.leftButton.onPress}
                >
                  <Text
                    style={[
                      styles.backButtonText,
                      buttonConfig.leftButton.style === "secondary" && styles.secondaryButtonText,
                    ]}
                  >
                    {buttonConfig.leftButton.text}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.submitButton,
                    buttonConfig.rightButton.style === "primary" && styles.primaryButton,
                  ]}
                  onPress={buttonConfig.rightButton.onPress}
                >
                  <Text
                    style={[
                      styles.submitButtonText,
                      buttonConfig.rightButton.style === "primary" && styles.primaryButtonText,
                    ]}
                  >
                    {buttonConfig.rightButton.text}
                  </Text>
                </Pressable>
              </>
            );
          })()}
        </View>
      </ScrollView>
    );
  };

  const renderSkinSection = (section, language) => {
    return (
      <View key={section.key} style={[styles.bodyPartSubCategory]}>
        {/* <Text style={styles.sectionHeading}>
          {section.translations[language] || section.translations.en}
        </Text> */}
        <View style={[styles.categoryGrid, { justifyContent: "center" }]}>
          {(expandedSections[section.key]
            ? section.categories
            : section.categories.slice(0, 8)
          ).map(category => (
            <Pressable
              key={category.key}
              style={styles.categoryCircleWrapper}
              onPress={() => openCategoryModal(category.key, section.key)}
            >
              <View style={styles.circle}>
                <Image source={category.image} style={styles.image} resizeMode="cover" />
                {Object.keys(surveyAnswer).includes(section.key) &&
                  Object.keys(surveyAnswer[section.key]).includes(category.key) &&
                  Object.entries(surveyAnswer[section.key][category.key]).length > 0 && (
                    <View style={styles.checkBox}>
                      <Text>
                        <Foundation name="check" color="#fff" size={16} />
                      </Text>
                    </View>
                  )}
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2} ellipsizeMode="tail">
                {category.translations[language] || category.translations.en}
              </Text>
            </Pressable>
          ))}
        </View>
        {section.categories.length > 8 && (
          <Pressable onPress={() => toggleSection(section.key)}>
            <Text style={styles.viewMoreText}>
              {expandedSections[section.key]
                ? language === "en"
                  ? "View Less"
                  : language === "bn"
                    ? "কম দেখুন"
                    : language === "as"
                      ? "কমকৈ চাওক"
                      : "View Less"
                : language === "en"
                  ? "View More"
                  : language === "bn"
                    ? "আরো দেখুন"
                    : language === "as"
                      ? "অধিক চাওক"
                      : "View More"}
              <Feather
                name={expandedSections[section.key] ? "arrow-up" : "arrow-down"}
                color={Color.headingColor}
                size={16}
              />
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderCategorySection = (section, language, allSections) => {
    // Set border color based on section key
    let sectionBorderColor = "#ccc";
    switch (section.key) {
      case "generalSymptoms":
        sectionBorderColor = "#1abc9c";
        break;
      case "bodyParts":
        sectionBorderColor = "#3498db";
        break;
      case "bodyExcretion":
        sectionBorderColor = "#e67e22";
        break;
      case "others":
        sectionBorderColor = "#9b59b6";
        break;
    }
    // Check if the section is 'bodyParts' and has the new nested structure
    if (section.key === "bodyParts" && section.categories[0] && section.categories[0].bodyParts) {
      // 0. Pull in "my-skin" if exists from survey data and render state
      const skinSection = allSections.find(s => s.key === "skin");
      // 1. Flatten all body parts, associating each with its sub-category for later grouping

      const allBodyPartsWithSubCategory = section.categories.flatMap(bodyPartCategory =>
        bodyPartCategory.bodyParts.map(bodyPart => ({
          ...bodyPart,
          subCategoryName: bodyPartCategory.name,
          subCategoryTranslation:
            bodyPartCategory.translation[language] || bodyPartCategory.translation.en,
        }))
      );

      // 2. Apply the "View More/Less" slicing logic to the flattened list
      const displayedBodyParts = expandedSections[section.key]
        ? allBodyPartsWithSubCategory
        : allBodyPartsWithSubCategory.slice(0, 8); // Show only the first 8 initially

      // 3. Group the displayed body parts back by their original sub-category
      const groupedDisplayedBodyParts = displayedBodyParts.reduce((acc, bodyPart) => {
        if (!acc[bodyPart.subCategoryName]) {
          acc[bodyPart.subCategoryName] = {
            name: bodyPart.subCategoryName,
            translation: bodyPart.subCategoryTranslation,
            bodyParts: [],
          };
        }
        acc[bodyPart.subCategoryName].bodyParts.push(bodyPart);
        return acc;
      }, {});

      const orderedGroupedBodyParts = [
        ...section.categories.map(cat => groupedDisplayedBodyParts[cat.name]).filter(Boolean),
      ];

      return (
        <View
          key={section.key}
          style={[styles.categoryBox, { borderWidth: 1, borderColor: sectionBorderColor }]}
        >
          <Text style={styles.sectionHeading}>
            {section.translations[language] || section.translations.en}
          </Text>
          {(Object.keys(surveyAnswer?.[section.key] || {}).length > 0 ||
            Object.keys(surveyAnswer?.["skin"] || {}).length > 0) && (
            <Pressable
              onPress={() => {
                const updatedSurveyAnswer = { ...surveyAnswer };
                delete updatedSurveyAnswer[section.key];
                delete updatedSurveyAnswer["skin"];

                setSurveyAnswer(updatedSurveyAnswer);

                const updatedAnswersWithLabels = { ...answersWithLabels };
                delete updatedAnswersWithLabels[section.key];
                delete updatedAnswersWithLabels["skin"];
                setAnswersWithLabels(updatedAnswersWithLabels);
              }}
              style={styles.closeBtn}
            >
              <Feather name="trash-2" color={Color.headingColor} size={20} />{" "}
            </Pressable>
          )}

          {/* Iterate through the *grouped displayed* body parts */}
          {orderedGroupedBodyParts.map(
            (
              bodyPartCategory,
              index // Iterate through "Upper Body", "Middle Body", "Lower Body" (only those with displayed items)
            ) => (
              <View key={bodyPartCategory.name} style={styles.bodyPartSubCategory}>
                {index === 0 && skinSection && renderSkinSection(skinSection, language)}
                <Text style={styles.subCategoryHeading}>
                  {bodyPartCategory.translation}
                  {/* Display the sub-category name (e.g., "Upper Body") */}
                </Text>
                <View style={styles.categoryGrid}>
                  {bodyPartCategory.bodyParts.map(category => (
                    <Pressable
                      key={category.key}
                      style={styles.categoryCircleWrapper}
                      onPress={() => openCategoryModal(category.key, section.key)} // Still pass section.key
                    >
                      <View style={styles.circle}>
                        <Image source={category.image} style={styles.image} resizeMode="cover" />
                        {Object.keys(surveyAnswer).includes(section.key) &&
                          Object.keys(surveyAnswer[section.key]).includes(category.key) &&
                          Object.entries(surveyAnswer[section.key][category.key]).length > 0 && (
                            <View style={styles.checkBox}>
                              <Text>
                                <Foundation name="check" color="#fff" size={16} />
                              </Text>
                            </View>
                          )}
                      </View>
                      <Text style={styles.categoryLabel} numberOfLines={2} ellipsizeMode="tail">
                        {category.translations[language] || category.translations.en}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )
          )}
          {/* "View More" button now correctly controls the overall display */}
          {allBodyPartsWithSubCategory.length > 8 && (
            <Pressable onPress={() => toggleSection(section.key)}>
              <Text style={styles.viewMoreText}>
                {expandedSections[section.key]
                  ? language === "en"
                    ? "View Less"
                    : language === "bn"
                      ? "কম দেখুন"
                      : language === "as"
                        ? "কমকৈ চাওক"
                        : "View Less"
                  : language === "en"
                    ? "View More"
                    : language === "bn"
                      ? "আরো দেখুন"
                      : language === "as"
                        ? "অধিক চাওক"
                        : "View More"}
                <Feather
                  name={expandedSections[section.key] ? "arrow-up" : "arrow-down"}
                  color={Color.headingColor}
                  size={16}
                />
              </Text>
            </Pressable>
          )}
        </View>
      );
    } else {
      // Original logic for other sections remains unchanged
      if (section.key === "skin") return null;

      return (
        <View
          key={section.key}
          style={[styles.categoryBox, { borderWidth: 1, borderColor: sectionBorderColor }]}
        >
          <Text style={styles.sectionHeading}>
            {section.translations[language] || section.translations.en}
          </Text>
          {Object.keys(surveyAnswer?.[section.key] || {}).length > 0 && (
            <Pressable
              onPress={() => {
                const updatedSurveyAnswer = { ...surveyAnswer };
                delete updatedSurveyAnswer[section.key];
                setSurveyAnswer(updatedSurveyAnswer);

                const updatedAnswersWithLabels = { ...answersWithLabels };
                delete updatedAnswersWithLabels[section.key];
                setAnswersWithLabels(updatedAnswersWithLabels);
              }}
              style={[styles.closeBtn, { marginBottom: 10 }]}
            >
              <Feather name="trash-2" color={Color.headingColor} size={20} />
            </Pressable>
          )}

          <View
            style={[
              styles.categoryGrid,
              { justifyContent: section.key == "others" ? "center" : "flex-start" },
            ]}
          >
            {(expandedSections[section.key]
              ? section.categories
              : section.categories.slice(0, 8)
            ).map(category => (
              <Pressable
                key={category.key}
                style={styles.categoryCircleWrapper}
                onPress={() => openCategoryModal(category.key, section.key)}
              >
                <View style={styles.circle}>
                  <Image source={category.image} style={styles.image} resizeMode="cover" />
                  {Object.keys(surveyAnswer).includes(section.key) &&
                    Object.keys(surveyAnswer[section.key]).includes(category.key) &&
                    Object.entries(surveyAnswer[section.key][category.key]).length > 0 && (
                      <View style={styles.checkBox}>
                        <Text>
                          <Foundation name="check" color="#fff" size={16} />
                        </Text>
                      </View>
                    )}
                </View>
                <Text style={styles.categoryLabel} numberOfLines={2} ellipsizeMode="tail">
                  {category.translations[language] || category.translations.en}
                </Text>
              </Pressable>
            ))}
          </View>
          {section.categories.length > 8 && (
            <Pressable onPress={() => toggleSection(section.key)}>
              <Text style={styles.viewMoreText}>
                {expandedSections[section.key]
                  ? language === "en"
                    ? "View Less"
                    : language === "bn"
                      ? "কম দেখুন"
                      : language === "as"
                        ? "কমকৈ চাওক"
                        : "View Less"
                  : language === "en"
                    ? "View More"
                    : language === "bn"
                      ? "আরো দেখুন"
                      : language === "as"
                        ? "অধিক চাওক"
                        : "View More"}
                <Feather
                  name={expandedSections[section.key] ? "arrow-up" : "arrow-down"}
                  color={Color.headingColor}
                  size={16}
                />
              </Text>
            </Pressable>
          )}
        </View>
      );
    }
  };
  // Log the section being sent to renderCategorySection
  // translatedSymptomSection.forEach(section => {
  // console.log("Rendering section:", section.key, section);
  // });

  // console.log("surveyAnswer::   ", surveyAnswer);
  // console.log("answer with Label", answersWithLabels);

  return (
    <>
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: hasAnsweredQuestions() ? 80 : 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {form.name !== "Self" && (
          <View style={styles.formCard}>
            <Text style={[styles.title, { textAlign: "center", color: Color.headingColor }]}>
              Survey For: {form.name}
            </Text>
            <Text style={styles.detail}>Birthdate: {form.birthdate}</Text>
            <Text style={styles.detail}>Gender: {form.gender}</Text>
            <Text style={styles.detail}>Relation: {form.relation}</Text>
          </View>
        )}

        {Object.keys(surveyAnswer).length > 0 && (
          <Pressable
            onPress={() => {
              setSurveyAnswer({});
              setAnswersWithLabels({});
            }}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Clear All</Text>
          </Pressable>
        )}

        {translatedSymptomSection.map(section =>
          renderCategorySection(section, language, translatedSymptomSection)
        )}

        {/* {hasAnsweredQuestions() && (
          <View style={styles.submitContainer}>
            <Pressable style={styles.reviewButton} onPress={() => setShowSummaryModal(true)}>
              <Text style={styles.reviewButtonText}>{getReviewText(language)}</Text>
            </Pressable>
          </View>
        )} */}
      </ScrollView>
      {hasAnsweredQuestions() && (
        <View style={styles.stickyButtonContainer}>
          <Pressable style={styles.reviewButton} onPress={() => setShowSummaryModal(true)}>
            <Text style={styles.reviewButtonText}>{getReviewText(language)}</Text>
          </Pressable>
        </View>
      )}
      <Modal
        isVisible={modalVisible}
        onModalHide={closeModal}
        swipeDirection={null}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={false}
        backdropOpacity={0.5}
        style={styles.modal}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
      >
        <View style={styles.modalContainer}>
          <QuestionScreen
            category={selectedCategory}
            sheetname={selectedSheet}
            form={form}
            onClose={closeModal}
            surveyAnswer={surveyAnswer}
            setSurveyAnswer={setSurveyAnswer}
            answersWithLabels={answersWithLabels}
            setAnswersWithLabels={setAnswersWithLabels}
            tempScale={tempScale}
            setTempScale={setTempScale}
            language={language}
            setLanguage={setLanguage}
          />
        </View>
      </Modal>
      <Modal
        isVisible={showSummaryModal}
        onModalHide={() => setShowSummaryModal(false)}
        swipeDirection={null}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={false}
        backdropOpacity={0.5}
        style={styles.modal}
        onBackdropPress={() => setShowSummaryModal(false)}
        onBackButtonPress={() => setShowSummaryModal(false)}
      >
        <View style={styles.modalContainer}>{renderSummaryView()}</View>
      </Modal>
    </>
  );
};

export default SurveyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Color.bcBackground,
    marginBottom: 20,
    // Removed static paddingBottom
  },
  title: {
    fontSize: FontSize.heading_H2,
    fontWeight: "bold",
    color: Color.darkGray,
    fontFamily: FontFamily.Inter_Bold,
    marginBottom: 12,
  },
  detail: {
    fontSize: FontSize.body_Text,
    color: Color.answerColor,
    marginBottom: 6,
    fontFamily: FontFamily.Inter_Regular,
  },
  sectionHeading: {
    fontSize: FontSize.heading_H3,
    fontWeight: "600",
    color: Color.headingColor,
    fontFamily: FontFamily.Inter_SemiBold,
    marginVertical: 16,
    position: "absolute",
    top: -35,
    left: 15,
    zIndex: 10,
    backgroundColor: Color.sectionHeaderColor,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    elevation: 5,
  },
  categoryBox: {
    backgroundColor: Color.bcSubSection,
    borderRadius: Border.br_xl,
    padding: 16,
    elevation: 2,
    marginVertical: 20,
  },
  bodyPartSubCategory: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD", // Line separator
    // paddingBottom: 5,
    // borderWidth: 1,
    // borderColor: "red",
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginTop: -10,
    marginBottom: -10,
    backgroundColor: Color.sectionHeaderColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Color.headingColor,
  },
  subCategoryHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
    marginTop: 10,

    paddingLeft: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  categoryCircleWrapper: {
    width: "23%",
    alignItems: "center",
    marginVertical: 12,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E1F5FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  image: {
    width: 54, // previously 40
    height: 54, // previously 40
    borderRadius: 27, // match half the size for circular
  },

  categoryLabel: {
    fontSize: FontSize.caption,
    textAlign: "center",
    fontFamily: FontFamily.Inter_Regular,
    color: Color.darkGray,
    width: 100,
    height: 36, // enough for 2 lines
    lineHeight: 18,
  },
  viewMoreText: {
    color: Color.headingColor,
    textAlign: "center",
    fontSize: FontSize.previewBtn,
    fontFamily: FontFamily.Inter_SemiBold,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: Color.bcSubSection,
    padding: 16,
    borderRadius: Border.br_xl,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeading: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: Color.questionColor,
    marginBottom: 10,
  },
  submitContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  // reviewButton: {
  //   backgroundColor: Color.headingColor,
  //   paddingVertical: 16,
  //   paddingHorizontal: 32,
  //   borderRadius: Border.br_xl,
  //   alignItems: "center",
  //   elevation: 3,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  // },

  reviewButton: {
    backgroundColor: Color.headingColor,
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderRadius: Border.br_xl,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "100%", // Add this line for full width button
  },
  reviewButtonText: {
    color: "white",
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    fontWeight: "600",
  },
  stickyButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    // backgroundColor: "rgba(255,255,255,0.95)",
    zIndex: 100,
    // elevation: 10,
    alignItems: "center",
    width: "100%", // Ensures full width
  },
  summaryContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Color.bcBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summarySection: {
    marginBottom: 24,
    backgroundColor: Color.bcSubSection,
    borderRadius: Border.br_xl,
    padding: 16,
    elevation: 2,
  },
  summarySectionTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: Color.headingColor,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Color.headingColor,
    paddingBottom: 8,
  },
  summaryCategory: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: Border.br_m || 8,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryCategoryTitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: Color.questionColor,
    flex: 1,
  },
  editButton: {
    backgroundColor: Color.lightGray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: Color.headingColor,
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_SemiBold,
  },
  summaryQuestion: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Color.lightGray,
  },

  answerText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: Color.answerColor,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: Color.lightGray,
    paddingVertical: 16,
    borderRadius: Border.br_xl,
    alignItems: "center",
  },
  backButtonText: {
    color: Color.darkGray,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Color.headingColor,
    paddingVertical: 16,
    borderRadius: Border.br_xl,
    alignItems: "center",
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    fontWeight: "600",
  },

  answerListContainer: {
    marginLeft: 12,
    marginTop: 4,
  },
  questionAnswerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  questionText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: Color.questionColor,
    flex: 1,
    marginRight: 12,
  },
  answerText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: Color.answerColor,
    flex: 1,
    textAlign: "right",
  },
  answerListContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  answerListItem: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: Color.answerColor,
    textAlign: "right",
    marginBottom: 2,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end", // ✅ aligns modal to bottom
  },
  modalContainer: {
    height: "80%", // ✅ 80% of screen height
    backgroundColor: Color.bcBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    overflow: "hidden",
  },
  checkBox: {
    width: 25,
    height: 25,
    backgroundColor: Color.checkColor,
    borderRadius: 20,
    position: "absolute",
    left: "65%",
    top: "60%",
    justifyContent: "center",
    alignItems: "center",
  },

  // Summary modal button styles
  secondaryButton: {
    backgroundColor: Color.lightGray,
    borderWidth: 1,
    borderColor: Color.darkGray + "30",
  },
  primaryButton: {
    backgroundColor: Color.headingColor,
    elevation: 3,
    shadowColor: Color.headingColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    color: Color.darkGray,
  },
  primaryButtonText: {
    color: "white",
  },
});
