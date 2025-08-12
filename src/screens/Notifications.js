import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Color as COLORS, SIZES, FONTS, SHADOWS } from "../constants/GlobalStyles";
import { Header } from "../components/UIComponents";
import apiService from "../services/api";

const Notifications = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Dummy notification data
  const dummyNotifications = [
    {
      id: "1",
      type: "appointment",
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Smith is tomorrow at 10:00 AM",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      icon: "calendar-clock",
      iconColor: COLORS.primary,
      priority: "high",
    },
    {
      id: "2",
      type: "medication",
      title: "Medication Reminder",
      message: "Time to take your prescribed medication - Aspirin 100mg",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      icon: "pill",
      iconColor: COLORS.warning,
      priority: "medium",
    },
    {
      id: "3",
      type: "report",
      title: "Lab Report Available",
      message: "Your blood test results are now available for download",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: true,
      icon: "file-document-outline",
      iconColor: COLORS.success,
      priority: "medium",
    },
    {
      id: "4",
      type: "followup",
      title: "Follow-up Required",
      message: "Dr. Johnson has requested a follow-up appointment within 2 weeks",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
      icon: "account-clock",
      iconColor: COLORS.accent,
      priority: "high",
    },
    {
      id: "5",
      type: "system",
      title: "Profile Update",
      message: "Your profile information has been successfully updated",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: true,
      icon: "account-check",
      iconColor: COLORS.success,
      priority: "low",
    },
    {
      id: "6",
      type: "appointment",
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Williams on March 15th has been confirmed",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      isRead: true,
      icon: "calendar-check",
      iconColor: COLORS.success,
      priority: "medium",
    },
    {
      id: "7",
      type: "emergency",
      title: "Emergency Contact Update",
      message: "Please update your emergency contact information in your profile",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      isRead: false,
      icon: "alert-circle",
      iconColor: COLORS.error,
      priority: "high",
    },
    {
      id: "8",
      type: "survey",
      title: "Health Survey",
      message: "Please complete your monthly health assessment survey",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      isRead: true,
      icon: "clipboard-text",
      iconColor: COLORS.primary,
      priority: "low",
    },
  ];

  const getNotifications = async () => {
    try {
      const response = await apiService.notificationService.getAllNotifications();

      console.log("Fetched notifications:", JSON.stringify(response.data, null, 2));

      // Transform API data to match component format
      const transformedNotifications = response.data.notifications.map(notification => ({
        id: notification._id,
        type: getNotificationType(notification.eventType),
        title: notification.message.title,
        message: notification.message.body,
        timestamp: new Date(notification.createdAt),
        isRead: notification.isRead,
        icon: getNotificationIcon(notification.eventType),
        iconColor: getNotificationIconColor(notification.eventType),
        priority: getNotificationPriority(notification.eventType),
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to load notifications. Please try again later.");
      // Fall back to dummy data if API fails
      setNotifications(dummyNotifications);
    }
  };

  // Helper functions to map eventType to UI properties
  const getNotificationType = eventType => {
    switch (eventType) {
      case "appointment_accepted":
      case "appointment_availability":
        return "appointment";
      default:
        return "system";
    }
  };

  const getNotificationIcon = eventType => {
    switch (eventType) {
      case "appointment_accepted":
        return "calendar-check";
      case "appointment_availability":
        return "calendar-clock";
      default:
        return "bell";
    }
  };

  const getNotificationIconColor = eventType => {
    switch (eventType) {
      case "appointment_accepted":
        return COLORS.success;
      case "appointment_availability":
        return COLORS.primary;
      default:
        return COLORS.text;
    }
  };

  const getNotificationPriority = eventType => {
    switch (eventType) {
      case "appointment_accepted":
        return "high";
      case "appointment_availability":
        return "medium";
      default:
        return "low";
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const formatTimestamp = timestamp => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const handleMarkAsRead = async notificationId => {
    try {
      await apiService.notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to mark notification as read. Please try again.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.notificationService.markAllAsRead();
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
      Alert.alert("Success", "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      Alert.alert("Error", "Failed to mark all notifications as read. Please try again.");
    }
  };

  const handleDelete = notificationId => {
    Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiService.notificationService.deleteNotification(notificationId);
            setNotifications(prev =>
              prev.filter(notification => notification.id !== notificationId)
            );
          } catch (error) {
            console.error("Error deleting notification:", error);
            Alert.alert("Error", "Failed to delete notification. Please try again.");
          }
        },
      },
    ]);
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) {
      Alert.alert("No Selection", "Please select notifications to delete");
      return;
    }

    Alert.alert(
      "Delete Notifications",
      `Are you sure you want to delete ${selectedNotifications.length} notification(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete each notification individually
              await Promise.all(
                selectedNotifications.map(notificationId =>
                  apiService.notificationService.deleteNotification(notificationId)
                )
              );
              setNotifications(prev =>
                prev.filter(notification => !selectedNotifications.includes(notification.id))
              );
              setSelectedNotifications([]);
              setIsSelectionMode(false);
            } catch (error) {
              console.error("Error deleting notifications:", error);
              Alert.alert("Error", "Failed to delete some notifications. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleBulkMarkAsRead = () => {
    if (selectedNotifications.length === 0) {
      Alert.alert("No Selection", "Please select notifications to mark as read");
      return;
    }

    const markBulkAsRead = async () => {
      try {
        // Mark each notification as read individually
        await Promise.all(
          selectedNotifications.map(notificationId =>
            apiService.notificationService.markAsRead(notificationId)
          )
        );
        setNotifications(prev =>
          prev.map(notification =>
            selectedNotifications.includes(notification.id)
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setSelectedNotifications([]);
        setIsSelectionMode(false);
        Alert.alert("Success", `${selectedNotifications.length} notifications marked as read`);
      } catch (error) {
        console.error("Error marking notifications as read:", error);
        Alert.alert("Error", "Failed to mark some notifications as read. Please try again.");
      }
    };

    markBulkAsRead();
  };

  const toggleSelection = notificationId => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotifications([]);
  };

  const selectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getNotifications();
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async notification => {
    if (isSelectionMode) {
      toggleSelection(notification.id);
      return;
    }

    // Mark as read when pressed
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "appointment":
        navigation.navigate("Appointments");
        break;
      case "report":
        navigation.navigate("UploadDocument");
        break;
      case "followup":
        navigation.navigate("FollowUp");
        break;
      case "survey":
        navigation.navigate("SurveyDetails");
        break;
      default:
        // Show notification details
        Alert.alert(notification.title, notification.message);
    }
  };

  const getPriorityStyle = priority => {
    // Removed priority styling - no left borders
    return {};
  };

  const renderNotificationItem = notification => {
    const isSelected = selectedNotifications.includes(notification.id);

    return (
      <Surface key={notification.id} style={styles.notificationSurface}>
        <TouchableOpacity
          style={[
            styles.notificationItem,
            !notification.isRead && styles.unreadNotification,
            getPriorityStyle(notification.priority),
            isSelected && styles.selectedNotification,
          ]}
          onPress={() => handleNotificationPress(notification)}
          onLongPress={() => {
            if (!isSelectionMode) {
              setIsSelectionMode(true);
              toggleSelection(notification.id);
            }
          }}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationTextContainer}>
                <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadText]}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTimestamp}>
                  {formatTimestamp(notification.timestamp)}
                </Text>
              </View>

              {isSelectionMode && (
                <View style={styles.selectionContainer}>
                  <MaterialCommunityIcons
                    name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={24}
                    color={isSelected ? COLORS.primary : COLORS.textLighter}
                  />
                </View>
              )}

              {!isSelectionMode && (
                <View style={styles.notificationActions}>
                  {!notification.isRead && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleMarkAsRead(notification.id)}
                    >
                      <MaterialCommunityIcons name="eye" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(notification.id)}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Surface>
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={[styles.container]}>
      <Header
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ""}`}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={toggleSelectionMode}>
            <MaterialCommunityIcons
              name={isSelectionMode ? "close" : "dots-vertical"}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        }
      />

      {isSelectionMode && (
        <View style={styles.selectionHeader}>
          <TouchableOpacity style={styles.selectionButton} onPress={selectAll}>
            <MaterialCommunityIcons
              name={selectedNotifications.length === notifications.length ? "select-all" : "select"}
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.selectionButtonText}>
              {selectedNotifications.length === notifications.length
                ? "Deselect All"
                : "Select All"}
            </Text>
          </TouchableOpacity>

          <View style={styles.selectionActions}>
            <TouchableOpacity style={styles.selectionActionButton} onPress={handleBulkMarkAsRead}>
              <MaterialCommunityIcons name="eye" size={20} color={COLORS.primary} />
              <Text style={styles.selectionActionText}>Mark Read</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.selectionActionButton} onPress={handleBulkDelete}>
              <MaterialCommunityIcons name="delete" size={20} color={COLORS.error} />
              <Text style={[styles.selectionActionText, { color: COLORS.error }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isSelectionMode && (
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleMarkAllAsRead}>
            <MaterialCommunityIcons name="eye-check" size={20} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-outline" size={80} color={COLORS.textLighter} />
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateMessage}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>{notifications.map(renderNotificationItem)}</View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionButtonText: {
    marginLeft: 8,
    fontSize: SIZES.body2,
    color: COLORS.primary,
    fontWeight: "600",
  },
  selectionActions: {
    flexDirection: "row",
  },
  selectionActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  selectionActionText: {
    marginLeft: 4,
    fontSize: SIZES.body3,
    color: COLORS.primary,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.lightBlue,
  },
  quickActionText: {
    marginLeft: 4,
    fontSize: SIZES.body3,
    color: COLORS.primary,
    fontWeight: "500",
  },
  notificationsList: {
    padding: 16,
  },
  notificationSurface: {
    marginBottom: 12,
    borderRadius: 12,
    ...SHADOWS.level1,
  },
  notificationItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  unreadNotification: {
    backgroundColor: "#F8F9FF",
  },
  selectedNotification: {
    backgroundColor: COLORS.lightBlue,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: SIZES.body1,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: "700",
  },
  notificationMessage: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTimestamp: {
    fontSize: SIZES.body3,
    color: COLORS.textLighter,
  },
  notificationActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  selectionContainer: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: SIZES.h3,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default Notifications;
