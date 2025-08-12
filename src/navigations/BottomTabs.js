import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color, FontFamily } from "../constants/GlobalStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import ScanQRScreen from "../screens/ScanQRScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SavedDoctors from "../screens/SavedDoctors";
const Tab = createBottomTabNavigator();

const Bottom_Tab = ({ route }) => {
  const navigation = useNavigation();
  // Custom FAB Button Component
  const CustomFABButton = props => {
    const { onPress, accessibilityState } = props;
    const focused = accessibilityState?.selected; // Use accessibilityState.selected for focused state
    return (
      <Pressable
        style={({ pressed }) => [
          { transform: [{ scale: pressed ? 0.96 : 1 }] },
          styles.fabContainer,
        ]}
        onPress={() => onPress?.()}
      >
        <LinearGradient colors={["#0077B6", "#01869e"]} style={styles.fabGradient}>
          <Icon name="qr-code-scanner" size={32} color="white" style={{ marginBottom: -4 }} />
        </LinearGradient>
        {focused && <Text style={styles.fabTabLabel}>Add Doctor</Text>}
      </Pressable>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = focused ? 26 : 22;
          // Set icons for Home and saved doctors tabs
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Saved Doctors":
              iconName = focused ? "bookmark" : "bookmark-outline";
              break;
          }

          // Return icon with active indicator dot
          return (
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={iconSize}
                color={color}
                style={{ marginBottom: -4 }}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <>
            <Text style={[styles.tabLabel, { color }]}>{route.name}</Text>
            {focused && <View style={styles.activeIndicator} />}
          </>
        ),
        tabBarStyle: styles.tabBar,
        tabBarInactiveTintColor: "#888",
        tabBarActiveTintColor: Color.bcHighlight,
        headerShown: false,
      })}
    >
      {/* Home Tab */}
      <Tab.Screen name="Home" component={DashboardScreen} />
      {/* Add Doctor Tab with Custom FAB */}
      <Tab.Screen
        name="Add Doctor"
        component={ScanQRScreen}
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: props => <CustomFABButton {...props} />,
        }}
      />
      {/* saved doctors Tab */}
      <Tab.Screen name="Saved Doctors" component={SavedDoctors} />
    </Tab.Navigator>
  );
};

export default Bottom_Tab;

// Styles
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: 60,
    borderTopWidth: 0,
    position: "absolute",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    paddingHorizontal: 16,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  activeIndicator: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: Color.bcHighlight,
  },
  fabTabLabel: {
    color: Color.bcHighlight,
    fontFamily: FontFamily.Inter_Medium,
    fontSize: 10,
    marginVertical: 4,
    position: "absolute",
    bottom: -20,
  },
  tabLabel: {
    fontFamily: FontFamily.Inter_Medium,
    fontSize: 10,
    marginVertical: 4,
  },
  fabContainer: {
    top: -24, // Positions FAB above the tab bar
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF70A2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
