import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import {
  RotationInterval,
  useAutoWallpaper,
} from "@/contexts/AutoWallpaperContext";
import { getWallpaperById } from "@/data/wallpapers";

const INTERVALS: { label: string; value: RotationInterval; desc: string }[] = [
  { label: "Daily", value: "daily", desc: "Change wallpaper every day" },
  { label: "Weekly", value: "weekly", desc: "Change wallpaper every week" },
  { label: "Monthly", value: "monthly", desc: "Change wallpaper every month" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    enabled,
    interval,
    currentWallpaperId,
    lastChangedAt,
    setEnabled,
    setInterval,
    advanceWallpaper,
  } = useAutoWallpaper();

  const currentWallpaper = currentWallpaperId
    ? getWallpaperById(currentWallpaperId)
    : null;

  const topPad = Platform.OS === "web" ? 67 + insets.top : insets.top;

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topPad + 12,
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          Settings
        </Text>

        {/* Auto Wallpaper Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            AUTO WALLPAPER
          </Text>

          {/* Enable toggle */}
          <View
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconBg,
                  { backgroundColor: colors.primary + "22" },
                ]}
              >
                <Feather name="refresh-cw" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.foreground }]}>
                  Auto-Rotate
                </Text>
                <Text
                  style={[styles.rowDesc, { color: colors.mutedForeground }]}
                >
                  Suggest a new wallpaper automatically
                </Text>
              </View>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Current wallpaper info */}
          {enabled && (
            <View
              style={[styles.row, { borderBottomColor: colors.border }]}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: colors.primary + "22" },
                  ]}
                >
                  <Feather name="image" size={18} color={colors.primary} />
                </View>
                <View>
                  <Text
                    style={[styles.rowTitle, { color: colors.foreground }]}
                  >
                    Current Wallpaper
                  </Text>
                  <Text
                    style={[
                      styles.rowDesc,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {currentWallpaper
                      ? `${currentWallpaper.title} — ${currentWallpaper.location}`
                      : "None selected"}
                  </Text>
                  <Text
                    style={[
                      styles.rowDesc,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Last changed: {formatDate(lastChangedAt)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Advance button */}
          {enabled && (
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: colors.primary + "22" },
                  ]}
                >
                  <Feather name="skip-forward" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.rowTitle, { color: colors.foreground }]}
                  >
                    Next Wallpaper
                  </Text>
                  <Text
                    style={[
                      styles.rowDesc,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Pick the next wallpaper in the rotation
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => advanceWallpaper()}
                style={[
                  styles.advanceBtn,
                  { backgroundColor: colors.primary, borderRadius: 8 },
                ]}
                activeOpacity={0.8}
              >
                <Feather name="chevron-right" size={18} color={colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Interval selection */}
        {enabled && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[styles.sectionLabel, { color: colors.mutedForeground }]}
            >
              ROTATION INTERVAL
            </Text>
            {INTERVALS.map((opt, i) => {
              const isSelected = interval === opt.value;
              const isLast = i === INTERVALS.length - 1;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setInterval(opt.value)}
                  activeOpacity={0.7}
                  style={[
                    styles.row,
                    !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.rowTitle,
                          {
                            color: isSelected
                              ? colors.primary
                              : colors.foreground,
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={[
                          styles.rowDesc,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {opt.desc}
                      </Text>
                    </View>
                  </View>
                  {isSelected && (
                    <Feather name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* About */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            ABOUT
          </Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.iconBg,
                  { backgroundColor: colors.primary + "22" },
                ]}
              >
                <Feather name="globe" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.foreground }]}>
                  WorldWalls
                </Text>
                <Text
                  style={[styles.rowDesc, { color: colors.mutedForeground }]}
                >
                  4K wallpapers from around the globe
                </Text>
                <Text
                  style={[styles.rowDesc, { color: colors.mutedForeground }]}
                >
                  Version 1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  section: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  advanceBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
