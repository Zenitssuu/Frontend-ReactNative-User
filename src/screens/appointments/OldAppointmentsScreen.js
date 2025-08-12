import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import { getAppointments } from "../../utils/storage";
import { EmptyState, LoadingSpinner } from "../../components/UIComponents";
import OldAppointmentCard from "../../components/OldAppointmentCard";
import apiService from "../../services/api";
import { Color } from "../../constants/GlobalStyles";

// Border colors for different appointment types
const BORDER_COLORS = {
  SELF: "#4CAF50", // Green for self appointments
  BEHALF: "#FF9800", // Orange for behalf appointments
};

// Skeleton loader component for appointment cards
const AppointmentCardSkeleton = ({ borderColor }) => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={[styles.skeletonCard, { borderColor: borderColor || "#F0F0F0" }]}>
      <View style={styles.skeletonHeader}>
        <Animated.View style={[styles.skeletonAvatar, { opacity: fadeAnim }]} />
        <View style={styles.skeletonHeaderText}>
          <Animated.View style={[styles.skeletonName, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.skeletonSpecialty, { opacity: fadeAnim }]} />
        </View>
      </View>

      <View style={styles.skeletonInfoRows}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.skeletonInfoRow}>
            <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonInfoText, { opacity: fadeAnim }]} />
          </View>
        ))}
      </View>

      <Animated.View style={[styles.skeletonStatus, { opacity: fadeAnim }]} />
    </View>
  );
};

const OldAppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch old appointments
  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    try {
      const response = await apiService.appointments.getOldAppointments();

      // Handle different response structures
      let allAppointments = [];
      if (Array.isArray(response.data)) {
        // If response.data is directly an array
        allAppointments = response.data;
      } else if (response.data?.allAppointments) {
        // If response.data has allAppointments property
        allAppointments = response.data.allAppointments;
      } else if (response.data?.data) {
        // If response.data has data property
        allAppointments = response.data.data;
      }

      setAppointments(allAppointments);
    } catch (error) {
      console.error("Error loading old appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [navigation]);

  // Show skeleton loader while loading
  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Array.from({ length: 3 }).map((_, index) => (
          <AppointmentCardSkeleton key={index} borderColor={BORDER_COLORS.SELF} />
        ))}
      </ScrollView>
    );
  }

  const isEmpty = appointments.length === 0;

  // Separate appointments into self and behalf categories
  const selfAppointments = appointments.filter(app => !app.behalfUserId);
  const behalfAppointments = appointments.filter(app => app.behalfUserId);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Color.bcHeader]}
          tintColor={Color.bcHeader}
        />
      }
    >
      {isEmpty ? (
        <EmptyState message="No old appointments" icon="calendar-blank" />
      ) : (
        <>
          {/* Show all appointments with section headers only if we have both types */}
          {selfAppointments.length > 0 && (
            <>
              {behalfAppointments.length > 0 && <Text style={styles.sectionHeader}>For Self</Text>}
              {selfAppointments.map(app => (
                <OldAppointmentCard
                  appointment={app}
                  key={app._id}
                  borderColor={BORDER_COLORS.SELF}
                />
              ))}
            </>
          )}

          {behalfAppointments.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>For Others</Text>
              {behalfAppointments.map(app => (
                <OldAppointmentCard
                  appointment={app}
                  key={app._id}
                  borderColor={BORDER_COLORS.BEHALF}
                />
              ))}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default OldAppointmentsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    minHeight: "100%",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  // Skeleton loader styles
  skeletonCard: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E1E9EE",
  },
  skeletonHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  skeletonName: {
    height: 16,
    width: "60%",
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonSpecialty: {
    height: 14,
    width: "40%",
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
  skeletonInfoRows: {
    marginBottom: 12,
  },
  skeletonInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E1E9EE",
    marginRight: 6,
  },
  skeletonInfoText: {
    height: 14,
    flex: 1,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
  skeletonStatus: {
    height: 13,
    width: "30%",
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    marginTop: 8,
  },
});
