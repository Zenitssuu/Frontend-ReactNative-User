const packageInfo = require("./package.json");

// Environment flags
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const IS_PROD = process.env.APP_VARIANT === 'production';

// Get the Google Services file based on environment
const getGoogleServicesFile = () => {
    // For cloud builds, use the environment variable that contains the file content
    if (process.env.GOOGLE_SERVICES_JSON && process.env.GOOGLE_SERVICES_JSON !== 'GOOGLE_SERVICES_JSON') {
        // This should be the actual file content from EAS secrets
        return process.env.GOOGLE_SERVICES_JSON;
    }

    // For local builds, use the local file
    return "./android/app/google-services.json";
};

// Get unique identifier based on environment
const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.tellyoudocpatient.dev'; // Fixed to match actual build package
    }

    if (IS_PREVIEW) {
        return 'com.tellyoudocpatient.preview'; // Fixed to match actual build package
    }

    if (IS_PROD) {
    return 'com.tellyoudoc.patient'; // Fixed to match actual build package
    }
    return 'com.tellyoudocpatient.dev'; // Default to development package
};

// Get app name with environment suffix
const getAppName = () => {
    if (IS_DEV) {
        return 'TellYouDoc(Dev)';
    }

    if (IS_PREVIEW) {
        return 'TellYouDoc(Preview)';
    }
    if (IS_PROD) {
        return 'TellYouDoc';
    }
    return 'TellYouDoc(Dev)';
};

// Get app version and build number
const appVersion = packageInfo.version;
const buildNumber = process.env.EAS_BUILD_NUMBER || "1";

export default {
    name: getAppName(),
    slug: "tellyoudoc",
    owner: "tellyoudoc_org",
    version: appVersion,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "tellyoudoc",
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: getUniqueIdentifier(),
        buildNumber: buildNumber,
        infoPlist: {
            ITSAppUsesNonExemptEncryption: false
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        package: getUniqueIdentifier(),
         intentFilters: [
      {
        action: "VIEW",
        data: {
          scheme: "https",
          host: "tellyoudoc.com",
          pathPrefix: "/connect",
        },
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
        versionCode: parseInt(buildNumber),
        edgeToEdgeEnabled: true,
        permissions: [
            "android.permission.CAMERA",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
            "android.permission.POST_NOTIFICATIONS",
            "android.permission.RECORD_AUDIO"
        ],
        googleServicesFile: getGoogleServicesFile()
        // No minify or proguard as requested
    },
    web: {
        favicon: "./assets/favicon.png"
    },
    plugins: [
        [
            "expo-camera",
            {
                "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
                "recordAudioAndroid": true
            }
        ],
        "expo-notifications",
        "expo-image-picker",
        "@react-native-firebase/app",
        [
            "@react-native-firebase/messaging",
            {
                "android": {
                    "channelId": "default",
                    "channelName": "Default",
                    "channelDescription": "Default notifications channel"
                }
            }
        ],
        [
            "@sentry/react-native/expo",
            {
                "url": "https://sentry.io/",
                "project": "tellyoudoc-patient",
                "organization": "tellyoudoc"
            }
        ]
    ],
    extra: {
        eas: {
            projectId: "f838b796-0b71-4b45-91d9-660b26580bf2"
        },
        APP_VARIANT: process.env.APP_VARIANT,
        EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    }
};
