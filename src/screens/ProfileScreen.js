import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color, Color as COLORS } from "../constants/GlobalStyles";
import { getUserProfile } from "../utils/storage";
import { LoadingSpinner } from "../components/UIComponents";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import { handleApiMutation } from "../services/apiUtils";
import apiService from "../services/api";
import { deleteBehalfUser } from "../Redux/Slices/UserSlice";
import { LinearGradient } from "expo-linear-gradient";

// Behalf Person Card
const PersonInfoCard = ({ person, handleDelete }) => {
  const {
    firstName = "",
    middleName = "",
    lastName = "",
    gender,
    dateOfBirth,
    relationship,
  } = person;

  const fullName = [firstName, middleName, lastName].filter(e => e !== "").join(" ");

  return (
    <Surface style={OtherPersonStyles.card} key={person._id}>
      {/* <View style={{
        position: "absolute",
        top: 0, 
        right: 0
      }}>
        <MaterialCommunityIcons name="delete" color="#000" size={24} />
      </View> */}
      <View style={OtherPersonStyles.header}>
        <MaterialCommunityIcons
          name="account-circle"
          size={40}
          color={COLORS.headingColor}
          style={OtherPersonStyles.avatar}
        />
        <View>
          <Text style={OtherPersonStyles.name}>{fullName}</Text>
          <Text style={OtherPersonStyles.relation}>{relationship}</Text>
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "#ff70a2",
            borderRadius: 16,
            padding: 6,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
          }}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="delete" color="#fff" size={16} />
        </TouchableOpacity>
      </View>

      <View style={OtherPersonStyles.detailRow}>
        <MaterialCommunityIcons name="gender-male-female" size={20} color={COLORS.headingColor} />
        <Text style={OtherPersonStyles.detailText}>Gender: {gender}</Text>
      </View>

      <View style={OtherPersonStyles.detailRow}>
        <MaterialCommunityIcons name="cake-variant" size={20} color={COLORS.headingColor} />
        <Text style={OtherPersonStyles.detailText}>
          DOB: {new Date(dateOfBirth).toLocaleDateString()}
        </Text>
      </View>
    </Surface>
  );
};

