import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Color as COLORS } from "../constants/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUser } from "../Redux/Slices/UserSlice";

const CustomDrawerContent = ({ navigation }) => {
  const { profile } = useSelector(state => state.user) || {};
  const dispatch = useDispatch();

  // Dummy data fallback
  const isProfileEmpty = !profile || Object.keys(profile).length === 0;
  const displayProfile = !isProfileEmpty
    ? profile
    : {
        firstName: "John",
        lastName: "Doe",
        profileImage:
          "https://me-app-tellyoudoc.s3.ap-south-1.amazonaws.com/doctor/685d0510e481bf23798fc239/profile/9a168173-8926-4522-8560-5e690769aa2d.jpg",
        email: "john.doe@example.com",
      };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear tokens from AsyncStorage
            await AsyncStorage.multiRemove(["AccessToken", "RefreshToken", "AsUser"]);

            // Clear user data from Redux store
            dispatch(clearUser());

            // Navigate to Login screen
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 1,
      title: "Profile",
      icon: "account-circle-outline",
      route: "Profile",
      color: COLORS.primary,
    },
    {
      id: 2,
      title: "Settings",
      icon: "cog-outline",
      route: "Settings",
      color: COLORS.primary,
    },
  ];

  const supportItems = [
    {
      id: 3,
      title: "Manual",
      icon: "book-open-outline",
      route: "Manual",
      color: "#FF6B35",
    },
    {
      id: 4,
      title: "FAQ",
      icon: "help-circle-outline",
      route: "FAQ",
      color: "#4ECDC4",
    },
    {
      id: 5,
      title: "Support",
      icon: "headset",
      route: "Support",
      color: "#45B7D1",
    },
    {
      id: 6,
      title: "Feedback",
      icon: "message-text-outline",
      route: "Feedback",
      color: "#96CEB4",
    },
  ];

  const legalItems = [
    {
      id: 7,
      title: "Privacy Policy",
      icon: "shield-account-outline",
      route: "PrivacyPolicy",
      color: "#FFEAA7",
    },
    {
      id: 8,
      title: "Terms & Conditions",
      icon: "file-document-outline",
      route: "TermsConditions",
      color: "#DDA0DD",
    },
    {
      id: 9,
      title: "About Us",
      icon: "information-outline",
      route: "AboutUs",
      color: "#74B9FF",
    },
  ];

  const renderMenuItem = (item, showDivider = false) => (
    <View key={item.id}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate(item.route)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <MaterialCommunityIcons name={item.icon} size={18} color={item.color} />
        </View>
        <Text style={styles.menuText}>{item.title}</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={16}
          color={COLORS.textSecondary || "#999"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Pressable style={styles.profileSection} onPress={() => navigation.navigate("Profile")}>
          <View style={styles.profileImageContainer}>
            {displayProfile.profileImage ? (
              <Image source={{ uri: displayProfile.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileIconPlaceholder}>
                <Text style={styles.profileIconText}>
                  {displayProfile.firstName?.charAt(0) || "U"}
                </Text>
              </View>
            )}
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {displayProfile.firstName} {displayProfile.lastName}
            </Text>
            <Text style={styles.profileEmail}>{displayProfile.email}</Text>
          </View>
        </Pressable>

        {/* Main Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map(item => renderMenuItem(item))}
        </View>

        {/* Support & Help Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          {supportItems.map(item => renderMenuItem(item))}
        </View>

        {/* Legal & Information Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Legal & Information</Text>
          {legalItems.map(item => renderMenuItem(item))}
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <View style={styles.logoutIconContainer}>
              <MaterialCommunityIcons name="logout" size={18} color={COLORS.error || "#FF6B6B"} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>TellYouDoc v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 20,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderRadius: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary || "#0077B6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileIconText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.headingColor || "#2C3E50",
    marginBottom: 4,
    lineHeight: 24,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.textSecondary || "#7F8C8D",
    opacity: 0.9,
    fontWeight: "500",
    lineHeight: 16,
  },
  menuSection: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary || "#7F8C8D",
    marginBottom: 8,
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 3,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.headingColor || "#2C3E50",
  },
  logoutSection: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  logoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.error || "#FF6B6B",
  },
  versionSection: {
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 10,
    color: COLORS.textSecondary || "#BDC3C7",
    fontWeight: "500",
  },
});
