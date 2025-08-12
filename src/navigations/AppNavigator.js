import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform } from "react-native";
import Bottom_Tab from "./BottomTabs";

// Import screens
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyDoctorsScreen from "../screens/MyDoctorsScreen";
import ScanQRScreen from "../screens/ScanQRScreen";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import UploadDocumentScreen from "../screens/UploadDocumentScreen";
import VisitDetailsScreen from "../screens/VisitDetailsScreen";
import FollowUpScreen from "../screens/FollowUpScreen";
import SurveyDetailsScreen from "../screens/SurveyDetailsScreen";
import QuestionScreen from "../screens/QuestionScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import PersonalInfo_Profile from "../screens/PersonalInfo_Profile";
import Address_Profile from "../screens/Address_Profile";
import Profile_Contact from "../screens/Profile_Contact";
import AppointmentsScreen from "../screens/appointments/AppointmentsScreen";
import { Color as COLORS } from "../constants/GlobalStyles";
import CurrentTreatmentScreen from "../screens/CurrentTreatmentScreen";
import CreateOtherProfile from "../screens/CreateOtherProfile";
import Login from "../screens/Login";
import Register from "../screens/Register";
import DoctorDetails from "../screens/DoctorDetails";
import DoctorAppointmentsScreen from "../screens/DoctorAppointmentsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CustomDrawerContent from "../components/Sidebar";
import { Color } from "../constants/GlobalStyles";
import Welcome from "../screens/Welcome";
import Notifications from "../screens/Notifications";
import Feedback from "../screens/Feedback";
import AboutUs from "../screens/AboutUs";
import TermsConditions from "../screens/TermsConditions";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import Manual from "../screens/Manual";
import Support from "../screens/Support";
import FAQ from "../screens/FAQ";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Color.colorWhite,
          width: Platform.OS === "ios" ? "85%" : "80%",
          overflow: "hidden",
          elevation: 24,
          shadowColor: "#000",
          shadowOffset: {
            width: 4,
            height: 0,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        drawerType: Platform.OS === "ios" ? "slide" : "front",
        swipeEnabled: true,
        gestureHandlerProps: {
          activeOffsetX: 20,
        },
      }}
    >
      <Drawer.Screen name="Main" component={Bottom_Tab} />
      <Drawer.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{
          drawerLabel: "Dashboard",
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = React.forwardRef((props, ref) => {
  return (
    <NavigationContainer ref={ref}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.headerBg,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen
          name="Notification"
          component={Notifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

        <Stack.Screen
          name="Appointments"
          component={AppointmentsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="My Doctors"
          component={MyDoctorsScreen}
          options={{ title: "My Doctors", headerShown: false }}
        />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetails}
          options={{ title: "Doctor Details", headerShown: false }}
        />
        <Stack.Screen
          name="DoctorAppointments"
          component={DoctorAppointmentsScreen}
          options={{ title: "Doctor Appointments", headerShown: false }}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{ title: "Book Appointment" }}
        />
        <Stack.Screen
          name="UploadDocument"
          component={UploadDocumentScreen}
          options={{ title: "Upload Documents" }}
        />
        <Stack.Screen
          name="VisitDetails"
          component={VisitDetailsScreen}
          options={{ title: "Visit Details" }}
        />
        <Stack.Screen
          name="FollowUp"
          component={FollowUpScreen}
          options={{ title: "Add Follow-Up" }}
        />
        <Stack.Screen
          name="SurveyDetails"
          component={SurveyDetailsScreen}
          options={{ title: "Survey Details", headerShown: false }}
        />
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{ title: "Question", headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Edit Profile", headerShown: false }}
        />
        <Stack.Screen
          name="PersonalInfo_Profile"
          component={PersonalInfo_Profile}
          options={{ title: "Edit Personal Profile", headerShown: false }}
        />
        <Stack.Screen
          name="Address_Profile"
          component={Address_Profile}
          options={{ title: "Edit Mailing Address", headerShown: false }}
        />
        <Stack.Screen
          name="Profile_Contact"
          component={Profile_Contact}
          options={{ title: "Edit Mailing Address", headerShown: false }}
        />
        <Stack.Screen
          name="CurrentTreatment"
          component={CurrentTreatmentScreen}
          options={{ title: "Ongoing Treatments", headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings", headerShown: false }}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{ title: "Feedback", headerShown: false }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ title: "About Us", headerShown: false }}
        />
        <Stack.Screen
          name="TermsConditions"
          component={TermsConditions}
          options={{ title: "Terms & Conditions", headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ title: "Privacy Policy", headerShown: false }}
        />
        <Stack.Screen
          name="Manual"
          component={Manual}
          options={{ title: "Manual", headerShown: false }}
        />
        <Stack.Screen
          name="Support"
          component={Support}
          options={{ title: "Support", headerShown: false }}
        />
        <Stack.Screen name="FAQ" component={FAQ} options={{ title: "FAQ", headerShown: false }} />
        <Stack.Screen
          name="CreateOtherProfile"
          component={CreateOtherProfile}
          options={{ title: "Create Other Profile", headerShown: false }}
        />
        <Stack.Screen
          name="Scan QR"
          component={ScanQRScreen}
          options={{ title: "Scan QR", headerShown: false }}
        />
        <Stack.Screen
          name="AppointmentsScreen"
          component={AppointmentsScreen}
          options={{ title: "Appointments", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default AppNavigator;
