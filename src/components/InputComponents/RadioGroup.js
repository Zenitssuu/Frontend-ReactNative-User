import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from "react-native";
import { Color } from "../../constants/GlobalStyles";

const RadioGroup = ({ options, value, onChange }) => {
  const [otherText, setOtherText] = useState("");

  const handleOptionSelect = selectedValue => {
    const selectedOption = options.find(opt => opt.value === selectedValue);
    const label = selectedOption ? selectedOption.label : selectedValue;

    if (selectedValue !== "Others") {
      setOtherText("");
      onChange(selectedValue, label);
    } else {
      onChange(otherText || "Others", "Others");
    }
  };

  const handleOtherTextChange = text => {
    setOtherText(text);
    onChange(text, "Others");
  };

  return options.map(opt => (
    <React.Fragment key={opt.value}>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          onPress={() => handleOptionSelect(opt.value)}
          style={styles.container}
          activeOpacity={0.7}
        >
          <View style={styles.radioOuter}>
            {(value === opt.value || (opt.value === "Others" && value === otherText)) && (
              <View style={styles.radioInner} />
            )}
          </View>
          <Text style={styles.optionText}>{opt.label}</Text>
        </TouchableOpacity>
      </View>

      {opt.value === "Others" && (value === "Others" || value === otherText) && (
        <TextInput
          value={otherText}
          onChangeText={handleOtherTextChange}
          placeholder="Please specify..."
          style={styles.textInput}
        />
      )}
    </React.Fragment>
  ));
};

const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Color.headingColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Color.headingColor,
  },
  optionText: {
    fontSize: 16,
  },
  textInput: {
    borderColor: Color.headingColor,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
    fontSize: 16,
    marginTop: 10,
    width: "100%", // Takes full width of parent
  },
});

export default RadioGroup;
