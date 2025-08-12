import React, { useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Color } from "../../constants/GlobalStyles";

const DatePickerInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);
  const [dateValue, setDateValue] = useState(value ? new Date(value) : new Date());
  const [showVal, setShowVal] = useState(value ? value : null);
  // const dateValue = value ? new Date(value) : new Date();

  function parseDate(dateStr) {
    const parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  // Format to dd/mm/yyyy
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onChange(formattedDate, formattedDate);
      setShowVal(formattedDate);
      setDateValue(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShow(true)} activeOpacity={0.8}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Select date"
            value={showVal}
            editable={false}
            pointerEvents="none"
          />
          <Icon
            style={{ color: Color.headingColor }}
            name="calendar-today"
            size={22}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      {show && (
        <DateTimePicker value={dateValue} mode="date" display="default" onChange={handleChange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width: 270,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default DatePickerInput;
