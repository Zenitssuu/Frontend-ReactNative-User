import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useNotificationSetup from "./NotificationSetup";

/**
 * Component to handle notification setup based on user login status
 * This should be used within your App component or navigation wrapper
 */
const NotificationManager = () => {
  // Get user login status from Redux
  const userProfile = useSelector(state => state.user.profile);
  const isLoggedIn = Boolean(userProfile && Object.keys(userProfile).length > 0);

  // Initialize notification setup with current login status
  const notificationData = useNotificationSetup(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("🔑 User logged in - Notification setup:", {
        isInitialized: notificationData.isInitialized,
        isRegistered: notificationData.isRegistered,
        hasToken: !!notificationData.fcmToken,
        permissionStatus: notificationData.permissionStatus,
      });
    } else {
      console.log("🚪 User logged out - Notifications will be cleaned up");
    }
  }, [isLoggedIn, notificationData]);

  // This component doesn't render anything - it just manages notifications
  return null;
};

export default NotificationManager;
