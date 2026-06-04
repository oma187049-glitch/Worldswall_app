import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/contexts/FavoritesContext";
import { WALLPAPERS, Wallpaper } from "@/data/wallpapers";
import { WallpaperCard } from "@/components/WallpaperCard";

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();

  const favWallpapers = WALLPAPERS.filter((w) => favorites.includes(w.id));

  const topPad = Platform.OS === "web" ? 67 + insets.top : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {favWallpapers.length === 0 ? (
        <View
          style={[
            styles.empty,
            { paddingTop: topPad + 60 },
          ]}
        >
          <Feather name="heart" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No favorites yet
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
          >
            Tap the heart on any wallpaper to save it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favWallpapers}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.list,
            {
              paddingTop: topPad + 16,
              paddingBottom:
                Platform.OS === "web" ? 34 + 84 : insets.bottom + 80,
            },
          ]}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Favorites
              </Text>
              <Text
                style={[styles.count, { color: colors.mutedForeground }]}
              >
                {favWallpapers.length}{" "}
                {favWallpapers.length === 1 ? "wallpaper" : "wallpapers"}
              </Text>
            </View>
          }
          renderItem={({ item }: { item: Wallpaper }) => (
            <WallpaperCard wallpaper={item} />
          )}
          scrollEnabled={!!favWallpapers.length}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});
