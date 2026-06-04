import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import {
  FEATURED_WALLPAPERS,
  getWallpapersByRegion,
  Region,
  WALLPAPERS,
} from "@/data/wallpapers";
import { WallpaperCard, FeaturedCard } from "@/components/WallpaperCard";
import { RegionFilter } from "@/components/RegionFilter";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FEATURED_CARD_WIDTH = SCREEN_WIDTH * 0.78;

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedRegion, setSelectedRegion] = useState<Region>("All");

  const wallpapers = getWallpapersByRegion(selectedRegion);

  const renderWallpaper = useCallback(
    ({ item, index }: { item: (typeof WALLPAPERS)[0]; index: number }) => (
      <WallpaperCard wallpaper={item} />
    ),
    []
  );

  const topPad =
    Platform.OS === "web" ? 67 + insets.top : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topPad + 12,
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : insets.bottom + 80,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { color: colors.primary }]}>
            WorldWalls
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            4K Wallpapers from Earth
          </Text>
        </View>

        {/* Featured */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Featured
        </Text>
        <FlatList
          data={FEATURED_WALLPAPERS}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <FeaturedCard wallpaper={item} width={FEATURED_CARD_WIDTH} />
          )}
          snapToInterval={FEATURED_CARD_WIDTH + 16}
          decelerationRate="fast"
          scrollEnabled={FEATURED_WALLPAPERS.length > 0}
        />

        {/* Region filter */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.foreground, marginTop: 8 },
          ]}
        >
          Explore
        </Text>
        <RegionFilter
          selected={selectedRegion}
          onSelect={setSelectedRegion}
        />

        {/* Grid */}
        <View style={styles.grid}>
          {wallpapers.map((w) => (
            <WallpaperCard key={w.id} wallpaper={w} />
          ))}
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
    flexGrow: 1,
  },
  headerRow: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 0,
  },
});
