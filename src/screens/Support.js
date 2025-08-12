import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize, SHADOWS } from "../constants/GlobalStyles";
import { Header, PrimaryButton } from "../components/UIComponents";

const Support = ({ navigation }) => {
  const openPhone = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  const openWebsite = () => {
    Linking.openURL("https://www.tellyoudoc.com/support");
  };

  const openChat = () => {
    Alert.alert(
      "Live Chat",
      "Our live chat feature will be available soon. For immediate assistance, please call our support line.",
      [{ text: "OK" }]
    );
  };

  const renderContactOption = (title, subtitle, icon, onPress, color = COLORS.primary) => (
    <TouchableOpacity style={styles.contactOption} onPress={onPress}>
      <View style={[styles.contactIcon, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textLighter} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Support & Help"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={48}
            color={COLORS.headingColor}
          />
          <Text style={styles.headerTitle}>How can we help you?</Text>
          <Text style={styles.headerSubtitle}>
            Find answers to common questions or contact our support team
          </Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <Surface style={styles.contactCard}>
            {/* {renderContactOption("Call Support", "Available 24/7 for urgent issues", "phone", () =>
              openPhone("+15551234567")
            )} */}
            {renderContactOption("Email Support", "Response within 24 hours", "email-outline", () =>
              openEmail("support@tellyoudoc.com")
            )}
            {/* {renderContactOption(
              "Live Chat",
              "Chat with our support team",
              "chat-outline",
              openChat,
              COLORS.success
            )} */}
            {/* {renderContactOption(
              "Help Center",
              "Browse our online help articles",
              "web",
              openWebsite,
              COLORS.accent
            )} */}
          </Surface>
        </View>

        {/* Quick Access to FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <Surface style={styles.quickHelpCard}>
            <TouchableOpacity
              style={styles.quickHelpOption}
              onPress={() => navigation.navigate("FAQ")}
            >
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={24}
                color={COLORS.headingColor}
              />
              <View style={styles.quickHelpText}>
                <Text style={styles.quickHelpTitle}>FAQ</Text>
                <Text style={styles.quickHelpSubtitle}>Browse frequently asked questions</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textLighter} />
            </TouchableOpacity>
          </Surface>
        </View>

        {/* Still Need Help */}
        {/* <View style={styles.stillNeedHelpSection}>
          <Text style={styles.stillNeedHelpTitle}>Still need help?</Text>
          <Text style={styles.stillNeedHelpText}>
            Our support team is here to assist you with any questions or issues.
          </Text>
          <PrimaryButton
            title="Contact Support"
            onPress={() => openPhone("+15551234567")}
            icon="phone"
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: FontSize.heading_H1,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginTop: 12,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  emergencyNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    marginBottom: 24,
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.error,
  },
  emergencySubtitle: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.headingColor,
    marginBottom: 16,
  },
  contactCard: {
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
  },
  contactSubtitle: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  quickHelpCard: {
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  quickHelpOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  quickHelpText: {
    flex: 1,
    marginLeft: 16,
  },
  quickHelpTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
  },
  quickHelpSubtitle: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  resourcesCard: {
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resourceText: {
    flex: 1,
    marginLeft: 16,
  },
  resourceTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
  },
  resourceSubtitle: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  stillNeedHelpSection: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 20,
  },
  stillNeedHelpTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    textAlign: "center",
    marginBottom: 8,
  },
  stillNeedHelpText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});

export default Support;