const SectionCard = ({ title, icon, children, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Surface style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => setExpanded(!expanded)}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name={icon} size={22} color={COLORS.headingColor} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <Ionicons name="create-outline" size={22} color={COLORS.headingColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editBtn} onPress={() => setExpanded(prev => !prev)}>
            <MaterialCommunityIcons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={22}
              color={COLORS.headingColor}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </Surface>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { profile } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // delete other user logic
  const deleteOtherUser = async user => {
    try {
      setLoading(true);
      await handleApiMutation(apiService.profile.deleteBehalfUser, {
        args: [user._id],
        successMessage: "Profile deleted successfully",
        onSuccess: response => {
          dispatch(deleteBehalfUser(user._id));
        },
      });
    } catch (error) {
      console.log(error);
      // Alert.alert("User Creation Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[COLORS.lightBlue, COLORS.lightBlue + "E0", COLORS.lightBlue + "B0"]}
          style={styles.gradientBackground}
        >
          {/* Back Button */}
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.headingColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerRight} />
          </View>
          <View style={styles.profileCard}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileCircle}>
                  {profile?.profileImage ? (
                    <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileInitialContainer}>
                      <Text style={styles.profileInitial}>
                        {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "U"}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.middleName ? profile.middleName + " " : ""}${profile.lastName}`
                    : profile.firstName
                      ? `${profile.firstName}`
                      : "User"}
                </Text>
                {profile.email && <Text style={styles.profileEmail}>{profile.email}</Text>}
                <View style={styles.profileStats}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="account-multiple"
                      size={16}
                      color={COLORS.headingColor}
                    />
                    <Text style={styles.statText}>{profile?.behalfUsers?.length || 0} Others</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
                    <Text style={styles.statText}>Verified</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* PERSONAL DETAILS */}
        <SectionCard
          title="Personal Details"
          icon="account-details"
          onEdit={() =>
            // navigation.navigate("EditProfile", { section: "personal" })
            navigation.navigate("PersonalInfo_Profile")
          }
        >
          <Field
            label="Name"
            value={
              profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.middleName} ${profile.lastName}`
                : "-"
            }
          />
          <Field label="Gender" value={profile.gender || "-"} />
          <Field
            label="Date of Birth"
            value={new Date(profile.dateOfBirth).toLocaleDateString() || "-"}
          />
          <Field label="Marital Status" value={profile.maritalStatus || "-"} />
          <Field label="Blood Group" value={profile.bloodGroup || "-"} />

          <Text style={styles.subsectionTitle}>Place of Birth</Text>
          <Field label="Place" value={profile?.placeOfBirth?.place || "-"} />
          <Field label="State" value={profile?.placeOfBirth?.state || "-"} />
          <Field label="District" value={profile?.placeOfBirth?.district || "-"} />
          <Field label="PinCode" value={profile?.placeOfBirth?.pincode || "-"} />

          <Text style={styles.subsectionTitle}>Indian Languages</Text>
          <Field
            label="Understand"
            value={
              profile?.UnderstandIndianLanguages?.length > 0
                ? profile?.UnderstandIndianLanguages?.join(",")
                : "-"
            }
          />
          <Field
            label="Speak"
            value={
              profile?.SpeakIndianLanguages?.length > 0
                ? profile?.SpeakIndianLanguages?.join(", ")
                : "-"
            }
          />
          <Field
            label="Read/Write"
            value={
              profile?.ReadWriteIndianLanguages?.length > 0
                ? profile?.ReadWriteIndianLanguages?.join(", ")
                : "-"
            }
          />
        </SectionCard>

        {/* MAILING ADDRESS */}
        <SectionCard
          title="Mailing Address"
          icon="home-map-marker"
          onEdit={() => navigation.navigate("Address_Profile")}
        >
          <Text style={styles.subsectionTitle}>Current Address</Text>
          <Field
            label="Location"
            value={
              profile?.currentAddress?.addressLine1
                ? `${profile?.currentAddress?.addressLine1}, ${profile?.currentAddress?.addressLine2}`
                : "-"
            }
          />
          <Field label="Post Office" value={profile?.currentAddress?.postOffice || "-"} />
          <Field label="State" value={profile?.currentAddress?.state || "-"} />
          <Field label="District" value={profile?.currentAddress?.district || "-"} />
          <Field label="PinCode" value={profile?.currentAddress?.pincode || "-"} />

          <Text style={styles.subsectionTitle}>Permanent Address</Text>
          {profile.isPermanentAddressSame ? (
            <>
              <Field
                label="Location"
                value={
                  profile?.currentAddress?.addressLine1
                    ? `${profile?.currentAddress?.addressLine1}, ${profile?.currentAddress?.addressLine2}`
                    : "-"
                }
              />
              <Field label="Post Office" value={profile?.currentAddress?.postOffice || "-"} />
              <Field label="State" value={profile?.currentAddress?.state || "-"} />
              <Field label="District" value={profile?.currentAddress?.district || "-"} />
              <Field label="PinCode" value={profile?.currentAddress?.pincode || "-"} />
            </>
          ) : (
            <>
              <Field
                label="Location"
                value={
                  profile?.permanentAddress?.addressLine1
                    ? `${profile?.permanentAddress?.addressLine1}, ${profile?.permanentAddress?.addressLine2}`
                    : "-"
                }
              />
              <Field label="Post Office" value={profile?.permanentAddress?.postOffice || "-"} />
              <Field label="State" value={profile?.permanentAddress?.state || "-"} />
              <Field label="District" value={profile?.permanentAddress?.district || "-"} />
              <Field label="PinCode" value={profile?.permanentAddress?.pincode || "-"} />
            </>
          )}
        </SectionCard>

        {/* CONTACT DETAILS */}
        <SectionCard
          title="Contact Details"
          icon="phone"
          onEdit={() => navigation.navigate("Profile_Contact")}
        >
          <Field label="Primary" value={profile?.phoneNumber || "-"} />
          <Field label="Alternate" value={profile?.contactDetails?.alternatePhoneNumber || "-"} />
          <Field label="WhatsApp" value={profile?.contactDetails?.whatsappNumber || "-"} />
          <Field label="Email" value={profile?.email || "-"} />

          <Text style={styles.subsectionTitle}>Emergency Contact 1</Text>
          <Field
            label="Contact Name"
            value={profile?.contactDetails?.emergencyContact?.[0]?.name || "-"}
          />
          <Field
            label="Relation"
            value={profile?.contactDetails?.emergencyContact?.[0]?.relation || "-"}
          />
          <Field
            label="Email"
            value={profile?.contactDetails?.emergencyContact?.[0]?.email || "-"}
          />
          <Field
            label="Phone Number"
            value={profile?.contactDetails?.emergencyContact?.[0]?.phoneNumber || "-"}
          />

          <Text style={styles.subsectionTitle}>Emergency Contact 2</Text>
          <Field
            label="Contact Name"
            value={profile?.contactDetails?.emergencyContact?.[1]?.name || "-"}
          />
          <Field
            label="Relation"
            value={profile?.contactDetails?.emergencyContact?.[1]?.relation || "-"}
          />
          <Field
            label="Email"
            value={profile?.contactDetails?.emergencyContact?.[1]?.email || "-"}
          />
          <Field
            label="Phone Number"
            value={profile?.contactDetails?.emergencyContact?.[1]?.phoneNumber || "-"}
          />
        </SectionCard>

        {/* Behalf User */}
        <View style={{ marginBottom: 8 }}>
          {profile?.behalfUsers?.length > 0 && (
            <Text
              style={[
                styles.sectionTitle,
                {
                  marginVertical: 10,
                  fontSize: 18,
                  fontWeight: "600",
                  color: COLORS.headingColor,
                  textAlign: "center",
                },
              ]}
            >
              Other Users
            </Text>
          )}

          {profile?.behalfUsers?.map(otherUser => (
            <PersonInfoCard
              person={otherUser}
              key={otherUser._id}
              handleDelete={() => deleteOtherUser(otherUser)}
            />
          ))}

          <Surface style={styles.card}>
            <TouchableOpacity
              style={[styles.cardHeader, { backgroundColor: COLORS.lightBlue + "15" }]}
              onPress={() => navigation.navigate("CreateOtherProfile")}
            >
              <View style={[styles.otherUserBtn, { paddingVertical: 12 }]}>
                <View
                  style={{
                    backgroundColor: COLORS.headingColor,
                    borderRadius: 20,
                    padding: 8,
                    marginRight: 8,
                  }}
                >
                  <Feather name="user-plus" color={COLORS.white} size={20} />
                </View>
                <Text style={styles.otherUserBtnTxt}>Add Other Users</Text>
              </View>
            </TouchableOpacity>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Field = ({ label, value }) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || "Not set"}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    backgroundColor: COLORS.lightBlue,
    paddingBottom: 0,
  },
  gradientBackground: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.headingColor,
    textAlign: "center",
  },
  headerRight: {
    width: 44, // Same width as back button to center the title
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: COLORS.border + "20",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 20,
  },
  profileCircle: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.headingColor,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  profileInitialContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.headingColor + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: COLORS.headingColor,
    fontSize: 32,
    fontWeight: "700",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: COLORS.lightBlue + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
    marginLeft: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    elevation: 3,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.headerBg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  editBtn: {
    marginRight: 6,
    borderRadius: 6,
    padding: 6,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionContent: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + "20",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.text,
    textAlign: "right",
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 10,
    color: COLORS.headingColor,
    paddingLeft: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.headingColor,
  },
  otherUserBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.colorWhite,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  otherUserBtnTxt: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.headingColor,
  },
});

const OtherPersonStyles = StyleSheet.create({
  card: {
    backgroundColor: Color.colorWhite,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: Color.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: COLORS.border + "15",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  avatar: {
    marginRight: 12,
    backgroundColor: COLORS.lightBlue + "25",
    borderRadius: 20,
    padding: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.headingColor,
    marginBottom: 2,
  },
  relation: {
    fontSize: 14,
    color: COLORS.colorBlack,
    fontWeight: "500",
    backgroundColor: COLORS.lightBlue + "30",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "400",
  },
});

export default ProfileScreen;
