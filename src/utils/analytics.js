import AnalyticsService from "../services/analytics";

// Initialize Firebase Analytics when the app starts
const initializeAnalytics = async () => {
  try {
    await AnalyticsService.initialize();
    console.log("Analytics initialized successfully");
  } catch (error) {
    console.error("Failed to initialize analytics:", error);
  }
};

export { initializeAnalytics, AnalyticsService };
