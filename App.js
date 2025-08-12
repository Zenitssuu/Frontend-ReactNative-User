import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { store } from "./src/Redux/Store";
import { Provider } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";
// Import our app navigator
import AppNavigator from "./src/navigations/AppNavigator";
// Import notification manager
import NotificationManager from "./src/services/NotificationManager";
// Import analytics initialization
import { initializeAnalytics } from "./src/utils/analytics";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://308f3f728c95d5fe320fc03253bbfd18@o4509570918907904.ingest.us.sentry.io/4509653804843008",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Define our app theme with updated medical color scheme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0077B6",
    accent: "#03045E",
    background: "#F9F9F9",
    surface: "#FFFFFF",
    lightBlue: "#EBFAFF",
    text: "#333333",
    placeholder: "#888888",
    disabled: "#CCCCCC",
    notification: "#FF4757",
  },
  roundness: 10,
};

export default Sentry.wrap(function App() {
  // Create navigation reference
  const navigationRef = useRef(null);
  // Track processed deep links to prevent loops
  const processedUrls = useRef(new Set());

  // Initialize Firebase Analytics on app start
  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      console.log("Deep link received:", url);

      // Check if this is an Expo development URL and ignore it
      if (url.includes("expo-development-client")) {
        console.log("Ignoring Expo development URL");
        return;
      }

      // Check if we've already processed this URL to prevent loops
      if (processedUrls.current.has(url)) {
        console.log("Deep link already processed, ignoring:", url);
        return;
      }

      // Mark URL as processed
      processedUrls.current.add(url);

      const { queryParams } = Linking.parse(url);
      console.log("Parsed queryParams:", queryParams);

      // Also try manual parsing as backup
      const urlParts = url.split("?");
      let doctorId = null;

      if (queryParams?.doctorId) {
        doctorId = queryParams.doctorId;
      } else if (urlParts.length > 1) {
        const params = new URLSearchParams(urlParts[1]);
        doctorId = params.get("doctorId");
      }

      console.log("Extracted doctorId:", doctorId);

      if (doctorId) {
        console.log("doctorId found:", doctorId);

        // Function to attempt navigation with retries
        const attemptNavigation = (retryCount = 0) => {
          if (navigationRef.current?.isReady()) {
            console.log("Navigation is ready, navigating to Scan QR");
            navigationRef.current?.navigate("Scan QR", { doctorId: doctorId });
          } else if (retryCount < 10) {
            // Try up to 10 times
            console.log(`Navigation not ready, retry ${retryCount + 1}/10 in 500ms`);
            setTimeout(() => attemptNavigation(retryCount + 1), 500);
          } else {
            console.log("Navigation still not ready after all retries");
          }
        };

        attemptNavigation();
      } else {
        console.log("No doctorId in queryParams");
      }
    };

    // Use the new event listener API
    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then(url => {
      console.log("Initial URL:", url);
      if (url && !url.includes("expo-development-client")) {
        handleDeepLink({ url });
      }
    });

    return () => subscription?.remove();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
          <PaperProvider theme={theme}>
            {/* Notification Manager - handles notifications based on login status */}
            <NotificationManager />
            <AppNavigator ref={navigationRef} />
            <StatusBar style="dark" />
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
});
