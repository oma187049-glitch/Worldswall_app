import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { getWallpaperById } from "@/data/wallpapers";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function WallpaperDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const wallpaper = getWallpaperById(id ?? "");

  const heartScale = useSharedValue(1);
  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleFavorite = useCallback(() => {
    if (!wallpaper) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    toggleFavorite(wallpaper.id);
  }, [wallpaper, heartScale, toggleFavorite]);

  const handleDownload = useCallback(async () => {
    if (!wallpaper || downloading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS === "web") {
      Alert.alert(
        "Download",
        "On web, right-click the wallpaper image and choose 'Save Image'."
      );
      return;
    }

    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access to save wallpapers."
        );
        setDownloading(false);
        return;
      }

      const filename = `${wallpaper.id}_4k.jpg`;
      const downloadUri = `${FileSystem.cacheDirectory}${filename}`;

      const download = FileSystem.createDownloadResumable(
        wallpaper.fullUrl,
        downloadUri
      );
      const res = await download.downloadAsync();
      if (!res?.uri) throw new Error("Download failed");

      await MediaLibrary.saveToLibraryAsync(res.uri);
      setDownloaded(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Saved!",
        "4K wallpaper saved to your Photos library. Open Photos to set it as your wallpaper.",
        [{ text: "OK" }]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to save wallpaper. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [wallpaper, downloading]);

  const handleSetWallpaper = useCallback(async () => {
    if (!wallpaper) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS === "web") {
      Alert.alert("Set Wallpaper", "Open the wallpaper in your browser and save it to set as wallpaper.");
      return;
    }

    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow photo library access.");
        setDownloading(false);
        return;
      }

      const filename = `${wallpaper.id}_wallpaper.jpg`;
      const downloadUri = `${FileSystem.cacheDirectory}${filename}`;

      const download = FileSystem.createDownloadResumable(
        wallpaper.fullUrl,
        downloadUri
      );
      const res = await download.downloadAsync();
      if (!res?.uri) throw new Error("Download failed");

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(res.uri, {
          mimeType: "image/jpeg",
          dialogTitle: "Set as Wallpaper",
        });
      } else {
        await MediaLibrary.saveToLibraryAsync(res.uri);
        Alert.alert(
          "Saved to Photos",
          Platform.OS === "ios"
            ? "Open Photos, find this image, tap Share, then 'Use as Wallpaper'."
            : "Open your Gallery, find this image, and select 'Set as wallpaper'."
        );
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [wallpaper]);

  if (!wallpaper) {
    return (
      <View style={[styles.error, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          Wallpaper not found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fav = isFavorite(wallpaper.id);
  const topPad = Platform.OS === "web" ? 67 + insets.top : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: wallpaper.fullUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={400}
      />

      {/* Top gradient */}
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={[styles.topGradient, { paddingTop: topPad }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#ffffff" />
        </Pressable>
        <View style={styles.regionBadge}>
          <Text style={styles.regionText}>{wallpaper.region}</Text>
        </View>
      </LinearGradient>

      {/* Bottom gradient */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.95)"]}
        style={[styles.bottomPanel, { paddingBottom: bottomPad + 24 }]}
      >
        {/* Info */}
        <View style={styles.wallpaperInfo}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>{wallpaper.location}</Text>
          </View>
          <Text style={styles.wallpaperTitle}>{wallpaper.title}</Text>
          <View style={styles.badge4k}>
            <Text style={styles.badge4kText}>4K ULTRA HD</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Favorite */}
          <Animated.View style={heartAnimStyle}>
            <TouchableOpacity
              onPress={handleFavorite}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: fav
                    ? "rgba(255,71,87,0.25)"
                    : "rgba(255,255,255,0.12)",
                },
              ]}
              activeOpacity={0.7}
            >
              <Feather
                name="heart"
                size={22}
                color={fav ? "#ff4757" : "#ffffff"}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Set Wallpaper (primary) */}
          <TouchableOpacity
            onPress={handleSetWallpaper}
            disabled={downloading}
            style={styles.setBtn}
            activeOpacity={0.85}
          >
            {downloading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Feather name="smartphone" size={20} color="#000000" />
                <Text style={styles.setBtnText}>Set Wallpaper</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Download */}
          <TouchableOpacity
            onPress={handleDownload}
            disabled={downloading}
            style={[
              styles.actionBtn,
              {
                backgroundColor: downloaded
                  ? "rgba(46,213,115,0.2)"
                  : "rgba(255,255,255,0.12)",
              },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name={downloaded ? "check" : "download"}
              size={22}
              color={downloaded ? "#2ed573" : "#ffffff"}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 0,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  regionBadge: {
    backgroundColor: "rgba(232,184,75,0.85)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  regionText: {
    color: "#000000",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  wallpaperInfo: {
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  locationText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  wallpaperTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  badge4k: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(232,184,75,0.25)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(232,184,75,0.5)",
  },
  badge4kText: {
    color: "#e8b84b",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  setBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e8b84b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  setBtnText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  error: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
});
