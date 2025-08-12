import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from "react-native";
import { Color } from "../../constants/GlobalStyles";

const CheckboxGroup = ({ options, value = [], onChange }) => {
  const [otherText, setOtherText] = useState("");

  const ALL_OF_ABOVE_VALUE = "Whole day";
  const NONE_OF_ABOVE_VALUE = "Don't know";
  const FULL_HEAD = "Full head";

  // const toggle = (v) => {
  //   if (v === ALL_OF_ABOVE_VALUE) {
  //     if (value.includes(ALL_OF_ABOVE_VALUE)) {
  //       // Unselect 'All of the Above'
  //       onChange([]);
  //     } else {
  //       // Select only 'All of the Above'
  //       setOtherText("");
  //       onChange([ALL_OF_ABOVE_VALUE]);
  //     }
  //   } else {
  //     let updatedValue = [...value];
  //     // If 'All of the Above' was selected, deselect it
  //     if (updatedValue.includes(ALL_OF_ABOVE_VALUE)) {
  //       updatedValue = updatedValue.filter(
  //         (item) => item !== ALL_OF_ABOVE_VALUE
  //       );
  //     }

  //     if (updatedValue.includes(v)) {
  //       updatedValue = updatedValue.filter((item) => item !== v);
  //       // If 'Others' is deselected, clear its text too
  //       if (v === "Others") setOtherText("");
  //     } else {
  //       updatedValue.push(v);
  //     }

  //     const selectedLabels = options
  //       .filter((opt) => updatedValue.includes(opt.value))
  //       .map((opt) => opt.label)

  //     onChange(updatedValue, selectedLabels)

  //   }
  // };

  const toggle = v => {
    let updatedValue = [...value];

    if (v === ALL_OF_ABOVE_VALUE || v === NONE_OF_ABOVE_VALUE || v === FULL_HEAD) {
      if (
        updatedValue.includes(ALL_OF_ABOVE_VALUE) ||
        updatedValue.includes(NONE_OF_ABOVE_VALUE) ||
        updatedValue.includes(FULL_HEAD)
      ) {
        // Unselect 'All of the Above'
        updatedValue = [];
      } else {
        // Select only 'All of the Above'
        setOtherText("");
        // if (v === ALL_OF_ABOVE_VALUE) updatedValue = [ALL_OF_ABOVE_VALUE]
        // else if
        // updatedValue = [
        //   v === ALL_OF_ABOVE_VALUE ? ALL_OF_ABOVE_VALUE : NONE_OF_ABOVE_VALUE,
        // ];
        updatedValue = [v];
      }
    } else {
      // Remove 'All of the Above' if something else is selected
      if (
        updatedValue.includes(ALL_OF_ABOVE_VALUE) ||
        updatedValue.includes(NONE_OF_ABOVE_VALUE) ||
        updatedValue.includes(FULL_HEAD)
      ) {
        updatedValue = updatedValue.filter(
          item => item !== ALL_OF_ABOVE_VALUE && item !== NONE_OF_ABOVE_VALUE && item !== FULL_HEAD
        );
      }

      if (updatedValue.includes(v)) {
        // Deselect the option
        updatedValue = updatedValue.filter(item => item !== v);
        if (v === "Others") setOtherText(""); // Reset text if 'Others' removed
      } else {
        updatedValue.push(v); // Select new option
      }
    }

    // Find corresponding labels for selected values
    const selectedLabels = options
      .filter(opt => updatedValue.includes(opt.value))
      .map(opt => opt.label);

    onChange(updatedValue, selectedLabels);
  };

  const handleOtherTextChange = text => {
    setOtherText(text);
  };

  return options.map(opt => (
    <View key={opt.id || opt.value} style={styles.optionContainer}>
      <TouchableOpacity
        onPress={() => toggle(opt.value)}
        style={styles.container}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxOuter}>
          {value.includes(opt.value) && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.optionText}>{opt.label}</Text>
      </TouchableOpacity>

      {/* Show input when 'Others' is selected */}
      {opt.value === "Others" && value.includes("Others") && (
        <View style={{ alignSelf: "stretch" }}>
          <TextInput
            value={otherText}
            onChangeText={handleOtherTextChange}
            placeholder="Please specify..."
            style={styles.textInput}
          />
        </View>
      )}
    </View>
  ));
};

const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 6,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxOuter: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Color.headingColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxInner: {
    height: 12,
    width: 12,
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
    width: "100%",
  },
});

export default CheckboxGroup;
