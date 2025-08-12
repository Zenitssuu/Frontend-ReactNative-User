import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import firebaseApp from "@react-native-firebase/app";
import { getMessaging } from "@react-native-firebase/messaging";

// Initialize Firebase - it will auto-configure from google-services.json
let firebaseInitialized = false;

export const initializeNotificationService = async () => {
  try {
    // Initialize Firebase App (auto-configures from google-services.json)
    if (!firebaseInitialized) {
      // Firebase will automatically initialize from google-services.json
      // No manual config needed
      firebaseInitialized = true;
      // console.log("✅ Firebase initialized from google-services.json");
    }

    // Configure Expo Notifications
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Configure notification channel for Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });

      // Create high priority channel for urgent notifications
      await Notifications.setNotificationChannelAsync("urgent", {
        name: "Urgent Notifications",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        bypassDnd: true,
      });

      // Create appointment reminders channel
      await Notifications.setNotificationChannelAsync("appointments", {
        name: "Appointment Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0077B6",
        sound: "default",
      });
    }

    // console.log("✅ Notification service initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Error initializing notification service:", error);
    return false;
  }
};

// Get Firebase messaging instance safely
export const getFirebaseMessaging = () => {
  try {
    return getMessaging();
  } catch (error) {
    console.error("Error getting Firebase messaging:", error);
    return null;
  }
};

// Schedule local notification
export const scheduleLocalNotification = async (title, body, data = {}, delay = 0) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: "default",
      },
      trigger: delay > 0 ? { seconds: delay } : null,
    });
  } catch (error) {
    console.error("Error scheduling local notification:", error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    // console.log("All notifications cancelled");
  } catch (error) {
    console.error("Error cancelling notifications:", error);
  }
};

export default {
  initializeNotificationService,
  getFirebaseMessaging,
  scheduleLocalNotification,
  cancelAllNotifications,
};
