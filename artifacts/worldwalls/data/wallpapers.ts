export type Region =
  | "All"
  | "Asia"
  | "Europe"
  | "Americas"
  | "Africa"
  | "Oceania"
  | "Arctic";

export interface Wallpaper {
  id: string;
  title: string;
  location: string;
  region: Exclude<Region, "All">;
  thumbnailUrl: string;
  fullUrl: string;
  featured?: boolean;
}

function picsum(id: number): { thumb: string; full: string } {
  return {
    thumb: `https://picsum.photos/id/${id}/800/450`,
    full: `https://picsum.photos/id/${id}/3840/2160`,
  };
}

export const REGIONS: Region[] = [
  "All",
  "Asia",
  "Europe",
  "Americas",
  "Africa",
  "Oceania",
  "Arctic",
];

export const WALLPAPERS: Wallpaper[] = [
  // Asia
  {
    id: "a1",
    title: "Mount Fuji Sunrise",
    location: "Japan",
    region: "Asia",
    thumbnailUrl: picsum(472).thumb,
    fullUrl: picsum(472).full,
    featured: true,
  },
  {
    id: "a2",
    title: "Misty Mountain Peaks",
    location: "China",
    region: "Asia",
    thumbnailUrl: picsum(628).thumb,
    fullUrl: picsum(628).full,
  },
  {
    id: "a3",
    title: "Himalayan Valley",
    location: "Nepal",
    region: "Asia",
    thumbnailUrl: picsum(534).thumb,
    fullUrl: picsum(534).full,
    featured: true,
  },
  {
    id: "a4",
    title: "Ancient Temple Dawn",
    location: "Thailand",
    region: "Asia",
    thumbnailUrl: picsum(1046).thumb,
    fullUrl: picsum(1046).full,
  },

  // Europe
  {
    id: "e1",
    title: "Swiss Alpine Lake",
    location: "Switzerland",
    region: "Europe",
    thumbnailUrl: picsum(373).thumb,
    fullUrl: picsum(373).full,
    featured: true,
  },
  {
    id: "e2",
    title: "Norwegian Fjords",
    location: "Norway",
    region: "Europe",
    thumbnailUrl: picsum(29).thumb,
    fullUrl: picsum(29).full,
  },
  {
    id: "e3",
    title: "Scottish Highlands",
    location: "Scotland",
    region: "Europe",
    thumbnailUrl: picsum(219).thumb,
    fullUrl: picsum(219).full,
  },
  {
    id: "e4",
    title: "Tuscan Countryside",
    location: "Italy",
    region: "Europe",
    thumbnailUrl: picsum(511).thumb,
    fullUrl: picsum(511).full,
  },

  // Americas
  {
    id: "m1",
    title: "Grand Canyon Sunset",
    location: "Arizona, USA",
    region: "Americas",
    thumbnailUrl: picsum(505).thumb,
    fullUrl: picsum(505).full,
    featured: true,
  },
  {
    id: "m2",
    title: "Rocky Mountain Vista",
    location: "Colorado, USA",
    region: "Americas",
    thumbnailUrl: picsum(392).thumb,
    fullUrl: picsum(392).full,
  },
  {
    id: "m3",
    title: "Patagonia Glaciers",
    location: "Argentina",
    region: "Americas",
    thumbnailUrl: picsum(206).thumb,
    fullUrl: picsum(206).full,
  },
  {
    id: "m4",
    title: "Banff National Park",
    location: "Canada",
    region: "Americas",
    thumbnailUrl: picsum(237).thumb,
    fullUrl: picsum(237).full,
  },

  // Africa
  {
    id: "f1",
    title: "Serengeti Sunrise",
    location: "Tanzania",
    region: "Africa",
    thumbnailUrl: picsum(255).thumb,
    fullUrl: picsum(255).full,
    featured: true,
  },
  {
    id: "f2",
    title: "Sahara Dunes",
    location: "Morocco",
    region: "Africa",
    thumbnailUrl: picsum(57).thumb,
    fullUrl: picsum(57).full,
  },
  {
    id: "f3",
    title: "Savanna Twilight",
    location: "Kenya",
    region: "Africa",
    thumbnailUrl: picsum(488).thumb,
    fullUrl: picsum(488).full,
  },
  {
    id: "f4",
    title: "Cape of Good Hope",
    location: "South Africa",
    region: "Africa",
    thumbnailUrl: picsum(359).thumb,
    fullUrl: picsum(359).full,
  },

  // Oceania
  {
    id: "o1",
    title: "Milford Sound",
    location: "New Zealand",
    region: "Oceania",
    thumbnailUrl: picsum(217).thumb,
    fullUrl: picsum(217).full,
    featured: true,
  },
  {
    id: "o2",
    title: "Coral Sea",
    location: "Australia",
    region: "Oceania",
    thumbnailUrl: picsum(47).thumb,
    fullUrl: picsum(47).full,
  },
  {
    id: "o3",
    title: "Pacific Lagoon",
    location: "Fiji",
    region: "Oceania",
    thumbnailUrl: picsum(110).thumb,
    fullUrl: picsum(110).full,
  },
  {
    id: "o4",
    title: "Tropical Rainforest",
    location: "Papua New Guinea",
    region: "Oceania",
    thumbnailUrl: picsum(574).thumb,
    fullUrl: picsum(574).full,
  },

  // Arctic
  {
    id: "r1",
    title: "Northern Lights",
    location: "Iceland",
    region: "Arctic",
    thumbnailUrl: picsum(175).thumb,
    fullUrl: picsum(175).full,
    featured: true,
  },
  {
    id: "r2",
    title: "Arctic Tundra",
    location: "Norway",
    region: "Arctic",
    thumbnailUrl: picsum(437).thumb,
    fullUrl: picsum(437).full,
  },
  {
    id: "r3",
    title: "Frozen Landscape",
    location: "Greenland",
    region: "Arctic",
    thumbnailUrl: picsum(65).thumb,
    fullUrl: picsum(65).full,
  },
  {
    id: "r4",
    title: "Glacial Coast",
    location: "Alaska, USA",
    region: "Arctic",
    thumbnailUrl: picsum(260).thumb,
    fullUrl: picsum(260).full,
  },
];

export const FEATURED_WALLPAPERS = WALLPAPERS.filter((w) => w.featured);

export function getWallpaperById(id: string): Wallpaper | undefined {
  return WALLPAPERS.find((w) => w.id === id);
}

export function getWallpapersByRegion(region: Region): Wallpaper[] {
  if (region === "All") return WALLPAPERS;
  return WALLPAPERS.filter((w) => w.region === region);
}
