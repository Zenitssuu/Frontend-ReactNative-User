import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const capitalize = str =>
  str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

const MAX_VISIBLE = 8;

const SubmittedSymptomsViewer = ({
  symptoms = [],
  language = "en",
  translatedSymptomSection = [],
  onImageView = null, // Add callback for image viewing
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!symptoms || !symptoms.length) return null; // Sort all symptoms into section/category, but only visible subset if not expanded

  const visibleSymptoms = isExpanded ? symptoms : symptoms.slice(0, MAX_VISIBLE);

  const groupedBySection = visibleSymptoms.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const getSectionLabel = sectionKey => {
    return (
      translatedSymptomSection.find(s => s.key === sectionKey)?.translations?.[language] ??
      capitalize(sectionKey)
    );
  };

  const getCategoryLabel = (sectionKey, categoryKey) => {
    const section = translatedSymptomSection.find(s => s.key === sectionKey);
    if (!section) return capitalize(categoryKey);

    if (sectionKey === "bodyParts") {
      const match = section.categories
        ?.flatMap(cat => cat.bodyParts || [])
        .find(bp => bp.key === categoryKey);
      return match?.translations?.[language] ?? capitalize(categoryKey);
    }

    return (
      section?.categories?.find(cat => cat.key === categoryKey)?.translations?.[language] ??
      capitalize(categoryKey)
    );
  };

  return (
    <View style={styles.container}>
      {Object.entries(groupedBySection).map(([sectionKey, items]) => (
        <View key={sectionKey} style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>{getSectionLabel(sectionKey)}</Text>

          {Object.entries(
            items.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            }, {})
          ).map(([categoryKey, categoryItems]) => (
            <View key={categoryKey} style={styles.categoryBox}>
              <Text style={styles.categoryTitle}>{getCategoryLabel(sectionKey, categoryKey)}</Text>

              {categoryItems.map((item, idx) => (
                <View key={idx} style={styles.qaRow}>
                  <View style={styles.questionAnswerContainer}>
                    <Text style={styles.question}>{capitalize(item.question)}</Text>

                    {Array.isArray(item.answer) ? (
                      <View style={styles.answerList}>
                        {item.answer.map((a, i) => (
                          <Text key={i} style={styles.answer}>
                            • {a}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.answer}>{item.answer}</Text>
                    )}

                    {/* Display additional information if available */}
                    {item.additionalInfo && (
                      <View style={styles.additionalInfo}>
                        {Object.entries(item.additionalInfo).map(([key, value]) => {
                          // Skip empty values
                          if (!value || (Array.isArray(value) && value.length === 0)) return null;

                          // Create user-friendly labels
                          const friendlyLabel =
                            key === "coughType"
                              ? "Cough Type"
                              : key === "coughTiming"
                                ? "Cough Timing"
                                : capitalize(key);

                          // Check if this field has an image
                          const hasImage = value && typeof value === "object" && value.hasImage;
                          const displayValue = hasImage ? value.originalValue : value;
                          const imageUrl = hasImage ? value.imageUrl : null;

                          // For image fields, don't display the URL text, just show the button
                          const shouldDisplayText = !hasImage || !imageUrl;
                          const textToDisplay = shouldDisplayText
                            ? Array.isArray(displayValue)
                              ? displayValue.join(", ")
                              : displayValue
                            : "";

                          return (
                            <View key={key} style={styles.additionalRow}>
                              <Text style={styles.additionalLabel}>{friendlyLabel}:</Text>
                              <View
                                style={[
                                  styles.additionalValueContainer,
                                  !shouldDisplayText && styles.imageOnlyContainer,
                                ]}
                              >
                                {shouldDisplayText && textToDisplay && (
                                  <Text style={styles.additionalValue}>{textToDisplay}</Text>
                                )}
                                {imageUrl && onImageView && (
                                  <TouchableOpacity
                                    onPress={() => onImageView(imageUrl)}
                                    style={[
                                      styles.viewImageButton,
                                      shouldDisplayText && styles.viewImageButtonWithText,
                                    ]}
                                  >
                                    <MaterialCommunityIcons
                                      name="image"
                                      size={16}
                                      color="#01869e"
                                    />
                                    <Text style={styles.viewImageText}>View Image</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}

      {symptoms.length > MAX_VISIBLE && (
        <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>{isExpanded ? "View Less ▲" : "View More ▼"}  </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sectionBox: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#01869e",
    marginBottom: 6,
  },
  categoryBox: {
    paddingLeft: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16, // bigger as requested
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  qaRow: {
    paddingVertical: 4,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  questionAnswerContainer: {
    flex: 1,
  },
  question: {
    fontWeight: "600",
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
  },
  answer: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  answerList: {
    alignItems: "flex-start",
    marginBottom: 4,
  },
  additionalInfo: {
    marginTop: 4,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#01869e",
  },
  additionalRow: {
    flexDirection: "column",
    marginBottom: 4,
  },
  additionalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  additionalValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 24, // Ensure consistent height even when text is hidden
  },
  imageOnlyContainer: {
    justifyContent: "flex-start", // Align to start when there's only an image button
  },
  additionalValue: {
    fontSize: 12,
    color: "#555",
    flex: 1,
  },
  viewImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 0, // Remove margin since we handle it conditionally
    flex: 0, // Don't expand to fill space
  },
  viewImageButtonWithText: {
    marginLeft: 8, // Add margin when there's text next to it
  },
  viewImageText: {
    fontSize: 10,
    color: "#01869e",
    marginLeft: 4,
    fontWeight: "600",
  },
  viewMoreButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#01869e",
    borderRadius: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },

  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#eee",
  },
});

export default SubmittedSymptomsViewer;
