import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { useStore } from "./use-store";

/**
 * Custom color scheme hook supporting Zustand themeMode and accent colors on web
 */
export function useColorScheme(): "light" | "dark" {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme();
  const themeMode = useStore((state) => state.themeMode);
  // Subscription ensures components re-render when selected accent color changes
  useStore((state) => state.selectedColorTheme);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (themeMode === "system") {
    return systemColorScheme === "dark" ? "dark" : "light";
  }

  return themeMode === "dark" ? "dark" : "light";
}
