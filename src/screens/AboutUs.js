import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize, SHADOWS } from "../constants/GlobalStyles";
import { Header } from "../components/UIComponents";

const AboutUs = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = sectionKey => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const openWebsite = () => {
    Linking.openURL("https://www.tellyoudoc.com");
  };

  const openEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  const openPhone = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openSocialMedia = (platform, url) => {
    Linking.openURL(url);
  };

  const companyStats = [
    {
      number: "50,000+",
      label: "Patients Served",
      icon: "account-heart",
      color: COLORS.primary,
    },
    {
      number: "500+",
      label: "Healthcare Providers",
      icon: "doctor",
      color: COLORS.success,
    },
    {
      number: "100,000+",
      label: "Consultations",
      icon: "video",
      color: COLORS.accent,
    },
    {
      number: "4.8★",
      label: "App Rating",
      icon: "star",
      color: "#FFD700",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      experience: "15+ years",
      description:
        "Leading our medical advisory board with extensive experience in telemedicine and patient care.",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      specialty: "Healthcare Technology",
      experience: "12+ years",
      description:
        "Pioneering secure, scalable healthcare technology solutions for better patient outcomes.",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Clinical Operations",
      specialty: "Family Medicine",
      experience: "10+ years",
      description: "Ensuring clinical excellence and quality care delivery across our platform.",
    },
    {
      name: "David Park",
      role: "Chief Executive Officer",
      specialty: "Healthcare Innovation",
      experience: "18+ years",
      description:
        "Visionary leader committed to making healthcare accessible and affordable for everyone.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "TellYouDoc was founded with a mission to make healthcare accessible to everyone, everywhere.",
    },
    {
      year: "2021",
      title: "First 1,000 Patients",
      description:
        "Reached our first milestone of serving 1,000 patients with quality telemedicine services.",
    },
    {
      year: "2022",
      title: "Multi-State Expansion",
      description:
        "Expanded our services across multiple states, partnering with licensed healthcare providers.",
    },
    {
      year: "2023",
      title: "50,000+ Patients",
      description:
        "Celebrated serving over 50,000 patients and launching advanced health monitoring features.",
    },
    {
      year: "2024",
      title: "AI Integration",
      description:
        "Introduced AI-powered symptom assessment and personalized health recommendations.",
    },
  ];

  const values = [
    {
      title: "Patient-Centered Care",
      icon: "heart-pulse",
      description:
        "Every decision we make is centered around improving patient outcomes and experiences.",
    },
    {
      title: "Innovation",
      icon: "lightbulb-on-outline",
      description:
        "We continuously innovate to bring cutting-edge healthcare technology to our users.",
    },
    {
      title: "Accessibility",
      icon: "wheelchair-accessibility",
      description:
        "Healthcare should be accessible to everyone, regardless of location or circumstances.",
    },
    {
      title: "Security & Privacy",
      icon: "shield-lock",
      description:
        "We maintain the highest standards of data security and patient privacy protection.",
    },
    {
      title: "Quality Excellence",
      icon: "medal",
      description:
        "We are committed to delivering the highest quality healthcare services and support.",
    },
    {
      title: "Transparency",
      icon: "eye-outline",
      description:
        "We believe in transparent pricing, clear communication, and honest healthcare practices.",
    },
  ];

  const renderStatCard = stat => (
    <Surface key={stat.label} style={styles.statCard}>
      <MaterialCommunityIcons
        name={stat.icon}
        size={32}
        color={stat.color}
        style={styles.statIcon}
      />
      <Text style={styles.statNumber}>{stat.number}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Surface>
  );

  const renderTeamMember = (member, index) => (
    <Surface key={index} style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <View style={styles.teamAvatar}>
          <Text style={styles.teamAvatarText}>
            {member.name
              .split(" ")
              .map(n => n[0])
              .join("")}
          </Text>
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{member.name}</Text>
          <Text style={styles.teamRole}>{member.role}</Text>
          <Text style={styles.teamSpecialty}>{member.specialty}</Text>
          <Text style={styles.teamExperience}>{member.experience}</Text>
        </View>
      </View>
      <Text style={styles.teamDescription}>{member.description}</Text>
    </Surface>
  );

  const renderMilestone = (milestone, index) => (
    <View key={index} style={styles.milestoneItem}>
      <View style={styles.milestoneYear}>
        <Text style={styles.milestoneYearText}>{milestone.year}</Text>
      </View>
      <View style={styles.milestoneContent}>
        <Text style={styles.milestoneTitle}>{milestone.title}</Text>
        <Text style={styles.milestoneDescription}>{milestone.description}</Text>
      </View>
    </View>
  );

  const renderValue = (value, index) => (
    <Surface key={index} style={styles.valueCard}>
      <MaterialCommunityIcons
        name={value.icon}
        size={28}
        color={COLORS.headingColor}
        style={styles.valueIcon}
      />
      <View style={styles.valueContent}>
        <Text style={styles.valueTitle}>{value.title}</Text>
        <Text style={styles.valueDescription}>{value.description}</Text>
      </View>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="About Us"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="medical-bag" size={64} color={COLORS.headingColor} />
          </View>
          <Text style={styles.headerTitle}>TellYouDoc</Text>
          <Text style={styles.headerSubtitle}>Revolutionizing Healthcare Through Technology</Text>
          <Text style={styles.headerDescription}>
            Making quality healthcare accessible, affordable, and convenient for everyone,
            everywhere.
          </Text>
        </View>

        {/* Company Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsContainer}>{companyStats.map(renderStatCard)}</View>
        </View>

        {/* Mission & Vision */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission & Vision</Text>

          <Surface style={styles.missionVisionCard}>
            <View style={styles.missionSection}>
              <MaterialCommunityIcons
                name="target"
                size={32}
                color={COLORS.primary}
                style={styles.missionIcon}
              />
              <Text style={styles.missionTitle}>Our Mission</Text>
              <Text style={styles.missionText}>
                To democratize healthcare by providing accessible, high-quality medical services
                through innovative technology, connecting patients with licensed healthcare
                providers anytime, anywhere.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.visionSection}>
              <MaterialCommunityIcons
                name="eye-outline"
                size={32}
                color={COLORS.accent}
                style={styles.visionIcon}
              />
              <Text style={styles.visionTitle}>Our Vision</Text>
              <Text style={styles.visionText}>
                A world where everyone has immediate access to quality healthcare, regardless of
                their location, schedule, or circumstances. We envision a future where technology
                bridges the gap between patients and healthcare providers.
              </Text>
            </View>
          </Surface>
        </View>

        {/* Our Story */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Surface style={styles.storyCard}>
            <Text style={styles.storyText}>
              TellYouDoc was born from a simple yet powerful idea: healthcare should be accessible
              to everyone. Founded in 2020 by a team of healthcare professionals and technology
              experts, we recognized the growing need for convenient, reliable healthcare services.
              {"\n\n"}
              Our journey began during the global pandemic when traditional healthcare delivery
              faced unprecedented challenges. We saw an opportunity to leverage technology to
              connect patients with healthcare providers safely and efficiently.
              {"\n\n"}
              Today, we're proud to serve thousands of patients across multiple states, working with
              licensed healthcare providers to deliver quality care through our secure,
              user-friendly platform.
            </Text>
          </Surface>
        </View>

        {/* Company Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Journey</Text>
          <View style={styles.timelineContainer}>{milestones.map(renderMilestone)}</View>
        </View>

        {/* Our Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesContainer}>{values.map(renderValue)}</View>
        </View>

        {/* Leadership Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leadership Team</Text>
          {teamMembers.map(renderTeamMember)}
        </View>

        {/* Certifications & Compliance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications & Compliance</Text>
          <Surface style={styles.complianceCard}>
            <View style={styles.complianceItem}>
              <MaterialCommunityIcons name="shield-check" size={24} color={COLORS.success} />
              <Text style={styles.complianceText}>HIPAA Compliant</Text>
            </View>
            <View style={styles.complianceItem}>
              <MaterialCommunityIcons name="certificate" size={24} color={COLORS.success} />
              <Text style={styles.complianceText}>SOC 2 Type II Certified</Text>
            </View>
            <View style={styles.complianceItem}>
              <MaterialCommunityIcons name="lock" size={24} color={COLORS.success} />
              <Text style={styles.complianceText}>256-bit SSL Encryption</Text>
            </View>
            <View style={styles.complianceItem}>
              <MaterialCommunityIcons name="check-decagram" size={24} color={COLORS.success} />
              <Text style={styles.complianceText}>State Licensed Providers</Text>
            </View>
          </Surface>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <Surface style={styles.contactCard}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => openEmail("info@tellyoudoc.com")}
            >
              <MaterialCommunityIcons name="email-outline" size={24} color={COLORS.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>info@tellyoudoc.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={() => openPhone("+15551234567")}>
              <MaterialCommunityIcons name="phone-outline" size={24} color={COLORS.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
              <MaterialCommunityIcons name="web" size={24} color={COLORS.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>www.tellyoudoc.com</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={24} color={COLORS.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Headquarters</Text>
                <Text style={styles.contactValue}>
                  123 Healthcare Blvd{"\n"}San Francisco, CA 94102
                </Text>
              </View>
            </View>
          </Surface>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia("twitter", "https://twitter.com/tellyoudoc")}
            >
              <MaterialCommunityIcons name="twitter" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia("facebook", "https://facebook.com/tellyoudoc")}
            >
              <MaterialCommunityIcons name="facebook" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia("linkedin", "https://linkedin.com/company/tellyoudoc")}
            >
              <MaterialCommunityIcons name="linkedin" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocialMedia("instagram", "https://instagram.com/tellyoudoc")}
            >
              <MaterialCommunityIcons name="instagram" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Thank you for choosing TellYouDoc for your healthcare needs. We're committed to
            providing you with the best possible care and service.
          </Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
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
    paddingVertical: 32,
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: FontSize.heading_H1 + 4,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 12,
  },
  headerDescription: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    alignItems: "center",
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: FontSize.heading_H1,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.textLight,
    textAlign: "center",
  },
  missionVisionCard: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  missionSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  missionIcon: {
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.primary,
    marginBottom: 12,
  },
  missionText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 24,
  },
  visionSection: {
    alignItems: "center",
  },
  visionIcon: {
    marginBottom: 12,
  },
  visionTitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.accent,
    marginBottom: 12,
  },
  visionText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 22,
  },
  storyCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  storyText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    lineHeight: 24,
  },
  timelineContainer: {
    paddingLeft: 20,
  },
  milestoneItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  milestoneYear: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.headingColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  milestoneYearText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.white,
  },
  milestoneContent: {
    flex: 1,
    paddingTop: 8,
  },
  milestoneTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  valuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  valueCard: {
    width: "48%",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  valueIcon: {
    marginBottom: 12,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 8,
  },
  valueDescription: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  teamCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  teamHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.headingColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  teamAvatarText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.white,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
  },
  teamRole: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
    marginTop: 2,
  },
  teamSpecialty: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  teamExperience: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.primary,
    marginTop: 2,
  },
  teamDescription: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  complianceCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  complianceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  complianceText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.text,
    marginLeft: 12,
  },
  contactCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.textLighter,
  },
  contactValue: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    marginTop: 2,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.headingColor,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
  footerSection: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 20,
  },
  footerText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  footerVersion: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLighter,
  },
});

export default AboutUs;
