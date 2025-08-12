import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize, SHADOWS } from "../constants/GlobalStyles";
import { Header } from "../components/UIComponents";

const FAQ = ({ navigation }) => {
  const [expandedFAQs, setExpandedFAQs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggleFAQ = faqKey => {
    setExpandedFAQs(prev => ({
      ...prev,
      [faqKey]: !prev[faqKey],
    }));
  };

  const supportCategories = [
    { key: "all", title: "All", icon: "help-circle-outline" },
    { key: "account", title: "Account", icon: "account-outline" },
    { key: "appointments", title: "Appointments", icon: "calendar-outline" },
    { key: "technical", title: "Technical", icon: "cog-outline" },
    { key: "billing", title: "Billing", icon: "credit-card-outline" },
    { key: "medical", title: "Medical", icon: "medical-bag" },
  ];

  const faqData = [
    {
      key: "create_account",
      category: "account",
      question: "How do I create an account?",
      answer: `To create an account:

1. Download the TellYouDoc app from your app store
2. Tap "Sign Up" on the welcome screen
3. Enter your personal information (name, email, phone)
4. Verify your email address and phone number
5. Complete your medical profile
6. Add payment method (if required)
7. Start using the app!

You can also create an account on our website at www.tellyoudoc.com and then log in to the mobile app.`,
    },
    {
      key: "book_appointment",
      category: "appointments",
      question: "How do I book an appointment with a doctor?",
      answer: `To book an appointment:

1. Open the app and go to "Book Appointment"
2. Select your symptoms or reason for visit
3. Choose "Video Call" or "In-Person" consultation
4. Browse available doctors and their profiles
5. Select your preferred doctor
6. Choose an available time slot
7. Confirm your appointment details
8. Complete payment (if required)

You'll receive confirmation via email and push notification. The doctor will also be notified of your appointment.`,
    },
    {
      key: "cancel_appointment",
      category: "appointments",
      question: "How do I cancel or reschedule an appointment?",
      answer: `To cancel or reschedule:

1. Go to "My Appointments" in the app
2. Find the appointment you want to change
3. Tap on the appointment
4. Select "Cancel" or "Reschedule"
5. Choose a new time slot (for rescheduling)
6. Confirm your changes

Cancellation Policy:
• Free cancellation up to 24 hours before appointment
• Cancellations within 24 hours may incur a fee
• Emergency cancellations are handled case-by-case`,
    },
    {
      key: "video_call_issues",
      category: "technical",
      question: "I'm having trouble with video calls. What should I do?",
      answer: `For video call issues, try these steps:

Connection Issues:
• Check your internet connection (WiFi or cellular)
• Close other apps that might be using bandwidth
• Restart your router if using WiFi
• Try switching between WiFi and cellular data

Audio/Video Problems:
• Check app permissions for camera and microphone
• Restart the app
• Ensure your device's camera and microphone are working
• Update the app to the latest version

Still having issues?
• Test your connection at speedtest.net
• Contact support for technical assistance
• We can schedule a test call before your appointment`,
    },
    {
      key: "payment_methods",
      category: "billing",
      question: "What payment methods do you accept?",
      answer: `We accept the following payment methods:

Credit/Debit Cards:
• Visa, MasterCard, American Express, Discover
• Both US and international cards accepted

Digital Payments:
• Apple Pay (iOS devices)
• Google Pay (Android devices)
• PayPal

Insurance:
• Most major insurance plans accepted
• Insurance coverage varies by provider
• Check with your insurance for telemedicine benefits
• We'll verify your benefits before appointment

HSA/FSA:
• Health Savings Account and Flexible Spending Account cards accepted
• Keep receipts for reimbursement purposes`,
    },
    {
      key: "prescription_refills",
      category: "medical",
      question: "Can doctors prescribe medications through the app?",
      answer: `Yes, licensed doctors can prescribe medications:

Prescription Process:
• Doctor evaluates your condition during consultation
• If appropriate, prescription is sent directly to your pharmacy
• You'll receive notification when prescription is ready
• Some medications may require in-person evaluation

Prescription Refills:
• Request refills through the app
• Doctor will review your medical history
• Refills approved for continuing treatments
• New prescriptions may require consultation

Limitations:
• Controlled substances have restrictions
• Some medications require in-person examination
• State laws may limit certain prescriptions
• Always follow your doctor's instructions`,
    },
    {
      key: "medical_records",
      category: "medical",
      question: "How do I access my medical records?",
      answer: `To access your medical records:

In the App:
1. Go to "Profile" or "Medical Records"
2. View consultation history, prescriptions, and notes
3. Download or share records as needed
4. Upload documents from other healthcare providers

What's Included:
• Consultation notes and diagnoses
• Prescription history
• Lab results (when available)
• Uploaded documents and images
• Appointment history

Sharing Records:
• Share with other healthcare providers
• Download PDF copies for your records
• Email records to yourself or others
• All sharing is secure and HIPAA-compliant`,
    },
    {
      key: "insurance_coverage",
      category: "billing",
      question: "Does my insurance cover telemedicine appointments?",
      answer: `Insurance coverage for telemedicine:

Coverage Varies:
• Most major insurers now cover telemedicine
• Coverage depends on your specific plan
• Some plans have different copays for virtual visits
• Check with your insurance provider for details

How to Check:
• Call the number on your insurance card
• Ask about "telemedicine" or "virtual visit" benefits
• Verify if our providers are in-network
• Understand your copay and deductible

Using Insurance:
• Add your insurance card to the app
• We'll verify benefits before your appointment
• You'll pay your copay at time of service
• We'll bill your insurance directly

No Insurance?
• Self-pay options available
• Transparent pricing displayed upfront
• Payment plans may be available for larger bills`,
    },
    {
      key: "account_security",
      category: "account",
      question: "How do I keep my account secure?",
      answer: `To keep your account secure:

Strong Password:
• Use a unique, complex password
• Include letters, numbers, and symbols
• Don't reuse passwords from other accounts
• Change password regularly

Two-Factor Authentication:
• Enable 2FA in account settings
• Use SMS or authenticator app
• Required for accessing sensitive information

Safe Practices:
• Never share your login credentials
• Log out when using shared devices
• Keep your app updated
• Report suspicious activity immediately

Privacy Settings:
• Review who can access your information
• Control notification preferences
• Manage data sharing settings
• Understand our privacy policy

If Compromised:
• Change password immediately
• Contact support
• Review recent account activity
• Enable additional security measures`,
    },
    {
      key: "emergency_situations",
      category: "medical",
      question: "What should I do in a medical emergency?",
      answer: `IMPORTANT: This app is NOT for medical emergencies!

For Life-Threatening Emergencies:
• Call 911 immediately
• Go to the nearest emergency room
• Call poison control: 1-800-222-1222
• Don't wait - seek immediate help

When to Call 911:
• Chest pain or heart attack symptoms
• Difficulty breathing or choking
• Severe allergic reactions
• Loss of consciousness
• Severe bleeding or trauma
• Signs of stroke
• Severe burns

Urgent but Not Emergency:
• Use our urgent care feature
• Call our 24/7 nurse hotline
• Visit urgent care center
• Contact your primary care doctor

After Emergency Care:
• Follow up with your regular doctor
• Upload emergency room records to the app
• Update your medical history
• Take prescribed medications as directed`,
    },
    {
      key: "app_navigation",
      category: "technical",
      question: "How do I navigate through the app?",
      answer: `Getting around the app is easy:

Main Navigation:
• Use the bottom tab bar to switch between main sections
• Home: Dashboard and quick actions
• Appointments: View and manage your appointments
• Doctors: Browse and search for healthcare providers
• Profile: Manage your account and settings

Key Features:
• Search bar: Find doctors, specialties, or information
• Menu button: Access additional options and settings
• Back button: Return to previous screen
• Notifications: Stay updated on appointments and messages

Tips:
• Pull down to refresh content
• Swipe left/right on appointment cards for quick actions
• Long press for additional options
• Use voice search when available`,
    },
    {
      key: "app_updates",
      category: "technical",
      question: "How do I update the app?",
      answer: `To keep your app updated:

Automatic Updates:
• Enable auto-updates in your device settings
• Updates will download and install automatically
• Restart the app after updates for best performance

Manual Updates:
• Visit your device's app store
• Search for "TellYouDoc"
• Tap "Update" if available
• Or check the "My Apps" section for pending updates

Why Update?
• New features and improvements
• Security patches and bug fixes
• Better performance and stability
• Access to latest medical resources

Update Notifications:
• We'll notify you when important updates are available
• Some features may require the latest version
• Critical security updates are highly recommended`,
    },
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderFAQ = faq => {
    const isExpanded = expandedFAQs[faq.key];

    return (
      <Surface key={faq.key} style={styles.faqCard}>
        <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(faq.key)}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.headingColor}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.faqContent}>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        )}
      </Surface>
    );
  };

  const renderCategoryButton = category => {
    const isSelected = selectedCategory === category.key;

    return (
      <TouchableOpacity
        key={category.key}
        style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
        onPress={() => setSelectedCategory(category.key)}
      >
        <MaterialCommunityIcons
          name={category.icon}
          size={20}
          color={isSelected ? COLORS.white : COLORS.headingColor}
        />
        <Text style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextSelected]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="FAQ"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <MaterialCommunityIcons
            name="frequently-asked-questions"
            size={48}
            color={COLORS.headingColor}
          />
          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
          <Text style={styles.headerSubtitle}>
            Find quick answers to common questions about using our app
          </Text>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search FAQ</Text>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={COLORS.textLighter}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textLighter}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textLighter} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {supportCategories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions ({filteredFAQs.length})</Text>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(renderFAQ)
          ) : (
            <Surface style={styles.noResultsCard}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={48}
                color={COLORS.textLighter}
              />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search or browse different categories
              </Text>
            </Surface>
          )}
        </View>

        {/* Still Need Help */}
        <View style={styles.stillNeedHelpSection}>
          <Text style={styles.stillNeedHelpTitle}>Can't find what you're looking for?</Text>
          <Text style={styles.stillNeedHelpText}>
            Our support team is here to help with any additional questions.
          </Text>
          <TouchableOpacity
            style={styles.contactSupportButton}
            onPress={() => navigation.navigate("Support")}
          >
            <MaterialCommunityIcons name="headset" size={20} color={COLORS.white} />
            <Text style={styles.contactSupportText}>Contact Support</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.headingColor,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.headingColor,
    borderColor: COLORS.headingColor,
  },
  categoryButtonText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.headingColor,
    marginLeft: 6,
  },
  categoryButtonTextSelected: {
    color: COLORS.white,
  },
  faqCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
    marginRight: 12,
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  faqAnswer: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: 12,
  },
  noResultsCard: {
    alignItems: "center",
    padding: 32,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  noResultsTitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.text,
    marginTop: 16,
  },
  noResultsText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
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
  contactSupportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.headingColor,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  contactSupportText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default FAQ;
