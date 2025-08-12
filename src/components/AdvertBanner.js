import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Color as COLORS, FONTS, SIZES } from "../constants/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

/**
 * Advertisement Banner with auto-scrolling effect - Full Width
 * @param {Array} advertisements - List of advertisement objects
 * @param {Function} onBannerPress - Function to call when banner is pressed
 * @returns {JSX.Element}
 */
const AdvertBanner = ({ advertisements, onBannerPress }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (advertisements.length > 0) {
        currentIndex.current = (currentIndex.current + 1) % advertisements.length;
        flatListRef.current?.scrollToIndex({
          index: currentIndex.current,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [advertisements]);

  const handleMomentumScrollEnd = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const newIndex = Math.floor(contentOffset.x / viewSize.width);
    currentIndex.current = newIndex;
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.itemContainer}
        onPress={() => onBannerPress && onBannerPress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.gradient}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={advertisements}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToInterval={width}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />

      <View style={styles.pagination}>
        {advertisements.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: width,
  },
  flatListContent: {
    // Remove padding to make images full width
  },
  itemContainer: {
    width: width,
    height: 280,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  textContainer: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: 4,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.white,
    opacity: 0.8,
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default AdvertBanner;
