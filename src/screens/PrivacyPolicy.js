import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize, SHADOWS } from "../constants/GlobalStyles";
import { Header } from "../components/UIComponents";

const PrivacyPolicy = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = sectionKey => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const openEmail = () => {
    Linking.openURL("mailto:contact@tellyoudoc.com");
  };

  const privacySections = [
    {
      key: "introduction",
      title: "Introduction",
      icon: "information-outline",
      content: `TellYouDoc ("we," "us," or "our") is committed to protecting the privacy of your personal information. This Privacy Policy describes how we collect, use, process, store, and disclose your personal information when you use our mobile application and website (collectively, the "Platform"). This policy applies to all users of our Platform, including doctors, patients, and caregivers. By accessing or using the Platform, you agree to the terms of this Privacy Policy. If you do not agree with any part of this Privacy Policy, you must not use the Platform.

This Privacy Policy is published in compliance with, inter alia, the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (the "SPI Rules"), and the Digital Personal Data Protection Act, 2023 (DPDP Act).`,
    },
    {
      key: "definitions",
      title: "1. Definitions",
      icon: "book-outline",
      content: `• Personal Information: Any information that relates to a natural person, which, either directly or indirectly, in combination with other information available or likely to be available to a body corporate, is capable of identifying such person.

• Sensitive Personal Data or Information (SPDI): Personal information about a person relating to passwords, financial information (bank accounts, credit/debit card details), physical, physiological, and mental health condition, sexual orientation, medical records and history, biometric information, and any other information received by a body corporate under lawful contract or otherwise.

• Data Principal: The individual to whom the personal data relates (i.e., you, the user).

• Data Fiduciary: The entity that determines the purpose and means of processing personal data (i.e., TellYouDoc).

• Platform: Refers to the TellYouDoc mobile application and website.

• Users: Refers to doctors, patients, and caregivers who use the TellYouDoc Platform.`,
    },
    {
      key: "information_collected",
      title: "2. Information We Collect",
      icon: "database-outline",
      content: `We collect various types of information from and about you for the purposes outlined in this Privacy Policy. This information may include, but is not limited to, the following categories:

A. Information You Provide to Us
We collect information that you voluntarily provide to us when you register for an account, use our services, communicate with us, or otherwise interact with the Platform. This includes:

• Contact Information: Name, email address, phone number, postal address, and other similar contact data.
• Demographic Information: Gender, date of birth, and pin code.
• Account Information: Username, password, and other registration details.
• Health-Related Information (SPDI): Medical history, health status, details of treatment plans, medication prescribed, laboratory testing results, and any other health information you choose to provide. For doctors, this may include their specialization, qualifications, and professional registration details.
• Financial Information: Payment instrument information, transaction history, and preferences (if any payment services are introduced in the future).
• Communication Data: Information shared by you through emails, chat, or other correspondence with us.
• User-Generated Content: Reviews, feedback, opinions, images, and other documents/files you upload or share on the Platform.

B. Information Collected Automatically
When you access or use our Platform, we may automatically collect certain technical and usage information. This includes:

• Technical Information: Internet Protocol (IP) address, device type, operating system, browser type, unique device identifiers, and mobile network information.
• Usage Data: Information about how you interact with the Platform, such as pages visited, features used, time spent on the Platform, and referring URLs.
• Cookies and Similar Technologies: We use cookies, pixels, and similar technologies to collect information about your browsing activities and preferences. You can manage your cookie preferences through your browser settings.

C. Information from Other Sources
We may obtain information about you from other sources, such as third-party service providers (e.g., analytics providers) or publicly available sources, where permitted by law. If you authorize a third-party website to interact with our Platform, we may receive information from that website.`,
    },
    {
      key: "how_we_use",
      title: "3. How We Use Your Information",
      icon: "cog-outline",
      content: `We use the information we collect from you for various purposes, including:

• Providing and Improving Services: To operate, maintain, and provide the features and functionality of the Platform, including facilitating communication between doctors, patients, and caregivers, and managing appointments. We also use this information to improve our services, develop new features, and enhance user experience.

• Personalization: To personalize your experience on the Platform, such as displaying relevant health information or connecting you with appropriate healthcare professionals.

• Communication: To communicate with you about your account, services, updates, security alerts, and administrative messages. We may also send you promotional communications about our products and services, from which you can opt-out at any time.

• Research and Analysis: To conduct research, statistical analysis, and business intelligence purposes in an aggregated or non-personally identifiable form. This helps us understand user behavior, identify trends, and improve our Platform.

• Security and Fraud Prevention: To detect, prevent, and address technical issues, security incidents, and fraudulent activities.

• Legal Compliance: To comply with applicable laws, regulations, legal processes, and governmental requests, including responding to subpoenas or court orders.

• Enforcement of Terms: To enforce our Terms and Conditions and other policies, and to protect our rights, privacy, safety, or property, and that of our users or the public.`,
    },
    {
      key: "information_sharing",
      title: "4. How We Share Your Information",
      icon: "share-variant-outline",
      content: `We may share your information with the following categories of third parties for the purposes described in this Privacy Policy:

• Healthcare Professionals: We share relevant health-related information with doctors to facilitate online consultations and provide medical services. This sharing is done with your explicit consent.

• Caregivers: If you designate a caregiver, we may share relevant information with them to assist in managing your health or the patient's health.

• Service Providers: We may engage third-party service providers to perform functions on our behalf, such as cloud hosting, data analytics, payment processing (if applicable), and customer support. These service providers are obligated to protect your information and use it only for the purposes for which it was disclosed.

• Legal and Regulatory Authorities: We may disclose your information if required by law, regulation, or legal process, or if we believe it is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.

• Business Transfers: In the event of a merger, acquisition, reorganization, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity.

• Aggregated or Anonymized Data: We may share aggregated or anonymized data that does not personally identify you with third parties for research, marketing, analytics, or other purposes.`,
    },
    {
      key: "data_security",
      title: "5. Data Security",
      icon: "shield-check-outline",
      content: `We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include technical, administrative, and physical safeguards designed to protect the confidentiality, integrity, and availability of your data. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security of your information.`,
    },
    {
      key: "data_retention",
      title: "6. Data Retention",
      icon: "clock-outline",
      content: `We retain your personal information for as long as necessary to provide the services you have requested, to comply with our legal obligations, resolve disputes, and enforce our agreements. When your personal information is no longer required for these purposes, we will securely delete or anonymize it.`,
    },
    {
      key: "your_rights",
      title: "7. Your Rights and Choices",
      icon: "account-check-outline",
      content: `As a Data Principal, you have certain rights regarding your personal information, subject to applicable laws. These rights may include:

• Right to Access: You have the right to request access to your personal information that we hold.
• Right to Correction: You have the right to request that we correct any inaccurate or incomplete personal information.
• Right to Erasure (Right to be Forgotten): You have the right to request the deletion of your personal information under certain circumstances.
• Right to Object: You have the right to object to the processing of your personal information under certain circumstances.
• Right to Restriction of Processing: You have the right to request that we restrict the processing of your personal information under certain circumstances.
• Right to Data Portability: You have the right to receive your personal information in a structured, commonly used, and machine-readable format.
• Right to Withdraw Consent: You have the right to withdraw your consent to the processing of your personal information at any time, where processing is based on consent.

To exercise any of these rights, please contact us using the contact information provided below. We will respond to your request in accordance with applicable laws.`,
    },
    {
      key: "children_privacy",
      title: "8. Children's Privacy",
      icon: "baby-face-outline",
      content: `The TellYouDoc Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete such information from our records.`,
    },
    {
      key: "policy_changes",
      title: "9. Changes to This Privacy Policy",
      icon: "file-document-edit-outline",
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated Privacy Policy on the Platform and updating the "Last Updated" date. Your continued use of the Platform after the effective date of the revised Privacy Policy constitutes your acceptance of the updated terms.`,
    },
    {
      key: "contact_information",
      title: "10. Contact Us",
      icon: "email-outline",
      content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:

Precise Medication Research Private Limited
Indian Institute of Information Technology Guwahati (IIITG),
Bongora, Guwahati, Assam - 781015
Email: contact@tellyoudoc.com

Last Updated: June 30, 2025`,
    },
  ];

  const renderSection = section => {
    const isExpanded = expandedSections[section.key];

    return (
      <Surface key={section.key} style={styles.sectionCard}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section.key)}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name={section.icon} size={24} color={COLORS.headingColor} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.headingColor}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{section.content}</Text>
          </View>
        )}
      </Surface>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Privacy Policy"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <MaterialCommunityIcons
            name="shield-account-outline"
            size={48}
            color={COLORS.headingColor}
          />
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>
            Your privacy and data security are our top priorities
          </Text>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.quickLinksSection}>
          <Text style={styles.quickLinksTitle}>Quick Links</Text>
          <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
            <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionsContainer}>{privacySections.map(renderSection)}</View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.emailLink}>contact@tellyoudoc.com</Text>
          </TouchableOpacity>
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
  lastUpdated: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLighter,
    marginTop: 8,
  },
  quickLinksSection: {
    marginBottom: 24,
  },
  quickLinksTitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.headingColor,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  contactButtonText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.primary,
    marginLeft: 8,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: 12,
  },
  footerSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 8,
  },
  emailLink: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default PrivacyPolicy;
