import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontFamily } from "../constants/GlobalStyles";

const languageOptions = [
  { label: "English", value: "en" },
  { label: "বাংলা", value: "bn" },
  { label: "অসমীয়া", value: "as" },
];

const AnimatedDropDown = ({
  options = languageOptions,
  defaultFilter,
  onSelect = () => {},
  dropdownHeight = 120,
  containerStyle,
  buttonStyle,
  buttonTextStyle,
  dropdownStyle,
  dropdownItemStyle,
  dropdownTextStyle,
  activeTextStyle,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [filter, setFilter] = useState(
    options.find(opt => opt.value === defaultFilter)?.label || "Select"
  );

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const activeAnimationRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 90,
  });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);

  useEffect(() => {
    setFilter(options.find(opt => opt.value === defaultFilter)?.label || languageOptions[0].label);
  }, [defaultFilter]);

  const calculatePosition = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        // Make sure we're getting valid numbers
        const validPx = isNaN(px) ? 0 : px;
        const validPy = isNaN(py) ? 0 : py;
        const validWidth = isNaN(width) ? 90 : width;
        const validHeight = isNaN(height) ? 30 : height;

        // Set position with fallback values to prevent NaN
        setDropdownPosition({
          top: validPy + validHeight - 15,
          left: validPx,
          width: validWidth,
        });

        setIsPositionCalculated(true);
      });
    }
  };

  const toggleDropdown = () => {
    if (activeAnimationRef.current) {
      activeAnimationRef.current.stop();
      activeAnimationRef.current = null;
    }

    if (isDropdownVisible) {
      closeDropdown();
    } else {
      calculatePosition();
      setTimeout(() => {
        openDropdown();
      }, 150); // Increased from 100ms to 150ms
    }
  };

  const openDropdown = () => {
    setIsDropdownVisible(true);

    const animation = Animated.timing(animatedHeight, {
      toValue: dropdownHeight,
      duration: 300,
      useNativeDriver: false,
    });

    activeAnimationRef.current = animation;

    animation.start(({ finished }) => {
      if (finished) {
        activeAnimationRef.current = null;
      }
    });
  };

  const closeDropdown = () => {
    const animation = Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    });

    activeAnimationRef.current = animation;

    animation.start(({ finished }) => {
      if (finished) {
        setIsDropdownVisible(false);
        setIsPositionCalculated(false);
        activeAnimationRef.current = null;
      }
    });
  };

  const handleSelect = item => {
    setFilter(item.label);
    closeDropdown();
    onSelect(item.value);
  };

  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      if (activeAnimationRef.current) {
        activeAnimationRef.current.stop();
        activeAnimationRef.current = null;
      }
    };
  }, []);

  // Calculate screen dimensions for safe positioning
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Ensure dropdown stays within screen bounds
  const safeLeft = Math.min(dropdownPosition.left, screenWidth - dropdownPosition.width - 10);

  // Fallback positioning if measurement fails
  const safePosition = {
    top: isNaN(dropdownPosition.top) ? 50 : dropdownPosition.top,
    left: isNaN(safeLeft) ? 10 : safeLeft,
    width: isNaN(dropdownPosition.width) ? 90 : dropdownPosition.width,
  };

  return (
    <View style={[styles.container, containerStyle]} ref={buttonRef} onLayout={calculatePosition}>
      <TouchableOpacity style={[styles.filterButton, buttonStyle]} onPress={toggleDropdown}>
        <Text style={[styles.filterButtonText, buttonTextStyle]}>{filter}</Text>
        <Icon name="language" size={20} color="#ffffff" style={{ marginRight: 10 }} />
      </TouchableOpacity>

      {isDropdownVisible && (
        <Modal
          transparent={true}
          visible={isDropdownVisible}
          animationType="none"
          onRequestClose={closeDropdown}
          style={{ margin: 0, overflow: "hidden" }}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeDropdown}>
            <View
              style={[
                styles.dropdownModalContainer,
                {
                  top: safePosition.top,
                  left: safePosition.left,
                  width: safePosition.width,
                },
              ]}
            >
              <Animated.View
                style={[styles.dropdownContainer, { height: animatedHeight }, dropdownStyle]}
              >
                {options.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.dropdownItem, dropdownItemStyle]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        dropdownTextStyle,
                        filter === item.label && [styles.activeDropdownText, activeTextStyle],
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default AnimatedDropDown;

const styles = StyleSheet.create({
  container: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 90,
  },
  filterButton: {
    flexDirection: "row",
    padding: 5,
    gap: 5,
    borderWidth: 0.5,
    borderColor: "#fff",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#FFF",
    fontFamily: FontFamily.Inter_Regular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownModalContainer: {
    position: "absolute",
    zIndex: 9999,
  },
  dropdownContainer: {
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
    }),
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  activeDropdownText: {
    fontWeight: "bold",
    color: "#01869e",
  },
});
