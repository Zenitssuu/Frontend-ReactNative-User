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

const TermsConditions = ({ navigation }) => {
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

  const openWebsite = () => {
    Linking.openURL("https://www.tellyoudoc.com");
  };

  const termsConditionsSections = [
    {
      key: "introduction",
      title: "Introduction",
      icon: "handshake-outline",
      content: `These Terms and Conditions ("Terms") govern your access to and use of the TellYouDoc mobile application and website (collectively, the "Platform"), provided by Precise Medication Research Private Limited, an Indian company with its registered office at Indian Institute of Information Technology Guwahati (IIITG), Bongora, Guwahati, Assam - 781015. 

By accessing or using the Platform, you agree to be bound by these Terms, our Privacy Policy, and all applicable laws and regulations in India. If you do not agree with any part of these Terms, you must not use the Platform.

Effective Date: ${new Date().toLocaleDateString()}
Last Updated: ${new Date().toLocaleDateString()}`,
    },
    {
      key: "nature_of_platform",
      title: "Nature of the Platform and Services",
      icon: "medical-bag",
      content: `TellYouDoc is a digital healthcare platform designed to facilitate communication and interaction between patients, caregivers, and healthcare professionals (doctors). The Platform aims to provide a convenient and accessible means for users to manage their health-related needs, including but not limited to, booking appointments, accessing health information, and communicating with doctors. 

The Platform is currently focused on breast cancer care but will expand to include other medical conditions and services, such as pill management, chemotherapy management, and general diseases. The Platform is provided free of charge to both doctors and patients.

IMPORTANT DISCLAIMER: TellYouDoc is a technology platform and does not provide medical advice, diagnosis, or treatment. The information provided on the Platform is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Platform. TellYouDoc does not endorse any specific doctor, product, procedure, opinion, or other information that may be mentioned on the Platform. Reliance on any information appearing on the Platform, whether provided by TellYouDoc, its content providers, or other users, is solely at your own risk.`,
    },
    {
      key: "acceptance_of_terms",
      title: "Acceptance of Terms",
      icon: "account-check-outline",
      content: `By downloading, accessing, or using the Platform, you irrevocably accept and agree to be bound by these Terms, our Privacy Policy, and any other terms and conditions that may be applicable to specific services offered on the Platform. 

This Agreement supersedes all previous oral and written terms and conditions (if any) communicated to you relating to your use of the Platform. If you do not agree with any of these terms, you may not use the Platform and the Services.

Your continued use of the Platform constitutes acceptance of these Terms and any modifications we may make from time to time.`,
    },
    {
      key: "eligibility",
      title: "Eligibility",
      icon: "account-supervisor-outline",
      content: `You must be at least 18 years of age to register, use the Services, or visit or use the Platform in any manner. 

By registering, visiting, and using the Platform or accepting these Terms, you represent and warrant to TellYouDoc that you are 18 years of age or older, and that you have the right, authority, and capacity to use the Platform and the Services available through the Platform, and agree to and abide by these Terms.

Users under 18 years of age are not permitted to use this Platform without proper legal guardian consent and supervision.`,
    },
    {
      key: "user_accounts",
      title: "User Accounts and Registration",
      icon: "account-plus-outline",
      content: `To access certain features of the Platform, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. 

You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify TellYouDoc immediately of any unauthorized use of your account. 

TellYouDoc reserves the right to suspend or terminate your account if any information provided during the registration process or thereafter proves to be inaccurate, false, or incomplete.

Account Security:
• Maintain confidentiality of login credentials
• Use strong passwords
• Notify us immediately of suspected unauthorized access
• One account per person is permitted`,
    },
    {
      key: "user_responsibilities",
      title: "User Responsibilities",
      icon: "clipboard-list-outline",
      content: `As a user of the TellYouDoc Platform, you agree to:

• Use the Platform only for lawful purposes and in accordance with these Terms
• Provide accurate and complete information when using the Platform, including during registration and when communicating with healthcare professionals
• Maintain the confidentiality of your account login information and be responsible for all activities that occur under your account
• Comply with all applicable laws and regulations in India regarding your use of the Platform and any medical advice or treatment you receive
• Respect the privacy and confidentiality of other users and healthcare professionals on the Platform
• Not to use the Platform for any fraudulent, abusive, or otherwise illegal activity
• Not to upload or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable
• Not to impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity
• Not to interfere with or disrupt the operation of the Platform or the servers or networks connected to the Platform`,
    },
    {
      key: "doctor_patient_relationship",
      title: "Doctor-Patient Relationship",
      icon: "doctor",
      content: `TellYouDoc facilitates communication between doctors and patients but does not establish a doctor-patient relationship. The Platform is not a substitute for in-person medical consultation, examination, or diagnosis. 

Any medical advice or information provided through the Platform is for informational purposes only and should not be considered a substitute for professional medical advice. 

Doctors using the Platform are independent healthcare professionals and are solely responsible for the medical advice and services they provide. TellYouDoc is not responsible for the quality of care or any medical outcomes resulting from the use of the Platform.

Important Notice:
• The Platform facilitates communication only
• No doctor-patient relationship is established through the Platform
• Always seek in-person medical consultation for serious conditions
• Healthcare providers are independent contractors`,
    },
    {
      key: "intellectual_property",
      title: "Intellectual Property",
      icon: "copyright",
      content: `All content on the Platform, including text, graphics, logos, images, audio clips, video clips, data compilations, and software, is the property of TellYouDoc or its content suppliers and is protected by Indian and international copyright laws. 

The compilation of all content on the Platform is the exclusive property of TellYouDoc and is protected by Indian and international copyright laws. All software used on the Platform is the property of TellYouDoc or its software suppliers and is protected by Indian and international copyright laws.

You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the Platform, use of the Platform, or access to the Platform without the express written permission of TellYouDoc.

Restrictions:
• No unauthorized copying or distribution
• No commercial use without permission
• Respect for third-party intellectual property
• All rights reserved by TellYouDoc`,
    },
    {
      key: "third_party_links",
      title: "Third-Party Links",
      icon: "link-variant",
      content: `The Platform may contain links to third-party websites or resources. You acknowledge and agree that TellYouDoc is not responsible or liable for the availability or accuracy of such websites or resources, or the content, products, or services on or available from such websites or resources. 

Links to such websites or resources do not imply any endorsement by TellYouDoc of such websites or resources or the content, products, or services available from such websites or resources. 

You acknowledge sole responsibility for and assume all risk arising from your use of any such websites or resources.

Third-Party Disclaimer:
• No endorsement of external content
• Use third-party sites at your own risk
• External privacy policies may apply
• TellYouDoc not responsible for third-party services`,
    },
    {
      key: "disclaimer_of_warranties",
      title: "Disclaimer of Warranties",
      icon: "shield-alert-outline",
      content: `The Platform and the Services are provided on an "as is" and "as available" basis. TellYouDoc makes no representations or warranties of any kind, express or implied, as to the operation of the Platform or the Services, or the information, content, materials, or products included on the Platform. You expressly agree that your use of the Platform and the Services is at your sole risk.

TellYouDoc does not warrant that the Platform will be uninterrupted, timely, secure, or error-free, or that the results that may be obtained from the use of the Platform will be accurate or reliable. 

TellYouDoc disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose.

"AS IS" BASIS:
• No guarantees of uninterrupted service
• No warranty of accuracy or reliability
• Use at your own risk
• Technical issues may occur`,
    },
    {
      key: "limitation_of_liability",
      title: "Limitation of Liability",
      icon: "shield-outline",
      content: `To the fullest extent permitted by applicable law, in no event shall TellYouDoc, its affiliates, officers, directors, employees, agents, licensors, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

(i) your access to or use of or inability to access or use the Platform
(ii) any conduct or content of any third party on the Platform
(iii) any content obtained from the Platform
(iv) unauthorized access, use, or alteration of your transmissions or content

This limitation applies whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.

Liability Limitations:
• Maximum extent permitted by law
• No liability for indirect damages
• No liability for third-party actions
• Limited to direct damages only`,
    },
    {
      key: "indemnification",
      title: "Indemnification",
      icon: "shield-check-outline",
      content: `You agree to indemnify, defend, and hold harmless TellYouDoc, its affiliates, officers, directors, employees, agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of these Terms or any activity related to your account (including negligent or wrongful conduct) by you or any other person accessing the Platform using your Internet account.

This indemnification includes but is not limited to:
• Violations of these Terms and Conditions
• Misuse of your account
• Negligent or wrongful conduct
• Legal fees and court costs
• Any claims arising from your use of the Platform

Your Responsibility:
• Defend TellYouDoc against claims
• Cover legal costs and damages
• Applies to account misuse
• Includes third-party claims`,
    },
    {
      key: "governing_law",
      title: "Governing Law and Jurisdiction",
      icon: "gavel",
      content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. 

You agree that any legal action or proceeding between TellYouDoc and you for any purpose concerning these Terms or the parties' obligations hereunder shall be brought exclusively in the courts located in Guwahati, Assam, India.

Jurisdiction Details:
• Governed by Indian laws
• Exclusive jurisdiction in Guwahati, Assam courts
• No conflict of law provisions apply
• All disputes subject to Indian legal system

Legal Framework:
• Indian Information Technology Act applicable
• Indian Consumer Protection Act applicable
• Other relevant Indian healthcare regulations
• Local state laws of Assam may apply`,
    },
    {
      key: "severability",
      title: "Severability",
      icon: "puzzle-outline",
      content: `If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, that provision shall be enforced to the maximum extent possible, and the other provisions contained in these Terms shall remain in full force and effect.

This ensures that:
• Invalid provisions don't affect the entire agreement
• Maximum enforceability of valid terms
• Continuity of the Terms and Conditions
• Legal protection for both parties

Partial Invalidity:
• Only invalid portions are affected
• Remaining terms stay in effect
• Court interpretation governs
• Maximum legal enforcement`,
    },
    {
      key: "entire_agreement",
      title: "Entire Agreement",
      icon: "file-document-multiple-outline",
      content: `These Terms, together with the Privacy Policy and any other legal notices published by TellYouDoc on the Platform, constitute the entire agreement between you and TellYouDoc concerning the Platform and the Services, and supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and TellYouDoc with respect to the Platform and the Services.

Complete Agreement Includes:
• These Terms and Conditions
• Privacy Policy
• Any additional service-specific terms
• Legal notices on the Platform

Supersedes:
• All previous agreements
• Oral communications
• Written proposals
• Prior versions of terms`,
    },
    {
      key: "changes_to_terms",
      title: "Changes to Terms",
      icon: "file-document-edit-outline",
      content: `TellYouDoc reserves the right to update, change, or modify these Terms at any time. The updated Terms will be effective upon posting on the Platform. 

Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms. If you do not agree to any of the Terms or any changes thereto, you may not use the Platform and the Services.

Modification Process:
• Changes effective upon posting
• Continued use implies acceptance
• Notification through the Platform
• Right to discontinue use if disagreeing

Types of Changes:
• Legal compliance updates
• Service feature modifications
• Policy clarifications
• Regulatory requirement changes`,
    },
    {
      key: "contact_information",
      title: "Contact Information",
      icon: "phone-outline",
      content: `If you have any questions about these Terms, please contact us at contact@tellyoudoc.com.

Company Details:
Precise Medication Research Private Limited
Indian Institute of Information Technology Guwahati (IIITG)
Bongora, Guwahati, Assam - 781015
India

Contact Methods:
Email: contact@tellyoudoc.com
Website: www.tellyoudoc.com

For specific inquiries:
• General questions: contact@tellyoudoc.com
• Technical support: Available through the app
• Legal matters: contact@tellyoudoc.com
• Privacy concerns: contact@tellyoudoc.com

Business Hours:
Monday to Friday: 9:00 AM - 6:00 PM IST
Response time: 24-48 hours for email inquiries

Last Updated: ${new Date().toLocaleDateString()}
Version: 1.0`,
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
        title="Terms & Conditions"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={48}
            color={COLORS.headingColor}
          />
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Please read these terms carefully before using our services
          </Text>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.quickLinksSection}>
          <Text style={styles.quickLinksTitle}>Quick Actions</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
              <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={openWebsite}>
              <MaterialCommunityIcons name="web" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Visit Website</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.importantNotice}>
          <MaterialCommunityIcons name="alert-circle" size={24} color={COLORS.warning} />
          <Text style={styles.noticeText}>
            These terms constitute a legally binding agreement. By using our services, you agree to
            these terms and conditions.
          </Text>
        </View>

        <View style={styles.sectionsContainer}>{termsConditionsSections.map(renderSection)}</View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            For questions about these Terms and Conditions, please contact us at:
          </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.emailLink}>contact@tellyoudoc.com</Text>
          </TouchableOpacity>
          <Text style={styles.footerDisclaimer}>
            These terms are effective as of {new Date().toLocaleDateString()} and supersede all
            previous versions.
          </Text>
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
    marginBottom: 16,
  },
  quickLinksTitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.headingColor,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  importantNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: 24,
  },
  noticeText: {
    flex: 1,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
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
    marginBottom: 12,
  },
  footerDisclaimer: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLighter,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default TermsConditions;
