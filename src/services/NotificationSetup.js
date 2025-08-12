import { useEffect, useState, useRef } from "react";
import { Alert, Platform, Linking, PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import {
  getMessaging,
  onMessage,
  getToken,
  onTokenRefresh,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import {
  registerDeviceForNotifications,
  isDeviceRegistered,
  unregisterDeviceFromNotifications,
} from "./deviceRegistration";
import { initializeNotificationService } from "./notificationService";

// Navigation reference for handling notification taps
let navigationRef = null;

export const setNavigationRef = ref => {
  navigationRef = ref;
};

// Initialize notification service on app start
const initNotificationService = async () => {
  try {
    // For development, notifications are always enabled
    // google-services.json will handle Firebase configuration
    // console.log("📱 Notifications enabled - using google-services.json configuration");

    // Initialize notification service
    await initializeNotificationService();
    return true;
  } catch (error) {
    console.error("❌ Error initializing notification service:", error);
    return false;
  }
};

const useNotificationSetup = (isLoggedIn = false) => {
  const [fcmToken, setFcmToken] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitialMount = useRef(true);

  // Initialize notification service on first load
  useEffect(() => {
    const initService = async () => {
      const initialized = await initNotificationService();
      setIsInitialized(initialized);
    };
    initService();
  }, []);

  // Request notification permissions
  const requestNotificationPermission = async () => {
    try {
      if (!Device.isDevice) {
        // console.log("Notifications require physical device");
        return false;
      }

      const messaging = getMessaging();

      if (Platform.OS === "ios") {
        const authStatus = await messaging.requestPermission();
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;
        setPermissionStatus(authStatus);
        return enabled;
      } else {
        // Android 13+ requires POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return false;
          }
        }

        const authStatus = await messaging.hasPermission();
        setPermissionStatus(authStatus);

        if (authStatus === AuthorizationStatus.NOT_DETERMINED) {
          const newAuthStatus = await messaging.requestPermission();
          setPermissionStatus(newAuthStatus);
          return newAuthStatus === AuthorizationStatus.AUTHORIZED;
        }

        return authStatus === AuthorizationStatus.AUTHORIZED;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  // Setup notification listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    const messagingInstance = getMessaging();

    // Foreground message handler
    const unsubscribeOnMessage = onMessage(messagingInstance, async remoteMessage => {
      // console.log("Notification received in foreground:", remoteMessage);

      // Display notification in foreground using Expo Notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || "New Notification",
          body: remoteMessage.notification?.body || "",
          data: remoteMessage.data,
          sound: "default",
        },
        trigger: null,
      });
    });

    // Background notification handler
    const unsubscribeOnNotificationOpenedApp = messagingInstance.onNotificationOpenedApp(
      remoteMessage => {
        // console.log("Notification opened app from background:", remoteMessage);
        handleNotificationNavigation(remoteMessage.data);
      }
    );

    // App opened from killed state
    messagingInstance.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        // console.log("Notification opened app from killed state:", remoteMessage);
        handleNotificationNavigation(remoteMessage.data);
      }
    });

    // Expo notification response (when user taps notification)
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        if (data) {
          handleNotificationNavigation(data);
        }
      }
    );

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
      notificationResponseListener.remove();
    };
  }, [isLoggedIn]);

  // Token registration and refresh
  useEffect(() => {
    if (!isLoggedIn || !isInitialized) return;

    const setupTokens = async () => {
      if (!isInitialMount.current) return;
      isInitialMount.current = false;

      try {
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted) {
          // console.log("📵 Notification permission not granted");
          return;
        }

        // Check if device is already registered
        const alreadyRegistered = await isDeviceRegistered();
        if (alreadyRegistered) {
          // console.log("✅ Device already registered for notifications");
          setIsRegistered(true);

          // Get current token for state
          const messaging = getMessaging();
          const token = await getToken(messaging);
          if (token) {
            setFcmToken(token);
            // console.log("🔑 FCM Token retrieved");
          }
          return;
        }

        // Register device for the first time
        // console.log("📝 Registering device for notifications...");
        const success = await registerDeviceForNotifications();
        setIsRegistered(success);

        if (success) {
          // Get the token for state
          const messaging = getMessaging();
          const token = await getToken(messaging);
          if (token) {
            setFcmToken(token);
            // console.log("✅ Device registered and token obtained");
          }
        } else {
          console.error("❌ Failed to register device");
        }

        // Listen for token refresh
        const messaging = getMessaging();
        const unsubscribeTokenRefresh = onTokenRefresh(messaging, async newToken => {
          // console.log("🔄 FCM token refreshed");
          setFcmToken(newToken);
          // Update token in backend
          const updateSuccess = await registerDeviceForNotifications();
          if (updateSuccess) {
            // console.log("✅ Token updated successfully in backend");
          } else {
            console.error("❌ Failed to update token in backend");
          }
        });

        return unsubscribeTokenRefresh;
      } catch (error) {
        console.error("❌ Error in notification setup:", error);
        setIsRegistered(false);
      }
    };

    setupTokens();
  }, [isLoggedIn, isInitialized]);

  // Cleanup when user logs out
  useEffect(() => {
    if (!isLoggedIn && isRegistered) {
      // User logged out, unregister device
      const cleanup = async () => {
        try {
          await unregisterDeviceFromNotifications();
          setIsRegistered(false);
          setFcmToken("");
          // console.log("Device unregistered due to logout");
        } catch (error) {
          console.error("Error unregistering device on logout:", error);
        }
      };
      cleanup();
    }
  }, [isLoggedIn, isRegistered]);

  return {
    fcmToken,
    isRegistered,
    permissionStatus,
    isInitialized,
    requestPermission: requestNotificationPermission,
    unregisterDevice: unregisterDeviceFromNotifications,
  };
};

// Navigation handler for notification taps
const handleNotificationNavigation = data => {
  if (!navigationRef || !navigationRef.isReady()) {
    AsyncStorage.setItem("pendingNotification", JSON.stringify(data));
    return;
  }

  const notificationType = data?.type || "";

  switch (notificationType.toLowerCase()) {
    case "appointment":
      navigationRef.navigate("Appointments");
      break;
    case "message":
      navigationRef.navigate("Messages");
      break;
    case "report":
      navigationRef.navigate("Reports");
      break;
    default:
      navigationRef.navigate("Home");
      break;
  }
};

// Handle pending notifications when navigation is ready
export const handlePendingNotification = async () => {
  try {
    const pendingNotificationData = await AsyncStorage.getItem("pendingNotification");
    if (pendingNotificationData && navigationRef?.isReady()) {
      const data = JSON.parse(pendingNotificationData);
      handleNotificationNavigation(data);
      await AsyncStorage.removeItem("pendingNotification");
    }
  } catch (error) {
    console.error("Error handling pending notification:", error);
  }
};

export default useNotificationSetup;
