import React,{useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Color, FontFamily, FONTS, SIZES, SHADOWS } from "../constants/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import apiService from "../services/api";
import { registerUser } from "../Redux/Slices/UserSlice";

const { width, height } = Dimensions.get("window");

const Welcome = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isTokenLoading, setIsTokenLoading] = React.useState(true);

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const loadToken = async () => {
      try {
        setIsTokenLoading(true);
        const token = await AsyncStorage.getItem("AccessToken");
        if (token) {
          // store user profile details in redux store
          const userProfile = await apiService.profile.getProfile();
          if (userProfile?.data?.data) {
            dispatch(registerUser(userProfile.data.data));
            navigation.reset({ index: 0, routes: [{ name: "MainDrawer" }] });
          } else {
            throw new Error("Invalid profile data");
          }
        } else {
          console.log("Token Not Present - showing welcome screen");
        }
      } catch (error) {
        console.log("Error loading token:", error);
        await AsyncStorage.multiRemove(["AccessToken", "RefreshToken", "AsUser"]);
      } finally {
        setIsTokenLoading(false);
      }
    };

    loadToken();
  }, [navigation, dispatch]);

  // Show loading state while checking token
  if (isTokenLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar backgroundColor={Color.primary} barStyle="light-content" />
        <Image
          source={require("../../assets/tellyoudoc_logo2.png")}
          style={[styles.logo, { tintColor: Color.primary }]}
          resizeMode="contain"
        />
        <Text style={[styles.welcomeTitle, { marginTop: 20 }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Color.primary} barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image
          source={require("../../assets/tellyoudoc_logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to TellYouDoc</Text>
          <Text style={styles.welcomeSubtitle}>
            Your trusted health companion for managing symptoms and connecting with healthcare
            professionals
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>📋 Track your symptoms</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>👨‍⚕️ Connect with doctors</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>📱 Easy appointment booking</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>💊 Manage your health records</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Take control of your health journey today</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  headerSection: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    marginTop: "10%",
    height: "100%",
    tintColor: Color.white,
  },
  contentSection: {
    flex: 0.5,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: Color.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  welcomeTitle: {
    ...FONTS.h2,
    color: Color.primary,
    textAlign: "center",
    marginBottom: 15,
  },
  welcomeSubtitle: {
    ...FONTS.body1,
    color: Color.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  featuresContainer: {
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 10,
  },
  featureText: {
    ...FONTS.body2,
    color: Color.text,
    marginLeft: 5,
  },
  bottomSection: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  getStartedButton: {
    backgroundColor: Color.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: "center",
    ...SHADOWS.medium,
    marginBottom: 15,
  },
  getStartedButtonText: {
    ...FONTS.button,
    color: Color.white,
    fontSize: 18,
  },
  footerText: {
    ...FONTS.body3,
    color: Color.textLighter,
    textAlign: "center",
  },
});

export default Welcome;
