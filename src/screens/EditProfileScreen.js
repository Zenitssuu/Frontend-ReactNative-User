import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getUserProfile } from "../utils/storage";
import { LoadingSpinner } from "../components/UIComponents";
import { Color as COLORS } from "../constants/GlobalStyles";
import { Header } from "@rneui/base";
import { LinearGradient } from "expo-linear-gradient";

const SectionCard = ({ title, children }) => (
  <Surface style={styles.card}>
    <View style={styles.cardContent}>{children}</View>
  </Surface>
);

const InputField = ({ label, value, onChange, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value || ""}
      onChangeText={onChange}
      placeholder={`Enter ${label}`}
      placeholderTextColor={COLORS.textLighter}
      keyboardType={keyboardType || "default"}
    />
  </View>
);

const EditProfileScreen = ({ route, navigation }) => {
  const { section } = route.params;
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data || {});
        const titleMap = {
          personal: "Edit Personal Details",
          mailing: "Edit Mailing Address",
          contact: "Edit Contact Details",
        };
        navigation.setOptions({
          title: titleMap[section] || "Edit Profile",
        });
      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const renderFields = () => (
    <>
      {section === "personal" && (
        <>
          <SectionCard title="Name">
            <InputField
              label="First Name"
              value={profile.firstName}
              onChange={val => handleChange("firstName", val)}
            />
            <InputField
              label="Last Name"
              value={profile.lastName}
              onChange={val => handleChange("lastName", val)}
            />
          </SectionCard>
          <SectionCard title="Gender">
            <InputField
              label="Gender"
              value={profile.gender}
              onChange={val => handleChange("gender", val)}
            />
          </SectionCard>
          <SectionCard title="Date of Birth">
            <InputField
              label="Date of Birth"
              value={profile.dob}
              onChange={val => handleChange("dob", val)}
            />
          </SectionCard>
          <SectionCard title="Place of Birth">
            <InputField
              label="Place"
              value={profile.birthPlace}
              onChange={val => handleChange("birthPlace", val)}
            />
            <InputField
              label="PinCode"
              value={profile.birthPinCode}
              onChange={val => handleChange("birthPinCode", val)}
              keyboardType="numeric"
            />
            <InputField
              label="State"
              value={profile.birthState}
              onChange={val => handleChange("birthState", val)}
            />
            <InputField
              label="District"
              value={profile.birthDistrict}
              onChange={val => handleChange("birthDistrict", val)}
            />
          </SectionCard>
          <SectionCard title="Marital Status">
            <InputField
              label="Marital Status"
              value={profile.maritalStatus}
              onChange={val => handleChange("maritalStatus", val)}
            />
          </SectionCard>
          <SectionCard title="Blood Group">
            <InputField
              label="Blood Group"
              value={profile.bloodGroup}
              onChange={val => handleChange("bloodGroup", val)}
            />
          </SectionCard>
          <SectionCard title="Indian Languages">
            <InputField
              label="Understand"
              value={profile.langUnderstand}
              onChange={val => handleChange("langUnderstand", val)}
            />
            <InputField
              label="Speak"
              value={profile.langSpeak}
              onChange={val => handleChange("langSpeak", val)}
            />
            <InputField
              label="Read/Write"
              value={profile.langReadWrite}
              onChange={val => handleChange("langReadWrite", val)}
            />
          </SectionCard>
        </>
      )}

      {section === "contact" && (
        <>
          <SectionCard title="Contact Details">
            <Text style={styles.sectionTitle}>Primary Contact</Text>
            <InputField
              label="Contact Number"
              value={profile.phone}
              onChange={val => handleChange("phone", val)}
              keyboardType="phone-pad"
            />
            <InputField
              label="Alternate Number"
              value={profile.alternatePhone}
              onChange={val => handleChange("alternatePhone", val)}
              keyboardType="phone-pad"
            />
            <InputField
              label="WhatsApp Number"
              value={profile.whatsapp}
              onChange={val => handleChange("whatsapp", val)}
              keyboardType="phone-pad"
            />
            <InputField
              label="Email"
              value={profile.email}
              onChange={val => handleChange("email", val)}
              keyboardType="email-address"
            />
          </SectionCard>
          <SectionCard title="Emergency Contact">
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <InputField
              label="Name"
              value={profile.emergencyName}
              onChange={val => handleChange("emergencyName", val)}
            />
            <InputField
              label="Relation"
              value={profile.emergencyRelation}
              onChange={val => handleChange("emergencyRelation", val)}
            />
            <InputField
              label="Contact Number"
              value={profile.emergencyPhone}
              onChange={val => handleChange("emergencyPhone", val)}
              keyboardType="phone-pad"
            />
            <InputField
              label="Email"
              value={profile.emergencyEmail}
              onChange={val => handleChange("emergencyEmail", val)}
              keyboardType="email-address"
            />
          </SectionCard>
        </>
      )}

      {section === "mailing" && (
        <>
          <SectionCard title="Present Address">
            <Text style={styles.sectionTitle}>Present Address</Text>
            <InputField
              label="Location"
              value={profile.currLocation}
              onChange={val => handleChange("currLocation", val)}
            />
            <InputField
              label="PinCode"
              value={profile.currPinCode}
              onChange={val => handleChange("currPinCode", val)}
              keyboardType="numeric"
            />
            <InputField
              label="State"
              value={profile.currState}
              onChange={val => handleChange("currState", val)}
            />
            <InputField
              label="District"
              value={profile.currDistrict}
              onChange={val => handleChange("currDistrict", val)}
            />
            <InputField
              label="Post Office"
              value={profile.currPostOffice}
              onChange={val => handleChange("currPostOffice", val)}
            />
          </SectionCard>
          <SectionCard title="Permanent Address">
            <Text style={styles.sectionTitle}>Permanent Address</Text>
            <InputField
              label="Location"
              value={profile.permLocation}
              onChange={val => handleChange("permLocation", val)}
            />
            <InputField
              label="PinCode"
              value={profile.permPinCode}
              onChange={val => handleChange("permPinCode", val)}
              keyboardType="numeric"
            />
            <InputField
              label="State"
              value={profile.permState}
              onChange={val => handleChange("permState", val)}
            />
            <InputField
              label="District"
              value={profile.permDistrict}
              onChange={val => handleChange("permDistrict", val)}
            />
            <InputField
              label="Post Office"
              value={profile.permPostOffice}
              onChange={val => handleChange("permPostOffice", val)}
            />
          </SectionCard>
        </>
      )}
    </>
  );

  const renderHeader = () => (
    <>
      {/* Custom Header */}
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text:
            section === "personal"
              ? "Personal"
              : section === "mailing"
                ? "Mailing Address"
                : "Contact",
          style: {
            color: "#fff",
            fontSize: 18,
            alignItems: "center",
            justifyContent: "center",
          },
        }}
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

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <>
      {renderHeader()}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {renderFields()}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialCommunityIcons name="check" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  cardContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.headingColor,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default EditProfileScreen;
