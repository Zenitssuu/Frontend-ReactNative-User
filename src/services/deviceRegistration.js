import { Platform } from "react-native";
import * as Device from "expo-device";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "./api";

export const registerDeviceForNotifications = async (showErrors = true) => {
  try {
    // Check if physical device
    if (!Device.isDevice) {
      console.log("Device registration skipped: Not a physical device");
      return false;
    }

    // Get FCM token
    const messaging = getMessaging();
    const fcmToken = await getToken(messaging);

    if (!fcmToken) {
      console.log("Device registration failed: No FCM token received");
      return false;
    }

    // Get device information
    const deviceName = Device.deviceName || `${Device.brand} ${Device.modelName}`;
    const deviceId = Device.osBuildId || Device.osInternalBuildId || `${Platform.OS}-${Date.now()}`;

    // Prepare device registration data
    const deviceData = {
      fcmToken: fcmToken,
      deviceName: deviceName.substring(0, 50),
      deviceId: deviceId,
    };

    // Register device with your backend API
    const response = await apiService.notificationService.registerDevice(deviceData);

    if (response.status === 200 || response.status === 201) {
      console.log("Device registered successfully for notifications");

      // Store registration status locally
      await AsyncStorage.setItem("deviceRegistrationStatus", "registered");
      await AsyncStorage.setItem("registeredFCMToken", fcmToken);

      return true;
    }

    return false;
  } catch (error) {
    console.error("Device registration error:", error);
    return false;
  }
};

export const isDeviceRegistered = async () => {
  try {
    const registrationStatus = await AsyncStorage.getItem("deviceRegistrationStatus");
    const storedFCMToken = await AsyncStorage.getItem("registeredFCMToken");

    if (registrationStatus === "registered" && storedFCMToken) {
      // Verify the FCM token is still valid
      const messaging = getMessaging();
      const currentFCMToken = await getToken(messaging);

      // If token has changed, need to re-register
      if (currentFCMToken !== storedFCMToken) {
        console.log("FCM token has changed, need to re-register");
        return false;
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking device registration status:", error);
    return false;
  }
};

export const unregisterDeviceFromNotifications = async (showErrors = true) => {
  try {
    const storedFCMToken = await AsyncStorage.getItem("registeredFCMToken");

    if (storedFCMToken) {
      // Call your backend API to unregister
      await apiService.notificationService.unregisterDevice({
        fcmToken: storedFCMToken,
      });
    }

    // Clear local registration status
    await AsyncStorage.removeItem("deviceRegistrationStatus");
    await AsyncStorage.removeItem("registeredFCMToken");

    return true;
  } catch (error) {
    console.error("Device unregistration error:", error);
    // Clear local data even if API call failed
    await AsyncStorage.removeItem("deviceRegistrationStatus");
    await AsyncStorage.removeItem("registeredFCMToken");
    return false;
  }
};
