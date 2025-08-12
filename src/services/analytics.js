import analytics from "@react-native-firebase/analytics";

class AnalyticsService {
  /**
   * Initialize Analytics (if needed)
   * This is called automatically when the module is imported
   */
  static async initialize() {
    try {
      // Enable analytics collection (useful if you disabled auto-collection)
      await analytics().setAnalyticsCollectionEnabled(true);

      // Set user consent (GDPR compliance)
      await analytics().setConsent({
        analytics_storage: true,
        ad_storage: true,
        ad_user_data: true,
        ad_personalization: true,
      });

      console.log("Firebase Analytics initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Firebase Analytics:", error);
    }
  }

  /**
   * Log a custom event
   * @param {string} eventName - The name of the event
   * @param {object} parameters - Event parameters
   */
  static async logEvent(eventName, parameters = {}) {
    try {
      await analytics().logEvent(eventName, parameters);
      console.log(`Analytics event logged: ${eventName}`, parameters);
    } catch (error) {
      console.error(`Failed to log analytics event: ${eventName}`, error);
    }
  }

  /**
   * Set user properties
   * @param {object} properties - User properties
   */
  static async setUserProperties(properties) {
    try {
      for (const [key, value] of Object.entries(properties)) {
        await analytics().setUserProperty(key, value);
      }
      console.log("User properties set:", properties);
    } catch (error) {
      console.error("Failed to set user properties:", error);
    }
  }

  /**
   * Set user ID
   * @param {string} userId - The user ID
   */
  static async setUserId(userId) {
    try {
      await analytics().setUserId(userId);
      console.log("User ID set:", userId);
    } catch (error) {
      console.error("Failed to set user ID:", error);
    }
  }

  /**
   * Log screen view
   * @param {string} screenName - The name of the screen
   * @param {string} screenClass - The class of the screen (optional)
   */
  static async logScreenView(screenName, screenClass = screenName) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass,
      });
      console.log(`Screen view logged: ${screenName}`);
    } catch (error) {
      console.error(`Failed to log screen view: ${screenName}`, error);
    }
  }

  // Predefined events for healthcare/medical apps

  /**
   * Log when user books an appointment
   * @param {object} appointmentData - Appointment details
   */
  static async logAppointmentBooked(appointmentData) {
    await this.logEvent("appointment_booked", {
      doctor_id: appointmentData.doctorId || null,
      specialty: appointmentData.specialty || null,
      appointment_type: appointmentData.type || null,
      booking_method: appointmentData.bookingMethod || "app",
    });
  }

  /**
   * Log when user submits symptoms
   * @param {object} symptomsData - Symptoms details
   */
  static async logSymptomsSubmitted(symptomsData) {
    await this.logEvent("symptoms_submitted", {
      symptom_count: symptomsData.count || 0,
      body_parts: symptomsData.bodyParts || [],
      has_images: symptomsData.hasImages || false,
      submission_method: symptomsData.method || "manual",
    });
  }

  /**
   * Log when user views doctor profile
   * @param {object} doctorData - Doctor details
   */
  static async logDoctorProfileViewed(doctorData) {
    await this.logEvent("doctor_profile_viewed", {
      doctor_id: doctorData.id || null,
      specialty: doctorData.specialty || null,
      rating: doctorData.rating || null,
    });
  }

  /**
   * Log when user uploads a document
   * @param {object} documentData - Document details
   */
  static async logDocumentUploaded(documentData) {
    await this.logEvent("document_uploaded", {
      document_type: documentData.type || null,
      file_size_mb: documentData.sizeMB || null,
      upload_method: documentData.method || "picker",
    });
  }

  /**
   * Log login event
   * @param {string} method - Login method (email, phone, social, etc.)
   */
  static async logLogin(method = "email") {
    await analytics().logLogin({
      method: method,
    });
  }

  /**
   * Log sign up event
   * @param {string} method - Sign up method
   */
  static async logSignUp(method = "email") {
    await analytics().logSignUp({
      method: method,
    });
  }

  /**
   * Log when user searches
   * @param {string} searchTerm - What the user searched for
   */
  static async logSearch(searchTerm) {
    await analytics().logSearch({
      search_term: searchTerm,
    });
  }

  /**
   * Get app instance ID
   * @returns {string|null} App instance ID
   */
  static async getAppInstanceId() {
    try {
      return await analytics().getAppInstanceId();
    } catch (error) {
      console.error("Failed to get app instance ID:", error);
      return null;
    }
  }
}

export default AnalyticsService;
