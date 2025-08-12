// Updated CombinedAppointmentsScreen.js with header, tab icons, and refresh button

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Color } from "../../constants/GlobalStyles";
import { Header } from "../../components/UIComponents";

import Upcoming from "./UpcomingAppointmentsScreen";
import Requests from "./RequestedAppointmentsScreen";
import Past from "./OldAppointmentsScreen";
// import { OtherDetailsForm } from "./OtherScreen"

const Tab = createMaterialTopTabNavigator();

const CombinedAppointmentsScreen = ({ navigation }) => {
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);

  // const handleOtherSubmit = (form) => {
  //   setShowOtherModal(false)
  //   navigation.navigate("SurveyDetails", { form })
  // }

  const CustomTabBar = ({ state, navigation }) => {
    const activeTab = state.routes[state.index].name;

    const indicatorLeft =
      activeTab === "Requests" ? "0%" : activeTab === "Upcoming" ? "33.33%" : "66.66%";

    return (
      <View style={styles.tabBarContainer}>
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.9)"]}
          style={styles.toggleGradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.toggleTrack}>
            <View style={[styles.toggleIndicator, { left: indicatorLeft }]} />

            <TouchableOpacity
              style={styles.tabToggleButton}
              onPress={() => navigation.navigate("Requests")}
            >
              <MaterialIcons
                name="notifications-active"
                size={20}
                color={activeTab === "Requests" ? Color.bcHeader : "#777"}
              />
              <Text
                style={[styles.tabToggleText, activeTab === "Requests" && styles.tabActiveText]}
              >
                Requests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabToggleButton}
              onPress={() => navigation.navigate("Upcoming")}
            >
              <MaterialIcons
                name="event"
                size={20}
                color={activeTab === "Upcoming" ? Color.bcHeader : "#777"}
              />
              <Text
                style={[styles.tabToggleText, activeTab === "Upcoming" && styles.tabActiveText]}
              >
                Upcoming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabToggleButton}
              onPress={() => navigation.navigate("Past")}
            >
              <MaterialIcons
                name="history"
                size={20}
                color={activeTab === "Past" ? Color.bcHeader : "#777"}
              />
              <Text style={[styles.tabToggleText, activeTab === "Past" && styles.tabActiveText]}>
                Past
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={"Appointments"}
        onBackPress={() => navigation.goBack()}
        rightComponent={null}
      />

      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{ tabBarShowLabel: false, tabBarStyle: { display: "none" } }}
        tabBarOptions
      >
        <Tab.Screen name="Requests" component={Requests} />
        <Tab.Screen name="Upcoming" component={Upcoming} />
        <Tab.Screen name="Past" component={Past} />
      </Tab.Navigator>
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={() => navigation.navigate("My Doctors")}
      >
        <LinearGradient colors={["#4A90E2", "#007AFF"]} style={styles.fabButton}>
          <FontAwesome name="plus" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* <Modal isVisible={showChoiceModal} onBackdropPress={() => setShowChoiceModal(false)} style={styles.modal}>
          <View style={styles.choiceModal}>
            <Text style={styles.modalTitle}>Who is the survey for?</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity style={styles.option} onPress={() => {
                setShowChoiceModal(false)
                navigation.navigate("SurveyDetails", { form: { name: "Self" } })
              }}>
                <Image source={require("../../../assets/self.png")} style={styles.optionImage} />
                <Text style={styles.optionText}>Self</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => {
                setShowChoiceModal(false)
                setShowOtherModal(true)
              }}>
                <Image source={require("../../../assets/other.png")} style={styles.optionImage} />
                <Text style={styles.optionText}>Other</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowChoiceModal(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={showOtherModal} onBackdropPress={() => setShowOtherModal(false)} style={styles.modal}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.otherModal} behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <OtherDetailsForm onSubmit={handleOtherSubmit} onCancel={() => setShowOtherModal(false)} />
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBarContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingBottom: 0,
    alignItems: "center",
  },

  toggleGradientBackground: {
    borderRadius: 22,
    padding: 5,
  },
  toggleTrack: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    height: 50,
    width: "100%",
  },

  tabToggleButton: {
    flex: 1, // ✅ Equal spacing
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5, // Or use columnGap if your version supports it
  },

  toggleIndicator: {
    position: "absolute",
    width: "33.33%", // ✅ Matches tab width
    height: 3,
    bottom: 0,
    backgroundColor: Color.bcHeader,
  },

  tabToggleText: {
    fontSize: 14,
    color: "#777",
  },
  tabActiveText: {
    color: Color.bcHeader,
    fontWeight: "bold",
  },
  refreshIcon: {
    marginLeft: 10,
    padding: 8,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 10,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  choiceModal: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  option: {
    alignItems: "center",
  },
  optionImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
    backgroundColor: "#EAF4FD",
  },
  optionText: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
  },
  cancelBtn: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
    marginTop: 10,
  },
  otherModal: {
    backgroundColor: "#fff",
    maxHeight: "75%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
});

export default CombinedAppointmentsScreen;
