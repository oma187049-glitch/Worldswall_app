import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { Region, REGIONS } from "@/data/wallpapers";

const REGION_ICONS: Record<Region, string> = {
  All: "🌍",
  Asia: "🗾",
  Europe: "🏔",
  Americas: "🌎",
  Africa: "🦁",
  Oceania: "🌊",
  Arctic: "❄",
};

interface RegionFilterProps {
  selected: Region;
  onSelect: (region: Region) => void;
}

export function RegionFilter({ selected, onSelect }: RegionFilterProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {REGIONS.map((region) => {
        const isSelected = region === selected;
        return (
          <TouchableOpacity
            key={region}
            onPress={() => onSelect(region)}
            activeOpacity={0.7}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.secondary,
                borderRadius: 20,
              },
            ]}
          >
            <Text style={styles.icon}>{REGION_ICONS[region]}</Text>
            <Text
              style={[
                styles.label,
                {
                  color: isSelected
                    ? colors.primaryForeground
                    : colors.foreground,
                  fontFamily: isSelected ? "Inter_600SemiBold" : "Inter_400Regular",
                },
              ]}
            >
              {region}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
    paddingVertical: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
  },
});
