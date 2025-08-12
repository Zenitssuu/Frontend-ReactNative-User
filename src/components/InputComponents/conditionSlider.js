import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { FontFamily } from "../../constants/GlobalStyles";

const PainLevelSlider = ({ value, onChange, language }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const painLevels = [
    {
      value: 1,
      en: "Low",
      bn: "কম",
      as: "নিম্ন",
      color: "#66FF33",
    }, // Light Green
    {
      value: 2,
      en: "Medium",
      bn: "মোটামুটি",
      as: "মাধ্যম",
      color: "#FF9900",
    }, // Light Green
    {
      value: 3,
      en: "High",
      bn: "বেশি",
      as: "ওখ",
      color: "#FF3300",
    }, // Yellow-Green
  ];
  // Map the incoming value (Low, Medium, High) to the corresponding painLevels value (1, 2, 3)
  // useEffect(() => {
  //   if (value) {
  //     const found = painLevels.find(level => level.en.toLowerCase() === value.toLowerCase());
  //     if (found) {
  //       setSelectedOption(found.value);
  //     } else {
  //       setSelectedOption(null);
  //     }
  //   } else {
  //     setSelectedOption(null);
  //   }
  // }, [value]);

  const handlePress = option => {
    setSelectedOption(option);
    const selectedPainLevel = painLevels.find(level => level.value === option);
    const value = selectedPainLevel ? selectedPainLevel.en : "";
    const label = selectedPainLevel ? selectedPainLevel[language] : "";
    onChange(value, label);
  };

  return (
    <View style={styles.sliderContainer}>
      <View style={[styles.track]} />
      <View style={styles.labelsContainer}>
        {painLevels.map(level => (
          <TouchableWithoutFeedback key={level.value} onPress={() => handlePress(level.value)}>
            <View
              style={[
                styles.label,
                {
                  backgroundColor: level.color,
                  opacity: selectedOption >= level.value ? 1 : 0.1,
                },
              ]}
            >
              {/* <Text style={[styles.labelText, { color: "#000" }]}>
                {language === "English"
                  ? level.en
                  : language === "हिन्दी"
                    ? level.hindilabel
                    : language === "অসমীয়া"
                      ? level.as
                      : level.bn}
              </Text> */}
              <Text style={[styles.labelText, { color: "#000" }]}>{level[language]}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
};

export default PainLevelSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    justifyContent:"center",
    flexDirection: "column",
    alignItems: "center",
    height: 30,
    overflow: "hidden",
    backgroundColor: "#d3d3d3",
    borderRadius: 5,
    marginVertical: 13,

  },


  track: {
    height: 6,
    position: "absolute",
    zIndex: 0,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
    // position: "absolute",
    width: "100%",
    height: "100%",
  },
  label: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  labelText: {
    fontSize: 11,
    color: "#000",
    fontFamily: FontFamily.Montserrat_Regular,
  },
});
