import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize, SHADOWS } from "../constants/GlobalStyles";
import { Header } from "../components/UIComponents";

const Manual = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = sectionKey => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const manualSections = [
    {
      key: "getting_started",
      title: "Getting Started",
      icon: "rocket-launch-outline",
      content: `Welcome to TellYouDoc - Your Complete Healthcare Companion!

OVERVIEW:
TellYouDoc is a comprehensive healthcare application that connects you with licensed healthcare providers for telemedicine consultations, symptom tracking, appointment management, and health monitoring.

FIRST TIME SETUP:
1. Download the app from your device's app store
2. Open the app and tap "Get Started" on the welcome screen
3. Choose to "Sign Up" for a new account or "Login" if you already have one
4. Complete the registration process with your personal information
5. Verify your email address and phone number
6. Set up your medical profile and preferences
7. Add payment method and insurance information (optional)

SYSTEM REQUIREMENTS:
• iOS 12.0 or later / Android 8.0 or later
• Internet connection (WiFi or cellular data)
• Camera and microphone access for video consultations
• Storage space for app data and documents

ACCOUNT TYPES:
• Patient Account: For individuals seeking healthcare services
• Family Account: Manage healthcare for family members
• Behalf Account: Caregivers managing others' healthcare

SECURITY FEATURES:
• HIPAA-compliant data protection
• End-to-end encryption for all communications
• Secure authentication and password protection
• Biometric login support (fingerprint/face recognition)`,
    },
    {
      key: "navigation",
      title: "App Navigation",
      icon: "compass-outline",
      content: `MAIN NAVIGATION STRUCTURE:

BOTTOM TAB NAVIGATION:
1. Home Tab (Dashboard)
   • Main dashboard with overview of your health
   • Quick access to recent appointments and doctors
   • Health summary and upcoming consultations

2. Add Doctor Tab (QR Scanner)
   • Scan QR codes to add new healthcare providers
   • Connect with doctors and medical facilities
   • Floating Action Button (FAB) for easy access

3. Saved Doctors Tab
   • View all your connected healthcare providers
   • Access doctor profiles and contact information
   • Manage your healthcare provider network

SIDE DRAWER MENU:
Access by tapping the menu icon (☰) in the top-left corner:
• Dashboard - Return to main screen
• Profile - Manage your personal information
• Settings - App preferences and configurations
• Logout - Securely sign out of your account

HEADER NAVIGATION:
• Back Button: Navigate to previous screen
• Title: Current screen name
• Action Buttons: Screen-specific actions (save, edit, etc.)

GESTURE NAVIGATION:
• Swipe from left edge to open side drawer
• Pull down to refresh content on most screens
• Swipe left/right on cards for additional actions
• Pinch to zoom on images and documents`,
    },
    {
      key: "dashboard",
      title: "Dashboard Features",
      icon: "view-dashboard-outline",
      content: `DASHBOARD OVERVIEW:
Your central hub for all healthcare activities and information.

HEADER SECTION:
• Profile Picture: Tap to access your profile
• Welcome Message: Personalized greeting
• Menu Button: Access side drawer navigation
• Notifications: View important health alerts

QUICK ACTIONS:
• Book Appointment: Schedule new consultations
• Scan QR: Add new healthcare providers
• Symptom Survey: Report current symptoms
• Upload Documents: Add medical records

UPCOMING APPOINTMENTS:
• Next 3 scheduled appointments
• Date, time, and doctor information
• Tap to view appointment details
• Quick actions: Join video call, reschedule, cancel

RECENT APPOINTMENTS:
• Last 3 completed consultations
• Appointment summaries and outcomes
• Access to consultation notes and prescriptions
• Follow-up recommendations

SAVED DOCTORS:
• Your connected healthcare providers
• Quick access to doctor profiles
• Direct messaging and consultation booking
• Provider specialties and ratings

HEALTH SUMMARY:
• Recent symptom tracking results
• Medication reminders and schedules
• Vital signs and health metrics
• Upcoming health tasks and reminders

ADVERTISEMENT BANNER:
• Health tips and educational content
• Promotional offers and health programs
• Tap for more information

EMERGENCY NOTICE:
• Clear warning that app is not for emergencies
• Direct link to call 911 for urgent situations
• Emergency contact information`,
    },
    {
      key: "appointments",
      title: "Appointment Management",
      icon: "calendar-check-outline",
      content: `BOOKING APPOINTMENTS:

STEP-BY-STEP BOOKING PROCESS:
1. From Dashboard, tap "Book Appointment"
2. Select appointment type:
   • Video Consultation (Telemedicine)
   • In-Person Visit
   • Follow-up Appointment
   • Urgent Care

3. Choose your healthcare provider:
   • Browse available doctors
   • Filter by specialty, rating, availability
   • View doctor profiles and reviews
   • Select preferred provider

4. Select date and time:
   • View available time slots
   • Choose convenient appointment time
   • Consider time zone differences

5. Provide consultation details:
   • Reason for visit
   • Current symptoms
   • Medical history updates
   • Preferred consultation language

6. Review and confirm:
   • Verify appointment details
   • Confirm payment method
   • Submit booking request

APPOINTMENT TYPES:
• Video Consultations: Remote medical consultations
• In-Person Visits: Traditional office visits
• Follow-up Appointments: Continuing care sessions
• Urgent Care: Same-day or next-day appointments
• Specialist Referrals: Specialized medical care

APPOINTMENT MANAGEMENT:
• View all appointments in calendar format
• Reschedule appointments (subject to provider policy)
• Cancel appointments (cancellation policy applies)
• Add appointments to device calendar
• Set appointment reminders

APPOINTMENT CATEGORIES:
• Upcoming: Future scheduled appointments
• Completed: Past consultation history
• Cancelled: Cancelled appointment records
• Requested: Pending approval from providers

VIDEO CONSULTATION FEATURES:
• High-quality video and audio
• Screen sharing for document review
• Chat messaging during consultation
• Recording capabilities (with consent)
• Prescription and referral processing`,
    },
    {
      key: "symptom_tracking",
      title: "Symptom Tracking & Surveys",
      icon: "clipboard-pulse-outline",
      content: `COMPREHENSIVE SYMPTOM TRACKING:

SYMPTOM CATEGORIES:
1. General Symptoms:
   • Fever (temperature, duration, timing)
   • Cough (type, severity, frequency)
   • Headache (location, intensity, triggers)
   • Vomiting (frequency, content, color)
   • Hair Loss (pattern, severity)
   • Bleeding (location, amount, duration)
   • Injury (cause, pain level, mobility)
   • Burns (severity, location, treatment)

2. Body Parts Assessment:
   • Head and Face: Eyes, ears, nose, mouth
   • Torso: Chest, abdomen, back
   • Limbs: Arms, hands, legs, feet
   • Joints: Knees, elbows, ankles
   • Pain assessment for each body part

3. Body Excretion Monitoring:
   • Urination (frequency, color, pain)
   • Stool (consistency, color, frequency)
   • Menstrual cycle (flow, pain, irregularities)
   • Saliva and sputum changes
   • Sweat patterns and changes

4. Skin Conditions:
   • Rashes and irritations
   • Color changes and discoloration
   • Texture and surface changes
   • Wound healing progress

5. Other Health Indicators:
   • Sleep patterns and quality
   • Appetite changes
   • Weight fluctuations
   • Stress and anxiety levels
   • Concentration and memory
   • Fatigue and energy levels

SURVEY PROCESS:
1. Start Symptom Survey from Dashboard
2. Select relevant symptom categories
3. Answer detailed questions for each symptom
4. Provide duration and severity information
5. Upload photos if applicable
6. Review and submit survey
7. Option to add to existing appointment or create new one

QUESTION TYPES:
• Multiple Choice: Select from predefined options
• Rating Scales: Rate severity from 1-10
• Duration Tracking: Specify time periods
• Image Upload: Visual documentation
• Text Input: Additional details and descriptions
• Date/Time Selection: When symptoms started

SURVEY FEATURES:
• Save progress and continue later
• Edit responses before submission
• Add symptoms to appointment records
• Share results with healthcare providers
• Track symptom progression over time
• Generate health reports`,
    },
    {
      key: "doctor_management",
      title: "Doctor & Provider Management",
      icon: "doctor",
      content: `HEALTHCARE PROVIDER NETWORK:

ADDING DOCTORS:
1. QR Code Scanning:
   • Use the central FAB button to access QR scanner
   • Scan QR codes provided by healthcare facilities
   • Instant connection to verified providers
   • Automatic profile setup and verification

2. Manual Search:
   • Search by doctor name or specialty
   • Browse provider directories
   • Filter by location, ratings, availability
   • Send connection requests

DOCTOR PROFILES:
• Professional Information:
  - Full name and credentials
  - Medical specialties and certifications
  - Years of experience
  - Education and training background
  - Professional affiliations

• Practice Details:
  - Office locations and addresses
  - Contact information
  - Office hours and availability
  - Accepted insurance plans
  - Consultation fees and pricing

• Ratings and Reviews:
  - Patient ratings and feedback
  - Overall satisfaction scores
  - Specific skill assessments
  - Written reviews and testimonials

• Services Offered:
  - Types of consultations available
  - Telemedicine capabilities
  - Specialized treatments
  - Emergency availability

MANAGING YOUR DOCTORS:
• Saved Doctors List: View all connected providers
• Favorite Doctors: Mark preferred providers
• Recent Consultations: Access to consultation history
• Direct Messaging: Secure communication with providers
• Appointment Booking: Quick scheduling with saved doctors
• Provider Notes: Personal notes about each doctor

DOCTOR INTERACTIONS:
• Video Consultations: Face-to-face virtual meetings
• Secure Messaging: HIPAA-compliant communication
• File Sharing: Exchange medical documents safely
• Prescription Management: Receive and track prescriptions
• Referrals: Get referred to specialists
• Follow-up Scheduling: Book continuing care appointments

PROVIDER VERIFICATION:
• Licensed healthcare professionals only
• Credential verification and background checks
• State licensing verification
• Malpractice insurance confirmation
• Continuing education requirements`,
    },
    {
      key: "profile_management",
      title: "Profile & Account Management",
      icon: "account-cog-outline",
      content: `COMPREHENSIVE PROFILE MANAGEMENT:

PERSONAL INFORMATION:
• Basic Details:
  - Full name (first, middle, last)
  - Date of birth and age
  - Gender identity
  - Preferred pronouns
  - Profile photo

• Contact Information:
  - Email address (primary and secondary)
  - Phone numbers (mobile, home, work)
  - Emergency contact details
  - Preferred communication method

• Address Information:
  - Home address
  - Mailing address (if different)
  - Billing address
  - Work address (optional)

MEDICAL PROFILE:
• Medical History:
  - Chronic conditions and diseases
  - Previous surgeries and procedures
  - Family medical history
  - Genetic conditions and predispositions

• Current Medications:
  - Prescription medications
  - Over-the-counter drugs
  - Supplements and vitamins
  - Dosage and frequency information

• Allergies and Reactions:
  - Drug allergies and sensitivities
  - Food allergies and intolerances
  - Environmental allergies
  - Severity and reaction types

• Insurance Information:
  - Primary insurance provider
  - Secondary insurance (if applicable)
  - Policy numbers and group IDs
  - Coverage details and copay information

BEHALF ACCOUNT MANAGEMENT:
Create and manage profiles for family members or dependents:
• Add family member profiles
• Manage children's healthcare accounts
• Caregiver access for elderly relatives
• Permission and consent management
• Separate medical histories and records

PRIVACY SETTINGS:
• Data sharing preferences
• Communication preferences
• Marketing and promotional settings
• Third-party data sharing controls
• Account visibility settings

SECURITY SETTINGS:
• Password management
• Two-factor authentication setup
• Biometric login configuration
• Session management
• Device authorization

PROFILE EDITING:
• Easy-to-use form interfaces
• Photo upload and editing
• Bulk information updates
• Data validation and verification
• Save drafts and continue later`,
    },
    {
      key: "document_management",
      title: "Document & Record Management",
      icon: "file-document-multiple-outline",
      content: `COMPREHENSIVE DOCUMENT MANAGEMENT:

DOCUMENT TYPES:
• Medical Records:
  - Consultation notes and summaries
  - Diagnostic test results
  - Lab reports and blood work
  - Imaging studies (X-rays, MRIs, CT scans)
  - Pathology reports

• Personal Health Documents:
  - Vaccination records and immunization cards
  - Prescription histories
  - Allergy documentation
  - Medical device information
  - Health insurance cards

• External Documents:
  - Records from other healthcare providers
  - Hospital discharge summaries
  - Specialist consultation reports
  - Emergency room visit records
  - Physical therapy notes

UPLOADING DOCUMENTS:
1. Access Upload Document screen
2. Choose document source:
   • Camera: Take photos of physical documents
   • Gallery: Select existing photos
   • Files: Upload PDF and other file types
   • Scanner: Use built-in document scanner

3. Document categorization:
   • Select document type
   • Add descriptive tags
   • Specify date and provider
   • Add personal notes

4. Quality control:
   • Image enhancement and cropping
   • Text recognition and extraction
   • File compression and optimization
   • Privacy and security scanning

DOCUMENT ORGANIZATION:
• Folder Structure: Organize by type, date, or provider
• Search Functionality: Find documents quickly
• Tagging System: Custom tags for easy categorization
• Date Sorting: Chronological organization
• Provider Association: Link documents to specific doctors

SHARING AND ACCESS:
• Share with Healthcare Providers: Secure document sharing
• Family Access: Allow family members to view documents
• Emergency Access: Critical documents for emergencies
• Export Options: Download or email documents
• Print Functionality: Print documents when needed

DOCUMENT SECURITY:
• End-to-end encryption for all documents
• Secure cloud storage with backup
• Access controls and permissions
• Audit trails for document access
• HIPAA-compliant storage and handling

DOCUMENT FEATURES:
• OCR (Optical Character Recognition): Extract text from images
• Annotation Tools: Add notes and highlights
• Version Control: Track document updates
• Automatic Backup: Cloud synchronization
• Offline Access: View documents without internet`,
    },
    {
      key: "communication",
      title: "Communication Features",
      icon: "chat-processing-outline",
      content: `SECURE HEALTHCARE COMMUNICATION:

VIDEO CONSULTATIONS:
• High-Definition Video Calls:
  - Crystal clear video quality
  - Professional-grade audio
  - Automatic quality adjustment
  - Low-bandwidth optimization

• Consultation Features:
  - Screen sharing capabilities
  - Document review during calls
  - Real-time chat messaging
  - Consultation recording (with consent)
  - Multi-participant calls (family consultations)

• Technical Requirements:
  - Stable internet connection
  - Camera and microphone permissions
  - Quiet, well-lit environment
  - Privacy and confidentiality

SECURE MESSAGING:
• HIPAA-Compliant Messaging:
  - End-to-end encrypted communications
  - Secure message delivery
  - Read receipts and delivery confirmations
  - Message history and archives

• Message Types:
  - Text messages and conversations
  - Photo and document sharing
  - Voice messages and audio notes
  - Video messages and updates
  - Appointment requests and confirmations

COMMUNICATION PREFERENCES:
• Notification Settings:
  - Push notifications for messages
  - Email notifications for important updates
  - SMS alerts for appointments
  - Emergency contact preferences

• Language Preferences:
  - Multi-language support
  - Translation services
  - Cultural sensitivity options
  - Interpreter services coordination

EMERGENCY COMMUNICATION:
• Emergency Contacts:
  - Primary and secondary emergency contacts
  - Medical emergency information
  - ICE (In Case of Emergency) details
  - Healthcare proxy information

• Crisis Support:
  - Mental health crisis resources
  - Suicide prevention hotlines
  - Emergency medical services
  - Local emergency room information

COMMUNICATION ETIQUETTE:
• Professional Communication Guidelines
• Response time expectations
• Appropriate message content
• Privacy and confidentiality rules
• Emergency vs. non-emergency communications`,
    },
    {
      key: "settings_preferences",
      title: "Settings & Preferences",
      icon: "cog-outline",
      content: `COMPREHENSIVE APP SETTINGS:

ACCOUNT SETTINGS:
• Profile Management:
  - Edit personal information
  - Update contact details
  - Change profile photo
  - Manage family accounts

• Security Settings:
  - Change password
  - Enable two-factor authentication
  - Biometric login setup
  - Session management
  - Device authorization

• Privacy Controls:
  - Data sharing preferences
  - Marketing communication settings
  - Third-party integrations
  - Account visibility options

NOTIFICATION PREFERENCES:
• Push Notifications:
  - Appointment reminders
  - Message notifications
  - Health alerts and updates
  - Medication reminders

• Email Notifications:
  - Appointment confirmations
  - Health reports and summaries
  - Newsletter and health tips
  - System updates and announcements

• SMS Notifications:
  - Emergency alerts
  - Appointment confirmations
  - Two-factor authentication codes
  - Critical health updates

APP PREFERENCES:
• Display Settings:
  - Theme selection (light/dark mode)
  - Font size and accessibility
  - Language and localization
  - Color scheme preferences

• Functionality Settings:
  - Default appointment duration
  - Automatic symptom tracking
  - Document auto-upload
  - Backup and sync preferences

• Accessibility Features:
  - Screen reader compatibility
  - High contrast mode
  - Large text options
  - Voice control integration

HEALTH PREFERENCES:
• Measurement Units:
  - Imperial vs. metric units
  - Temperature scale (Fahrenheit/Celsius)
  - Weight and height units
  - Time format preferences

• Health Tracking:
  - Automatic health data sync
  - Wearable device integration
  - Medication reminder settings
  - Symptom tracking frequency

SUPPORT AND HELP:
• Help Center: Access to user guides and FAQs
• Contact Support: Multiple support channels
• Feedback System: Rate and review the app
• Tutorial and Onboarding: Guided app tour
• Terms and Privacy: Legal documents and policies`,
    },
    {
      key: "health_tracking",
      title: "Health Monitoring & Tracking",
      icon: "heart-pulse",
      content: `COMPREHENSIVE HEALTH MONITORING:

VITAL SIGNS TRACKING:
• Blood Pressure Monitoring:
  - Systolic and diastolic readings
  - Date and time stamps
  - Trend analysis and graphs
  - Normal range indicators

• Heart Rate Monitoring:
  - Resting heart rate
  - Exercise heart rate
  - Heart rate variability
  - Irregular rhythm detection

• Temperature Tracking:
  - Body temperature readings
  - Fever tracking and alerts
  - Temperature trend analysis
  - Multiple measurement methods

• Weight and BMI:
  - Weight tracking over time
  - BMI calculations
  - Weight goal setting
  - Progress visualization

SYMPTOM PROGRESSION:
• Chronic Condition Monitoring:
  - Daily symptom severity ratings
  - Medication effectiveness tracking
  - Trigger identification
  - Flare-up pattern recognition

• Pain Management:
  - Pain location mapping
  - Pain intensity scales (1-10)
  - Pain trigger identification
  - Treatment effectiveness tracking

• Mental Health Tracking:
  - Mood and emotional state
  - Anxiety and stress levels
  - Sleep quality assessment
  - Energy and motivation levels

MEDICATION MANAGEMENT:
• Prescription Tracking:
  - Current medications list
  - Dosage and frequency
  - Refill reminders
  - Side effect monitoring

• Medication Adherence:
  - Dose taking reminders
  - Missed dose tracking
  - Adherence percentage
  - Improvement suggestions

• Drug Interaction Checking:
  - Automatic interaction alerts
  - Food and drug interactions
  - Allergy warnings
  - Contraindication notifications

HEALTH REPORTS:
• Automated Health Summaries:
  - Weekly and monthly reports
  - Trend analysis and insights
  - Progress toward health goals
  - Recommendations for improvement

• Shareable Reports:
  - Provider-ready health summaries
  - Appointment preparation reports
  - Emergency medical information
  - Insurance claim documentation

INTEGRATION CAPABILITIES:
• Wearable Device Sync:
  - Fitness tracker integration
  - Smartwatch compatibility
  - Automatic data import
  - Real-time health monitoring

• Health App Integration:
  - Apple Health compatibility
  - Google Fit synchronization
  - Third-party app connections
  - Data consolidation`,
    },
    {
      key: "emergency_features",
      title: "Emergency & Safety Features",
      icon: "shield-alert-outline",
      content: `EMERGENCY PREPAREDNESS AND SAFETY:

EMERGENCY CONTACTS:
• Primary Emergency Contact:
  - Name and relationship
  - Multiple phone numbers
  - Email address
  - Physical address

• Secondary Emergency Contacts:
  - Backup emergency contacts
  - Healthcare proxy information
  - Power of attorney details
  - Medical decision makers

• Healthcare Provider Emergency Info:
  - Primary care physician
  - Specialist contacts
  - Preferred hospital
  - Insurance emergency contacts

MEDICAL EMERGENCY INFORMATION:
• Critical Medical Data:
  - Blood type and Rh factor
  - Critical allergies and reactions
  - Current medications
  - Medical conditions and implants

• Emergency Medical ID:
  - Accessible from lock screen
  - Critical health information
  - Emergency contact numbers
  - Medical alert bracelet info

• DNR and Advanced Directives:
  - Do Not Resuscitate orders
  - Living will information
  - Healthcare proxy documentation
  - End-of-life preferences

CRISIS SUPPORT RESOURCES:
• Mental Health Crisis:
  - National Suicide Prevention Lifeline
  - Crisis text line numbers
  - Local mental health services
  - Emergency psychiatric care

• Domestic Violence Resources:
  - National domestic violence hotline
  - Local shelter information
  - Safety planning resources
  - Legal assistance contacts

• Substance Abuse Support:
  - Addiction crisis hotlines
  - Detox and treatment centers
  - Support group information
  - Recovery resources

EMERGENCY PROCEDURES:
• When to Call 911:
  - Life-threatening emergencies
  - Severe injuries or trauma
  - Loss of consciousness
  - Severe allergic reactions
  - Heart attack or stroke symptoms

• Poison Control:
  - National poison control number
  - What to do in poisoning cases
  - Common household dangers
  - Pet poisoning resources

• Natural Disaster Preparedness:
  - Emergency kit recommendations
  - Evacuation planning
  - Communication plans
  - Medical supply preparations

SAFETY FEATURES:
• Location Services:
  - Emergency location sharing
  - Find nearest hospital
  - Emergency services mapping
  - Family location sharing

• Emergency Alerts:
  - Automatic emergency detection
  - Fall detection (if supported)
  - Panic button functionality
  - Silent emergency alerts`,
    },
    {
      key: "troubleshooting",
      title: "Troubleshooting & Support",
      icon: "wrench-outline",
      content: `COMMON ISSUES AND SOLUTIONS:

LOGIN AND ACCOUNT ISSUES:
• Forgot Password:
  1. Tap "Forgot Password" on login screen
  2. Enter your registered email address
  3. Check email for reset instructions
  4. Follow link to create new password
  5. Log in with new credentials

• Account Locked:
  - Wait 30 minutes before retry
  - Contact support if problem persists
  - Verify email and phone number
  - Update security information

• Email Verification Issues:
  - Check spam/junk folder
  - Request new verification email
  - Ensure correct email address
  - Contact support for manual verification

VIDEO CALL PROBLEMS:
• Poor Video Quality:
  - Check internet connection speed
  - Close other bandwidth-heavy apps
  - Switch from WiFi to cellular (or vice versa)
  - Restart the app
  - Ensure good lighting

• Audio Issues:
  - Check microphone permissions
  - Test device microphone in other apps
  - Check volume settings
  - Use headphones if available
  - Restart device if necessary

• Connection Problems:
  - Test internet connectivity
  - Move closer to WiFi router
  - Switch networks if available
  - Clear app cache and data
  - Update app to latest version

APP PERFORMANCE ISSUES:
• App Crashes or Freezes:
  - Force close and restart app
  - Restart your device
  - Check for app updates
  - Clear app cache
  - Reinstall app if necessary

• Slow Loading:
  - Check internet connection
  - Close background apps
  - Free up device storage space
  - Update app and operating system
  - Contact support if problem persists

• Sync Issues:
  - Check internet connection
  - Manually refresh data
  - Log out and log back in
  - Verify account permissions
  - Contact support for data recovery

DOCUMENT AND FILE ISSUES:
• Upload Failures:
  - Check file size (max 10MB)
  - Ensure supported file format
  - Check internet connection
  - Try different upload method
  - Compress large files

• Image Quality Problems:
  - Use good lighting when taking photos
  - Hold device steady
  - Clean camera lens
  - Use document scanner feature
  - Retake photo if blurry

GETTING HELP:
• In-App Support:
  - Access Help section in Settings
  - Browse FAQ and tutorials
  - Submit support ticket
  - Live chat support (when available)

• Contact Methods:
  - Email: support@tellyoudoc.com
  - Phone: +1 (555) 123-4567
  - Website: www.tellyoudoc.com/support
  - Social media support channels

• Support Hours:
  - General support: 24/7 via email
  - Phone support: Monday-Friday 8 AM-8 PM EST
  - Live chat: Monday-Friday 9 AM-6 PM EST
  - Emergency technical support: 24/7`,
    },
    {
      key: "tips_best_practices",
      title: "Tips & Best Practices",
      icon: "lightbulb-on-outline",
      content: `MAXIMIZING YOUR TELLYOUDOC EXPERIENCE:

PREPARATION FOR CONSULTATIONS:
• Before Your Appointment:
  - Prepare list of questions and concerns
  - Gather relevant medical documents
  - Test your video call setup
  - Find quiet, private location
  - Have insurance information ready

• During Video Consultations:
  - Ensure good lighting on your face
  - Maintain eye contact with camera
  - Speak clearly and at normal pace
  - Have pen and paper for notes
  - Ask questions if unclear

• After Your Consultation:
  - Review consultation notes
  - Follow prescribed treatment plans
  - Set medication reminders
  - Schedule follow-up appointments
  - Update your health profile

EFFECTIVE SYMPTOM TRACKING:
• Be Consistent:
  - Track symptoms daily at same time
  - Use the same measurement methods
  - Rate symptoms honestly and accurately
  - Include environmental factors
  - Note medication timing

• Provide Detailed Information:
  - Describe symptoms specifically
  - Include duration and frequency
  - Note triggers and relieving factors
  - Rate pain and discomfort levels
  - Upload photos when helpful

• Track Patterns:
  - Look for symptom trends
  - Note seasonal variations
  - Identify trigger patterns
  - Monitor treatment effectiveness
  - Share insights with providers

MAINTAINING HEALTH RECORDS:
• Document Organization:
  - Scan documents in good lighting
  - Use descriptive file names
  - Organize by date and type
  - Create backup copies
  - Regular system cleanup

• Record Keeping:
  - Update medication lists regularly
  - Record all healthcare visits
  - Note any adverse reactions
  - Track vaccination history
  - Maintain insurance information

SECURITY BEST PRACTICES:
• Account Security:
  - Use strong, unique passwords
  - Enable two-factor authentication
  - Log out on shared devices
  - Review account activity regularly
  - Update contact information

• Privacy Protection:
  - Review privacy settings regularly
  - Be cautious with information sharing
  - Understand data usage policies
  - Report suspicious activity
  - Keep app updated

COMMUNICATION ETIQUETTE:
• Professional Communication:
  - Use respectful language
  - Be clear and concise
  - Respond promptly to messages
  - Provide complete information
  - Follow up appropriately

• Emergency vs. Routine:
  - Use emergency services for urgent issues
  - Schedule appointments for routine care
  - Use messaging for simple questions
  - Respect provider response times
  - Understand consultation limitations

OPTIMIZING APP PERFORMANCE:
• Device Maintenance:
  - Keep app updated
  - Maintain adequate storage space
  - Restart app regularly
  - Clear cache periodically
  - Update device operating system

• Network Optimization:
  - Use stable internet connection
  - Test connection before video calls
  - Have backup connection method
  - Close unnecessary apps during calls
  - Consider WiFi vs. cellular usage`,
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
        title="User Manual"
        onBackPress={() => navigation.goBack()}
        gradientColors={["#01869e", "#3cb0c4"]}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <MaterialCommunityIcons
            name="book-open-page-variant-outline"
            size={48}
            color={COLORS.headingColor}
          />
          <Text style={styles.headerTitle}>TellYouDoc User Manual</Text>
          <Text style={styles.headerSubtitle}>Complete guide to using your healthcare app</Text>
          <Text style={styles.headerDescription}>
            This comprehensive manual covers all features and functionality of the TellYouDoc
            healthcare application. Tap on any section below to learn more.
          </Text>
        </View>

        {/* Quick Navigation */}
        <View style={styles.quickNavSection}>
          <Text style={styles.quickNavTitle}>Quick Navigation</Text>
          <View style={styles.quickNavGrid}>
            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => toggleSection("getting_started")}
            >
              <MaterialCommunityIcons
                name="rocket-launch-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.quickNavText}>Getting Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => toggleSection("appointments")}
            >
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={24}
                color={COLORS.success}
              />
              <Text style={styles.quickNavText}>Appointments</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => toggleSection("symptom_tracking")}
            >
              <MaterialCommunityIcons
                name="clipboard-pulse-outline"
                size={24}
                color={COLORS.accent}
              />
              <Text style={styles.quickNavText}>Symptoms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => toggleSection("troubleshooting")}
            >
              <MaterialCommunityIcons name="wrench-outline" size={24} color={COLORS.warning} />
              <Text style={styles.quickNavText}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.overviewTitle}>App Overview</Text>
          <Surface style={styles.overviewCard}>
            <Text style={styles.overviewText}>
              TellYouDoc is a comprehensive healthcare application that connects you with licensed
              healthcare providers for virtual consultations, symptom tracking, appointment
              management, and secure health record storage. The app is designed to make healthcare
              more accessible, convenient, and efficient while maintaining the highest standards of
              privacy and security.
            </Text>
            <View style={styles.featureHighlights}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="video" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Video Consultations</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="calendar-heart" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Appointment Management</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="clipboard-text" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Symptom Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="shield-lock" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Secure Records</Text>
              </View>
            </View>
          </Surface>
        </View>

        {/* Manual Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Complete User Guide</Text>
          {manualSections.map(renderSection)}
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Need additional help? Contact our support team at support@tellyoudoc.com or call +1
            (555) 123-4567
          </Text>
          <Text style={styles.footerVersion}>Manual Version 1.0 | App Version 1.0.0</Text>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: FontSize.heading_H1,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginTop: 12,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: FontSize.heading_H3,
    fontFamily: FontFamily.Inter_SemiBold,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
  },
  headerDescription: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  quickNavSection: {
    marginBottom: 24,
  },
  quickNavTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 16,
  },
  quickNavGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickNavItem: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  quickNavText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.text,
    marginTop: 8,
    textAlign: "center",
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 16,
  },
  overviewCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  overviewText: {
    fontSize: FontSize.body_Text,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureHighlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  featureText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Medium,
    color: COLORS.text,
    marginLeft: 8,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionsTitle: {
    fontSize: FontSize.heading_H2,
    fontFamily: FontFamily.Inter_Bold,
    color: COLORS.headingColor,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  footerVersion: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.Inter_Regular,
    color: COLORS.textLighter,
    textAlign: "center",
  },
});

export default Manual;
