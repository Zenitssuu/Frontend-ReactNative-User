import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Platform } from "react-native";
import Modal from "react-native-modal";
import RadioGroup from "./InputComponents/RadioGroup";
import CheckboxGroup from "./InputComponents/CheckboxGroup";
import DatePickerInput from "./InputComponents/DatePickerInput";
import FilePickerInput from "./InputComponents/FilePickerInput";
import { Color, Border } from "../constants/GlobalStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { RenderQuestion } from "../screens/QuestionScreen";
import { stoolDescriptions, stoolSmellDescriptions } from "../utils/body_excretion";
import PainLevelSlider from "./InputComponents/conditionSlider";
// import {getTranslatedDurationChoice} from "../../utils/getTranslatedDurationChoice "

const Card = ({
  question,
  language,
  value,
  onChange,
  tempQues = false,
  tempScale = "",
  setTempScale,
  questionDescription,
}) => {
  const { quesName, options = [] } = question.translation[language] || {};
  const [tempDropdownOpen, setTempDropdownOpen] = useState(false);
  const [tempScaleItems, setTempScaleItems] = useState([
    { label: "°C", value: "°C" },
    { label: "°F", value: "°F" },
  ]);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const renderInput = () => {
    switch (question.type) {
      case "single-choice":
        return <RadioGroup options={options} value={value} onChange={onChange} />;
      case "multi-choice":
        return <CheckboxGroup options={options} value={value} onChange={onChange} />;
      case "slider":
        return <PainLevelSlider value={value} language={language} onChange={onChange} />;
      case "input-text":
      case "number":
        if (tempQues) {
          return (
            <View style={styles.inputWithDropdownContainer}>
              <TextInput
                value={value || ""}
                onChangeText={text => {
                  const cleaned = text.replace(/[^0-9.]/g, "");
                  onChange(cleaned, cleaned);
                }}
                keyboardType="numeric"
                placeholder="Enter Temp"
                style={styles.tempInput}
              />
              <View style={styles.dropdownWrapper}>
                <DropDownPicker
                  open={tempDropdownOpen}
                  value={tempScale}
                  items={tempScaleItems}
                  setOpen={setTempDropdownOpen}
                  setValue={setTempScale}
                  setItems={setTempScaleItems}
                  placeholder="°C"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={10000}
                  zIndexInverse={1000}
                  listMode="SCROLLVIEW" // Better compatibility
                  dropDownDirection="TOP"
                />
              </View>
            </View>
          );
        }
        return (
          <TextInput
            value={value || ""}
            onChangeText={text => onChange(text, text)}
            keyboardType={question.type === "number" ? "numeric" : "default"}
            style={styles.textInput}
          />
        );

      case "date":
        return <DatePickerInput value={value} onChange={(val, label) => onChange(val, label)} />;

      case "file":
        return <FilePickerInput value={value} onChange={(val, label) => onChange(val, label)} />;

        return null;
    }
  };

  return (
    <View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.title]}>{quesName}</Text>
          {Object.keys(questionDescription).length > 0 && (
            <Pressable
              onPress={() => setTooltipVisible(true)}
              style={[styles.infoButton, { marginLeft: 8 }]} // optional spacing
            >
              {/* <Text
                style={[
                  styles.infoText,
                  { marginBottom: 13, borderRadius: 10 },
                ]}
              >
                ℹ️
              </Text> */}
              <Icon
                name="info"
                size={18}
                color="#333"
                style={[styles.infoText, { marginBottom: 10, borderRadius: 10, color: "#5ea5e7" }]}
              />
            </Pressable>
          )}
        </View>
      </View>
      <View style={[styles.question, { flexDirection: "row", alignItems: "center" }]}>
        {renderInput()}
      </View>
      <Modal
        transparent
        visible={tooltipVisible}
        animationType="fade"
        onRequestClose={() => setTooltipVisible(false)}
        style={{ margin: 0, overflow: "hidden" }}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Info</Text>

            <View style={styles.descriptionContainer}>
              {questionDescription &&
                questionDescription[language]?.map((val, idx) => (
                  <Text key={idx} style={styles.descriptionText}>
                    • {val}
                  </Text>
                ))}
            </View>

            <Pressable onPress={() => setTooltipVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const QuestionCard = ({
  question,
  language,
  value,
  onChange,
  tempQues = false,
  tempScale = "",
  setTempScale,
  questionDescription,
  allQuestions = [],
  handleAnswerChange,
  answers,
  showIfTempScale,
  showIfSetTempScale,
}) => {
  const [showIfQues, setShowIfQues] = useState([]);

  useEffect(() => {
    allQuestions = allQuestions.filter(curr => curr.showIf && curr.showIf[question.quesKey]);
    setShowIfQues(allQuestions);
  }, [question]);

  const getQuestionKey = question => {
    return `${question.quesKey}-${question.category}-${question.id}-${question.type}`;
  };

  return (
    <>
      <Card
        question={question}
        language={language}
        value={value}
        onChange={onChange}
        tempQues={tempQues}
        tempScale={tempScale}
        setTempScale={setTempScale}
        questionDescription={questionDescription}
      />

      {showIfQues.length > 0 &&
        showIfQues.map((currQues, index) => {
          if (currQues.showIf[question.quesKey].includes(answers[question.quesKey]))
            return (
              <View style={{ marginTop: 10 }} key={getQuestionKey(currQues)}>
                <View
                  style={{
                    backgroundColor: "#EEEEEE",
                    height: 5,
                    width: "100%",
                    marginVertical: 10,
                  }}
                ></View>
                <RenderQuestion
                  question={currQues}
                  language={language}
                  value={answers[currQues.quesKey]}
                  onChange={(val, label) => handleAnswerChange(currQues.quesKey, val, label)}
                  tempQues={currQues.quesKey === "feverTemperatureMeasure"}
                  tempScale={currQues.quesKey === "feverTemperatureMeasure" ? showIfTempScale : ""}
                  setTempScale={
                    currQues.quesKey === "feverTemperatureMeasure" ? showIfSetTempScale : ""
                  }
                  questionDescription={
                    currQues.quesKey === "stool-type"
                      ? stoolDescriptions
                      : currQues.quesKey === "stool-odor"
                        ? stoolSmellDescriptions
                        : {}
                  }
                  allQuestions={allQuestions}
                  handleAnswerChange={handleAnswerChange}
                  answers={answers}
                  showIfTempScale={showIfTempScale}
                  showIfSetTempScale={showIfSetTempScale}
                />
              </View>
            );
        })}
    </>
  );
};

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
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Color.headingColor,
    marginBottom: 12,
  },
  textInput: {
    borderColor: Color.headingColor,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
    fontSize: 16,
    marginTop: 10,
    flex: 1,
  },
  question: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 20,
    // Each option should take 48% width to fit 2 per row with gap
  },
  // dropdown: {
  //   width: 80,
  //   borderColor: "#FFDDE4",
  //   borderRadius: 10,
  //   height: 50,
  //   zIndex: 1000,
  // },
  // dropdownContainer: {
  //   borderColor: "#FFDDE4",
  //   borderRadius: 10,
  //   width: 80,
  //   zIndex: 1000,
  //   elevation: 1000,
  // },
  // dropdownText: {
  //   fontSize: 16,
  // },
  // dropdownLabel: {
  //   fontSize: 14,
  //   color: "#333",
  // },
  // tempDropdownContainer: {
  //   zIndex: 1000,
  //   elevation: 1000,
  // },
  tempRadioContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.headingColor,
  },
  tempLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Color.headingColor,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 15,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.headingColor,
    backgroundColor: "#FFF",
  },
  radioOptionSelected: {
    backgroundColor: Color.bcBackground,
    borderColor: Color.headingColor,
    borderWidth: 2,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Color.headingColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioSelected: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Color.headingColor,
  },
  radioText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  inputWithDropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    zIndex: 10000,
  },

  tempInput: {
    flex: 1, // Take all available space
    borderColor: Color.headingColor,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
    fontSize: 16,
    height: 48,
  },

  dropdownWrapper: {
    width: 80, // lock dropdown to small size
    zIndex: 10000,
  },
  durationDropdownWrapper: {
    width: 100, // lock dropdown to small size
    zIndex: 10000,
  },

  dropdown: {
    fontSize: 9,
    width: "100%",
    borderColor: Color.headingColor,
    borderWidth: 1.5,
    borderRadius: 10,
    height: 48,
    backgroundColor: "#fff",
  },

  dropdownContainer: {
    width: 80,
    borderColor: Color.headingColor,
    borderRadius: 10,
    zIndex: 10000,
    elevation: 10,
  },
});

export default QuestionCard;
