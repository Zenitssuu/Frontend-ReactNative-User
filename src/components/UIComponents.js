import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { Card, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color as COLORS, FontFamily, FontSize } from "../constants/GlobalStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@rneui/themed";

export const PrimaryButton = ({ title, onPress, disabled, icon }) => {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={COLORS.white}
          style={styles.buttonIcon}
        />
      )}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ title, onPress, disabled, icon }) => {
  return (
    <TouchableOpacity
      style={[styles.secondaryButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={COLORS.primary}
          style={styles.buttonIcon}
        />
      )}
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const OutlineButton = ({ title, onPress, disabled, icon }) => {
  return (
    <TouchableOpacity
      style={[styles.outlineButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={COLORS.primary}
          style={styles.buttonIcon}
        />
      )}
      <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const LoadingSpinner = ({ message }) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>{message || "Loading..."}</Text>
    </View>
  );
};

export const DoctorCard = ({ doctor, onPress, isFavorite, onToggleFavorite }) => {
  return (
    <Surface style={styles.cardSurface}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.doctorCardContent}>
          <View style={styles.doctorAvatarContainer}>
            {doctor.profileImage ? (
              <Image 
                source={{ uri: doctor.profileImage }} 
                style={styles.doctorProfileImage}
                onError={() => {
                  // If image fails to load, we could set a state to show text avatar
                  console.log('Failed to load profile image for doctor:', doctor.name);
                }}
              />
            ) : (
              <Text style={styles.doctorAvatar}>{doctor.name.charAt(0)}</Text>
            )}
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>

            {doctor.location && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.textLighter} />
                <Text style={styles.doctorLocation}> {doctor.location}</Text>
              </View>
            )}

            {doctor.experience && Number(doctor.experience) > 0 && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textLighter} />
                <Text style={styles.doctorExperience}> {doctor.experience}+ years</Text>
              </View>
            )}

            {doctor.rating && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.doctorRating}> {doctor.rating}/5.0</Text>
              </View>
            )}
          </View>
        </View>

        {doctor.about && (
          <View style={styles.doctorAboutSection}>
            <Text style={styles.doctorAboutTitle}>About</Text>
            <Text style={styles.doctorAbout}>{doctor.about}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Surface>
  );
};

export const AppointmentCard = ({ appointment, onPress }) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const isUpcoming = new Date(appointment.date) > new Date();
  const statusColor = isUpcoming ? COLORS.headingColor : COLORS.success;
  const statusIcon = isUpcoming ? "calendar-clock" : "calendar-check";

  return (
    <Surface style={styles.cardSurface}>
      <TouchableOpacity style={[styles.card, styles.appointmentCard]} onPress={onPress}>
        <View
          style={[
            styles.appointmentStatus,
            { backgroundColor: isUpcoming ? COLORS.lightBlue : "#E8F5E9" },
          ]}
        >
          <MaterialCommunityIcons name={statusIcon} size={20} color={statusColor} />
        </View>
        <View style={styles.appointmentContent}>
          <Text style={styles.appointmentDoctor}>Dr. {appointment.doctorName}</Text>
          <View style={styles.appointmentDateRow}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textLighter} />
            <Text style={styles.appointmentDate}> {formatDate(appointment.date)}</Text>
          </View>
          {appointment.locationName && (
            <Text style={styles.cardText}>Location: {appointment.locationName}</Text>
          )}

          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {isUpcoming ? "Upcoming" : "Completed"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

export const SectionHeader = ({ title, icon }) => {
  return (
    <View style={styles.sectionHeader}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={COLORS.primary}
          style={styles.sectionIcon}
        />
      )}
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
};

export const EmptyState = ({ message, icon }) => {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={icon || "clipboard-text-outline"}
        size={60}
        color={COLORS.textLighter}
      />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
};

export const SimpleInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
  ...rest
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={[styles.simpleInput, style]}
      placeholderTextColor={COLORS.darkGray}
      {...rest}
    />
  );
};

export const SimpleButton = ({ title, onPress, disabled, icon, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[styles.simpleButton, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={COLORS.white}
          style={styles.buttonIcon}
        />
      )}
      <Text style={[styles.simpleButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const Header = ({
  title,
  onBackPress,
  rightComponent,
  gradientColors = ["#01869e", "#3cb0c4"],
  titleStyle = {},
}) => {
  const insets = useSafeAreaInsets();

  // Get proper status bar height
  const statusBarHeight = StatusBar.currentHeight || (Platform.OS === "ios" ? insets.top : 0);

  // Custom left component with circle background
  const renderLeftComponent = () => (
    <TouchableOpacity onPress={onBackPress} style={headerStyles.backButtonContainer}>
      <Icon name="arrow-back" color="#fff" size={22} />
    </TouchableOpacity>
  );

  return (
    <View>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />

      {/* Main container that holds both StatusBar space and header */}
      <View style={headerStyles.mainContainer}>
        {/* Gradient background for the entire header including status bar */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[headerStyles.gradientBackground]}
        />

        {/* Status bar spacer */}
        <View style={{ height: statusBarHeight }} />

        {/* Actual header content */}
        <View style={headerStyles.headerContent}>
          <View style={headerStyles.leftContainer}>{renderLeftComponent()}</View>

          <View style={headerStyles.titleContainer}>
            <Text style={[headerStyles.titleText, titleStyle]}>{title}</Text>
          </View>

          <View style={headerStyles.rightContainer}>{rightComponent}</View>
        </View>
      </View>

      <View style={headerStyles.headerShadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  simpleInput: {
    width: "85%",
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.headingColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.white,
    marginVertical: 8,
    fontFamily: FontFamily.Inter_Regular,
    minHeight: 48,
  },
  simpleButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  simpleButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  secondaryButton: {
    backgroundColor: COLORS.lightBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  cardSurface: {
    marginVertical: 8,
    marginHorizontal: 2,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: COLORS.white,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  doctorCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: doctor => (doctor.about ? 1 : 0),
    borderBottomColor: "#f0f0f0",
  },
  doctorAvatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  doctorAvatar: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  doctorProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'cover',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  doctorLocation: {
    fontSize: 13,
    color: COLORS.textLighter,
  },
  favoriteButton: {
    padding: 8,
  },
  appointmentCard: {
    flexDirection: "row",
  },
  appointmentStatus: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.headingColor,
    borderWidth: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  appointmentContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  appointmentDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.headingColor,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  doctorExperience: {
    fontSize: 13,
    color: COLORS.textLighter,
  },
  doctorRating: {
    fontSize: 13,
    color: COLORS.textLighter,
  },
  doctorAboutSection: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: COLORS.white,
  },
  doctorAboutTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 4,
  },
  doctorAbout: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
});

const headerStyles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    overflow: "hidden",
    zIndex: 1000,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  leftContainer: {
    width: 60,
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  titleText: {
    color: "#fff",
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.Inter_SemiBold,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  rightContainer: {
    width: 70,
    alignItems: "flex-end",
    justifyContent: "center",
    position: "relative",
    zIndex: 999, // Ensure the dropdown appears on top of other elements
  },
  headerShadow: {
    height: 6,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  backButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
