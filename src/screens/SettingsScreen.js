import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../components/UIComponents";
import { Color as COLORS, SIZES, FONTS, SHADOWS } from "../constants/GlobalStyles";
import apiService from "../services/api";
import { handleApiMutation } from "../services/apiUtils";
import {
  registerDeviceForNotifications,
  unregisterDeviceFromNotifications,
} from "../services/deviceRegistration";

const SettingsScreen = ({ navigation }) => {
  const { profile } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      appointmentReminders: true,
      healthTips: false,
      marketingEmails: false,
    },
    privacy: {
      shareDataForResearch: false,
      allowAnalytics: true,
      biometricAuth: false,
    },
    preferences: {
      darkMode: false,
      language: "English",
      units: "Metric",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved settings from storage or API
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load settings from AsyncStorage or API
      // For now, using default settings
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout? You will need to login again to access your account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await handleApiMutation(apiService.auth.logout, {
                successMessage: "Logged out successfully",
                onSuccess: () => {
                  // Clear user data and navigate to login
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Welcome" }],
                  });
                },
              });
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "Are you absolutely sure? This will permanently delete your account and all associated data.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      setLoading(true);
                      // API call to delete account
                      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Welcome" }],
                      });
                    } catch (error) {
                      Alert.alert("Error", "Failed to delete account. Please contact support.");
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
    danger = false,
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, danger && styles.dangerItem]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, danger && styles.dangerIconContainer]}>
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={danger ? COLORS.error : COLORS.primary}
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textLighter} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const ToggleSwitch = ({ value, onValueChange }) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: COLORS.primary + "30" }}
      thumbColor={value ? COLORS.primary : COLORS.textLighter}
      ios_backgroundColor={COLORS.border}
    />
  );

  const handlePushNotificationToggle = async value => {
    updateSetting("notifications", "pushNotifications", value);
    try {
      if (value) {
        await registerDeviceForNotifications();
      } else {
        await unregisterDeviceFromNotifications();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update notification settings.");
      // Optionally revert the toggle if needed
      updateSetting("notifications", "pushNotifications", !value);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        onBackPress={() => navigation.goBack()}
        gradientColors={[COLORS.primary, COLORS.primary]}
      />

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <Surface style={styles.section}>
          <SectionHeader title="Notifications" icon="bell" />

          <SettingItem
            icon="bell-ring"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            showArrow={false}
            rightComponent={
              <ToggleSwitch
                value={settings.notifications.pushNotifications}
                onValueChange={handlePushNotificationToggle}
              />
            }
          />
        </Surface>

        {/* Support Section */}
        <Surface style={styles.section}>
          <SectionHeader title="Support" icon="help-circle" />

          <SettingItem
            icon="frequently-asked-questions"
            title="FAQ"
            subtitle="Frequently asked questions"
            onPress={() => {
              Alert.alert("FAQ", "FAQ section will be available soon.");
            }}
          />

          <SettingItem
            icon="message-text"
            title="Contact Support"
            subtitle="Get help from our support team"
            onPress={() => {
              Alert.alert("Contact Support", "Support chat will be available soon.");
            }}
          />

          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Rate us on the app store"
            onPress={() => {
              Alert.alert(
                "Rate App",
                "Thank you for your interest! This will redirect to the app store."
              );
            }}
          />

          <SettingItem
            icon="information"
            title="About"
            subtitle="App version and information"
            onPress={() => {
              Alert.alert(
                "About",
                "TellYouDoc Patient App\nVersion 1.0.0\n\nYour trusted healthcare companion."
              );
            }}
          />
        </Surface>

        {/* Account Actions Section */}
        <Surface style={styles.section}>
          <SectionHeader title="Account Actions" icon="account-cog" />

          <SettingItem
            icon="logout"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            danger={false}
          />

          <SettingItem
            icon="delete"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            danger={true}
            showArrow={false}
          />
        </Surface>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>TellYouDoc Patient App</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 TellYouDoc. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    ...SHADOWS.level1,
    backgroundColor: COLORS.white,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: SIZES.body1,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },

  dangerItem: {
    backgroundColor: "#FFF5F5",
  },

  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  dangerIconContainer: {
    backgroundColor: "#FFE5E5",
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: SIZES.body1,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 2,
  },

  dangerText: {
    color: COLORS.error,
  },

  settingSubtitle: {
    fontSize: SIZES.body3,
    color: COLORS.textLight,
    lineHeight: 16,
  },

  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  appInfo: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },

  appInfoText: {
    fontSize: SIZES.body1,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },

  versionText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    marginBottom: 8,
  },

  copyrightText: {
    fontSize: SIZES.body3,
    color: COLORS.textLighter,
    textAlign: "center",
  },
});

export default SettingsScreen;
