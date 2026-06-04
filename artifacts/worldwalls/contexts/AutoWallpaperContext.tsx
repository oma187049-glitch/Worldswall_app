import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { WALLPAPERS } from "@/data/wallpapers";

export type RotationInterval = "daily" | "weekly" | "monthly";

interface AutoWallpaperSettings {
  enabled: boolean;
  interval: RotationInterval;
  lastChangedAt: string | null;
  currentWallpaperId: string | null;
}

interface AutoWallpaperContextValue extends AutoWallpaperSettings {
  setEnabled: (v: boolean) => void;
  setInterval: (v: RotationInterval) => void;
  advanceWallpaper: () => string | null;
}

const KEY = "@worldwalls:autowallpaper";

const DEFAULT: AutoWallpaperSettings = {
  enabled: false,
  interval: "daily",
  lastChangedAt: null,
  currentWallpaperId: null,
};

const AutoWallpaperContext = createContext<AutoWallpaperContextValue>({
  ...DEFAULT,
  setEnabled: () => {},
  setInterval: () => {},
  advanceWallpaper: () => null,
});

export function AutoWallpaperProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<AutoWallpaperSettings>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val) {
        try {
          setSettings({ ...DEFAULT, ...JSON.parse(val) });
        } catch {}
      }
    });
  }, []);

  const save = useCallback((next: AutoWallpaperSettings) => {
    setSettings(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const setEnabled = useCallback(
    (v: boolean) => save({ ...settings, enabled: v }),
    [settings, save]
  );

  const setIntervalVal = useCallback(
    (v: RotationInterval) => save({ ...settings, interval: v }),
    [settings, save]
  );

  const advanceWallpaper = useCallback(() => {
    const all = WALLPAPERS;
    const currentIdx = all.findIndex(
      (w) => w.id === settings.currentWallpaperId
    );
    const nextIdx = (currentIdx + 1) % all.length;
    const next = all[nextIdx];
    save({
      ...settings,
      currentWallpaperId: next.id,
      lastChangedAt: new Date().toISOString(),
    });
    return next.id;
  }, [settings, save]);

  return (
    <AutoWallpaperContext.Provider
      value={{
        ...settings,
        setEnabled,
        setInterval: setIntervalVal,
        advanceWallpaper,
      }}
    >
      {children}
    </AutoWallpaperContext.Provider>
  );
}

export function useAutoWallpaper() {
  return useContext(AutoWallpaperContext);
}
