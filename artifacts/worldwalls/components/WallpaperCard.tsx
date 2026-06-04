import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Wallpaper } from "@/data/wallpapers";
import { useFavorites } from "@/contexts/FavoritesContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

export function WallpaperCard({ wallpaper }: WallpaperCardProps) {
  const router = useRouter();
  const colors = useColors();
  const { isFavorite } = useFavorites();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15 });
  }, [scale]);

  const handlePress = useCallback(() => {
    router.push(`/wallpaper/${wallpaper.id}`);
  }, [router, wallpaper.id]);

  const fav = isFavorite(wallpaper.id);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle, { borderRadius: colors.radius }]}
    >
      <Image
        source={{ uri: wallpaper.thumbnailUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={styles.gradient}
      />
      {fav && (
        <View style={styles.favBadge}>
          <Feather name="heart" size={12} color="#ff4757" />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {wallpaper.title}
        </Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={10} color="rgba(255,255,255,0.7)" />
          <Text style={styles.location} numberOfLines={1}>
            {wallpaper.location}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

interface FeaturedCardProps {
  wallpaper: Wallpaper;
  width: number;
}

export function FeaturedCard({ wallpaper, width }: FeaturedCardProps) {
  const router = useRouter();
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15 });
  }, [scale]);

  return (
    <AnimatedPressable
      onPress={() => router.push(`/wallpaper/${wallpaper.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.featuredCard,
        animatedStyle,
        { width, borderRadius: colors.radius + 4 },
      ]}
    >
      <Image
        source={{ uri: wallpaper.thumbnailUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.featuredGradient}
      />
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>FEATURED</Text>
      </View>
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredTitle}>{wallpaper.title}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color="rgba(255,255,255,0.8)" />
          <Text style={styles.featuredLocation}>{wallpaper.location}</Text>
        </View>
        <View style={styles.regionTag}>
          <Text style={styles.regionTagText}>{wallpaper.region}</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  favBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  info: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  title: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 3,
  },
  location: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredCard: {
    height: 220,
    overflow: "hidden",
    marginRight: 16,
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  featuredBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(232,184,75,0.9)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
  },
  featuredInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  featuredTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  featuredLocation: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginLeft: 5,
  },
  regionTag: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  regionTagText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
