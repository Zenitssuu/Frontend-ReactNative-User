import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Color } from "../../constants/GlobalStyles";
import Modal from "react-native-modal";
import { getSavedDoctors } from "../../utils/storage";

export const BehalfUserSelector = ({ profile, onSubmit, onCancel, loading }) => {
  const behalfUsers = profile?.behalfUsers || [];
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    (async () => {
      const docs = await getSavedDoctors();
      setDoctors(docs);
    })();
  }, []);

  const handleSelectUser = user => {
    // Calculate age from date of birth
    const birthDate = new Date(user.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const formData = {
      name: `${user.firstName} ${user.middleName || ""} ${user.lastName}`.trim(),
      birthdate: new Date(user.dateOfBirth).toLocaleDateString("en-GB"),
      gender: user.gender,
      relation: user.relationship,
      age: age,
      behalfUserId: user._id,
    };
    onSubmit(formData);
  };

  const handleAddNew = formData => {
    onSubmit(formData);
  };

  const renderBehalfUser = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleSelectUser(item)}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitials}>
            {item.firstName?.charAt(0)}
            {item.lastName?.charAt(0)}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {item.firstName} {item.middleName || ""} {item.lastName}
          </Text>
          <Text style={styles.userMeta}>
            {item.relationship} • {item.gender} •{" "}
            {new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear()} years
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={Color.headingColor} />
    </TouchableOpacity>
  );

  const renderDoctor = ({ item }) => (
    <View style={styles.doctorCard}>
      {item.photo ? (
        <View style={styles.doctorAvatarWrapper}>
          <Icon name="person" size={32} color="#fff" style={styles.doctorAvatarFallback} />
          <Image source={{ uri: item.photo }} style={styles.doctorAvatar} />
        </View>
      ) : (
        <View style={styles.doctorAvatarFallback}>
          <Icon name="person" size={32} color="#fff" />
        </View>
      )}
      <Text style={styles.doctorName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.doctorSpecialty} numberOfLines={1}>
        {item.specialty}
      </Text>
    </View>
  );

  if (showForm) {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <OtherDetailsForm
            onSubmit={handleAddNew}
            onCancel={() => setShowForm(false)}
            showBackButton={true}
            onBack={() => setShowForm(false)}
            loading={loading}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Row: Back Button (left) and New Button (right) */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButtonSmall} onPress={onCancel}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Color.headingColor} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.newButtonSmall} onPress={() => setShowForm(true)}>
          <MaterialCommunityIcons name="plus-circle" size={20} color={Color.headingColor} />
          <Text style={styles.newButtonTextSmall}>New</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Select Person</Text>
      <FlatList
        data={behalfUsers}
        renderItem={renderBehalfUser}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          behalfUsers.length > 0 ? (
            <Text style={styles.subtitle}>Saved Profiles</Text>
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="account-plus" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No saved profiles yet</Text>
              <Text style={styles.emptyStateSubtext}>Add a new person to get started</Text>
            </View>
          )
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export const OtherDetailsForm = ({ onSubmit, onCancel, showBackButton, onBack, loading }) => {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "",
    relation: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempAnswer, setTempAnswer] = useState(null);

  // Minor consent state
  const [isMinor, setIsMinor] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);

  const [modalitemsrelation] = useState([
    { id: "1", label: "Parents" },
    { id: "2", label: "Family" },
    { id: "3", label: "Friends" },
    { id: "4", label: "Other" },
  ]);

  const handleModal = value => {
    setTempAnswer(value);
    setModalVisible(true);
  };

  const handleModalHide = () => {
    setTempAnswer(null);
  };

  const toggleSelectionrelation = item => {
    handleChange("relation", item.label);
    setModalVisible(false);
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Form validation
  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter name");
      return false;
    }
    if (!form.birthdate) {
      Alert.alert("Error", "Please select birthdate");
      return false;
    }
    if (!form.gender) {
      Alert.alert("Error", "Please select gender");
      return false;
    }
    if (!form.relation.trim()) {
      Alert.alert("Error", "Please select relation");
      return false;
    }
    if (isMinor && !parentalConsent) {
      Alert.alert("Parental Consent Required", "Please provide parental consent for treatment of a minor.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formDataWithConsent = {
        ...form,
        ...(isMinor && { parentalConsent: parentalConsent }),
      };
      onSubmit(formDataWithConsent);
    }
  };

  // Format to dd/mm/yyyy
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function parseFormattedDate(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set") {
      const formattedDate = formatDate(selectedDate);
      handleChange("birthdate", formattedDate);
      
      // Check if the selected date makes the person a minor (under 18)
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();
      
      // Calculate exact age
      let exactAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        exactAge--;
      }
      
      const isUnder18 = exactAge < 18;
      setIsMinor(isUnder18);
      
      // Reset parental consent when age changes
      if (!isUnder18) {
        setParentalConsent(false);
      }
    }
  };

  return (
    <View style={formStyles.container}>
      {showBackButton && (
        <TouchableOpacity style={formStyles.backButton} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Color.headingColor} />
          <Text style={formStyles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}

      <Text style={formStyles.title}>Other Person's Details</Text>

      <TextInput
        placeholder="Enter name"
        placeholderTextColor="#A0B3C4"
        style={formStyles.input}
        value={form.name}
        onChangeText={value => handleChange("name", value)}
      />

      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={[formStyles.input, { flexDirection: "row", justifyContent: "space-between" }]}
      >
        <Text style={{ color: form.birthdate ? "#2E3A59" : "#A0B3C4" }}>
          {form.birthdate ? form.birthdate : "Select birthdate"}
        </Text>
        <Icon style={{ color: Color.headingColor }} name="calendar-today" size={22} color="#666" />
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={form.birthdate ? parseFormattedDate(form.birthdate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Relation Dropdown */}
      <Pressable
        style={formStyles.input}
        onPress={() => handleModal("relation")}
        disabled={loading}
      >
        <Text style={{ color: form.relation ? "#2E3A59" : "#A0B3C4" }}>
          {form.relation ? form.relation : "Select relation"}
        </Text>
      </Pressable>

      {/* Gender radio group */}
      <Text style={formStyles.label}>Gender</Text>
      <View style={formStyles.radioGroup}>
        {["Male", "Female", "Trans"].map(option => (
          <Pressable
            key={option}
            style={[formStyles.radioButton, form.gender === option && formStyles.radioSelected]}
            onPress={() => handleChange("gender", option)}
          >
            <Text style={[formStyles.radioLabel, form.gender === option && { color: "#fff" }]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Parental Consent for Minors */}
      {isMinor && (
        <View style={formStyles.consentSection}>
          <Text style={formStyles.label}>Parental Consent</Text>
          <TouchableOpacity
            style={formStyles.consentContainer}
            onPress={() => setParentalConsent(!parentalConsent)}
            disabled={loading}
          >
            <View style={[formStyles.checkbox, parentalConsent && formStyles.checkedBox]}>
              {parentalConsent && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={formStyles.consentText}>
              I, as the parent/guardian, give consent for the medical treatment of this minor.
            </Text>
          </TouchableOpacity>
          {isMinor && (
            <Text style={formStyles.minorNotice}>
              * This person is under 18 years of age and requires parental consent for treatment.
            </Text>
          )}
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable style={formStyles.cancelButton} onPress={onCancel} disabled={loading}>
          <Text style={formStyles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[formStyles.submitButton, loading && formStyles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={formStyles.buttonText}>{loading ? "Processing..." : "Proceed"}</Text>
        </Pressable>
      </View>

      {/* Relation Modal */}
      <Modal
        isVisible={isModalVisible}
        swipeDirection="down"
        transparent={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onSwipeComplete={() => setModalVisible(false)}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={false}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        onModalHide={handleModalHide}
        style={formStyles.modal}
      >
        {tempAnswer === "relation" && (
          <View style={formStyles.modalView}>
            <View style={formStyles.handle} />
            <View style={formStyles.modalCloseButton}>
              <Text style={formStyles.modalTitle}>
                Relation{" "}
                <Text style={[formStyles.modalTitle, { fontWeight: "regular" }]}>
                  {form.relation ? `- ${form.relation}` : ""}
                </Text>
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={formStyles.closeicon}>
                <MaterialCommunityIcons name="close" size={25} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalitemsrelation}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSelectionrelation(item)}
                  style={[formStyles.item, form.relation === item.label && formStyles.selectedItem]}
                >
                  <Text
                    style={[
                      formStyles.itemText,
                      form.relation === item.label && formStyles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
    minHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2E3A59",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2E3A59",
    textAlign: "center",
  },
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  choiceButton: {
    flex: 1,
    backgroundColor: "#F8F9FF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E7FF",
    minHeight: 140,
    justifyContent: "center",
  },
  choiceButtonDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginTop: 12,
    textAlign: "center",
  },
  choiceButtonTextDisabled: {
    color: "#999",
  },
  choiceButtonSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  headerWithBack: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.headingColor,
    marginLeft: 8,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  footerContainer: {
    marginTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Color.headingColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitials: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14,
    color: "#666",
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Color.headingColor,
    borderStyle: "dashed",
  },
  addNewText: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.headingColor,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#E4EAF1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  doctorList: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  doctorCard: {
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    width: 120,
  },
  doctorAvatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Color.headingColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    position: "relative",
  },
  doctorAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  doctorAvatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: Color.headingColor,
    justifyContent: "center",
    alignItems: "center",
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E3A59",
    textAlign: "center",
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: Color.headingColor,
    borderStyle: "dashed",
  },
  newButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.headingColor,
    marginLeft: 8,
  },
  backButtonSmall: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
  },
  newButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: Color.headingColor,
    borderStyle: "dashed",
  },
  newButtonTextSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: Color.headingColor,
    marginLeft: 6,
  },
});

const formStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.headingColor,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#2E3A59",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#5E6C84",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DCE3E8",
    backgroundColor: "#F9FBFC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    color: "#2E3A59",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#E4EAF1",
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: "#50A3C8",
  },
  radioLabel: {
    color: "#2E3A59",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#50A3C8",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  cancelButton: {
    backgroundColor: "#E4EAF1",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    overflow: "hidden",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    maxHeight: "70%",
    minHeight: 400,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalCloseButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    width: "90%",
    color: "#333",
  },
  closeicon: {
    position: "absolute",
    right: 0,
    top: -10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 5,
  },
  selectedItem: {
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    borderColor: "#50A3C8",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#2E3A59",
  },
  selectedItemText: {
    fontWeight: "bold",
    color: "#50A3C8",
  },
  // Parental consent styles
  consentSection: {
    marginBottom: 16,
  },
  consentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#50A3C8",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: "#50A3C8",
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: "#2E3A59",
    lineHeight: 20,
  },
  minorNotice: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 8,
    fontStyle: "italic",
  },
});
