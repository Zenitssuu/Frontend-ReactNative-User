import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
import { generalPractitioner } from "../utils/general_symptoms";
import { bodyExcretion, stoolDescriptions, stoolSmellDescriptions } from "../utils/body_excretion";
import { skin } from "../utils/skin";
import { others } from "../utils/others";
import { bodyParts } from "../utils/body_parts";
import { translatedSymptomSection } from "../utils/translatedSymptomSection";
// import {bodyParts} from "../../utils/body_parts";
import QuestionCard from "../components/QuestionCard";
import { Color } from "../constants/GlobalStyles";

export const RenderQuestion = props => {
  return <QuestionCard {...props} />;
};

const QuestionScreen = ({
  category,
  sheetname,
  form,
  onClose,
  surveyAnswer,
  setSurveyAnswer,
  answersWithLabels,
  setAnswersWithLabels,
  tempScale,
  setTempScale,
  durationType,
  setDurationType,
  language,
  setLanguage,
}) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  // const [language, setLanguage] = useState("en");
  // const [open, setOpen] = useState(false);
  // const [languageItems, setLanguageItems] = useState([
  //   { label: "English", value: "en" },
  //   { label: "বাংলা", value: "bn" },
  //   { label: "অসমীয়াত", value: "as" },
  // ]);

  useEffect(() => {
    // Initialize answers from surveyAnswer if available
    if (surveyAnswer && surveyAnswer[sheetname] && surveyAnswer[sheetname][category]) {
      setAnswers(surveyAnswer[sheetname][category]);
    }
  }, [surveyAnswer]);

  useEffect(() => {
    let selectedQuestionBank = [];
    switch (sheetname) {
      case "generalSymptoms":
        selectedQuestionBank = generalPractitioner[category];
        break;
      case "bodyExcretion":
        selectedQuestionBank = bodyExcretion[category];
        break;
      case "skin":
        selectedQuestionBank = skin[category];
        break;
      case "others":
        selectedQuestionBank = others[category];
        break;
      case "bodyParts":
        selectedQuestionBank = bodyParts[category];
        break;
      default:
        selectedQuestionBank = [];
    }

    // const filteredQuestions = selectedQuestionBank.filter(q => q.category === category);
    const filteredQuestions = selectedQuestionBank;

    // const questionsWithDurationFlag = filteredQuestions.map(q => {
    //   if (q.quesKey === "feverDuration") {
    //     return { ...q, isDuration: true };
    //   }
    //   return q;
    // });

    setQuestions(filteredQuestions);
  }, [category, sheetname]);

  const pruneAnswer = updatedAnswers => {
    // Prune hidden dependent answers
    const prunedAnswers = { ...updatedAnswers };
    questions.forEach(q => {
      if (q?.showIf) {
        const isVisible = Object.entries(q?.showIf).some(([depKey, expectedVals]) =>
          expectedVals.includes(updatedAnswers[depKey])
        );
        if (!isVisible && prunedAnswers[q?.quesKey] !== undefined) {
          delete prunedAnswers[q?.quesKey];
        }
      }
    });
    setAnswers(prunedAnswers);
    return prunedAnswers;
  };

  const handleAnswerChange = (quesKey, value, label) => {
    let updatedAnswers = { ...answers, [quesKey]: value };

    // remove queskey if it is empty or not answered
    if (
      !updatedAnswers[quesKey] ||
      (Array.isArray(updatedAnswers[quesKey]) && updatedAnswers[quesKey].length === 0) ||
      (typeof updatedAnswers[quesKey] === "object" &&
        updatedAnswers[quesKey] !== null &&
        !Array.isArray(updatedAnswers[quesKey]) &&
        Object.keys(updatedAnswers[quesKey]).length === 0)
    ) {
      delete updatedAnswers[quesKey];
    }

    pruneAnswer(updatedAnswers);

    // Store label in preview-only answersWithLabels
    setAnswersWithLabels(prev => ({
      ...prev,
      [sheetname]: {
        ...(prev[sheetname] || {}),
        [category]: {
          ...((prev[sheetname] || {})[category] || {}),
          [quesKey]: label,
        },
      },
    }));
  };

  const isQuestionVisible = question => {
    if (!question.showIf) return true;
    // return Object.entries(question.showIf).some(([depKey, expectedVals]) => {
    //   const answer = answers[depKey];

    //   if (Array.isArray(answer)) {
    //     // Multi-select case: check if any expected value is present in the answer array
    //     return expectedVals.some(val => answer.includes(val));
    //   } // Single-select or string value

    //   return expectedVals.includes(answer);
    // });
  };

  // const formatQuestionKey = key => {
  //   return key
  //     .replace(/([A-Z])/g, " $1") // Add space before capital letters
  //     .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
  //     .trim();
  // };

  const handleFinalSubmit = () => {
    // final pruning of answers before submitting
    const prunedAnswers = pruneAnswer(answers);

    // set survey answer, remove the queskey if nothing answered in this section
    if (Object.keys(prunedAnswers).length > 0)
      setSurveyAnswer(prev => ({
        ...prev,
        [sheetname]: { ...surveyAnswer[sheetname], [category]: prunedAnswers },
      }));
    else {
      setSurveyAnswer(prev => {
        let previousSurvey = { ...prev };
        if (previousSurvey[sheetname] && previousSurvey[sheetname][category])
          delete previousSurvey[sheetname][category];
        return previousSurvey;
      });
    }

    onClose();
  };

  const getCategoryLabel = (categoryKey, language) => {
    for (const section of translatedSymptomSection) {
      for (const category of section.categories) {
        if (category.key === categoryKey) {
          return category.translations[language] || category.translations.en;
        }
      }
    }
    return capitalizeHyphenWords(categoryKey); // fallback
  };

  const capitalizeHyphenWords = input => {
    if (!input || typeof input !== "string") return "";
    return input
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Language-specific submit button text
  const getSubmitText = () => {
    switch (language) {
      case "bn":
        return "জমা দিন";
      case "as":
        return "জমা কৰক";
      default:
        return "Submit";
    }
  };

  const getQuestionKey = question => {
    return `${question.quesKey}-${question.category}-${question.id}-${question.type}`;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        {/** Clear Button on the left **/}
        <View style={{ flex: 1 }}>
          {surveyAnswer && surveyAnswer[sheetname] && surveyAnswer[sheetname][category] && (
            <Pressable
              onPress={() => {
                // 🔥 Remove category from surveyAnswer
                setSurveyAnswer(prev => {
                  const updated = { ...prev };
                  const updatedSheet = { ...(updated[sheetname] || {}) };
                  delete updatedSheet[category];
                  updated[sheetname] = updatedSheet;
                  if (Object.keys(updated[sheetname]).length === 0) {
                    delete updated[sheetname];
                  }
                  return updated;
                }); // 🔥 Remove category from answersWithLabels

                setAnswersWithLabels(prev => {
                  const updated = { ...prev };
                  const updatedSheet = { ...(updated[sheetname] || {}) };
                  delete updatedSheet[category];
                  updated[sheetname] = updatedSheet;
                  if (Object.keys(updated[sheetname]).length === 0) {
                    delete updated[sheetname];
                  }
                  return updated;
                });

                onClose();
              }}
              style={[styles.clearBtn, { alignSelf: "flex-start" }]}
            >
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {/** Center Header Text **/}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.header, { color: "black", textAlign: "center" }]}>
            {getCategoryLabel(category, language)}
          </Text>
        </View>

        {/** Close Button on the right **/}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {onClose && (
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {questions.filter(isQuestionVisible).map(question => (
          <View style={[styles.card]} key={getQuestionKey(question)}>
            <RenderQuestion
              question={question}
              language={language}
              value={answers[question.quesKey]}
              onChange={(val, label) => handleAnswerChange(question.quesKey, val, label)}
              tempQues={question.quesKey === "feverTemperatureMeasure"}
              tempScale={question.quesKey === "feverTemperatureMeasure" ? tempScale : ""}
              setTempScale={question.quesKey === "feverTemperatureMeasure" ? setTempScale : ""}
              // setDurationType={question.isDuration ? setDurationType : ""} // Pass setDurationType
              questionDescription={
                question.quesKey === "stool-type"
                  ? stoolDescriptions
                  : question.quesKey === "stool-odor"
                    ? stoolSmellDescriptions
                    : {}
              }
              allQuestions={questions}
              handleAnswerChange={handleAnswerChange}
              answers={answers}
              showIfTempScale={tempScale}
              showIfSetTempScale={setTempScale}
            />
          </View>
        ))}

        {/* button */}
        <Pressable style={styles.submitBtn} onPress={handleFinalSubmit}>
          <Text style={styles.submitText}>{getSubmitText()}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default QuestionScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.colorWhite,
    marginBottom: 24,
    padding: 18,
    margin: 2,
    borderRadius: 14,
    borderColor: "#EFEFEF",
    borderWidth: 1,
    // shadowColor: "black",
    // shadowOffset: { width: 3, height: 3 },
    // shadowOpacity: 1,
    // shadowRadius: 6,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: Color.bcBackground,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  clearBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
    backgroundColor: Color.sectionHeaderColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Color.headingColor,
    // marginRight: 8,
  },
  clearText: {
    color: Color.headingColor,
    fontWeight: "bold",
    fontSize: 14,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
    backgroundColor: Color.sectionHeaderColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Color.headingColor,
  },
  closeText: {
    color: Color.headingColor,
    fontWeight: "bold",
    fontSize: 14,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: Color.headingColor,
    textAlign: "center",
  },
  languagePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dropdown: {
    width: 150,
    borderColor: "#FFDDE4",
    borderRadius: 10,
    alignSelf: "flex-end",
    height: 45,
  },
  dropdownContainer: {
    borderColor: "#FFDDE4",
    borderRadius: 10,
    width: 150,
    alignSelf: "flex-end",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    color: "#333",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  submitBtn: {
    backgroundColor: Color.headingColor,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  submitText: {
    color: Color.colorWhite,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  answerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF5F8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5C8A",
  },
  questionKeyText: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#D6336C",
    marginBottom: 5,
  },
  answerValueText: {
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  noAnswersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  backButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#DDD",
  },
  confirmButton: {
    backgroundColor: "#FF5C8A",
  },
  backButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
