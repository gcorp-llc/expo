import "../../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import "react-native-reanimated";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FilterSlide } from "@/components/ui/FilterSlide";
import { FloatingDrawer } from "@/components/ui/FloatingDrawer";
import { SearchSlide } from "@/components/ui/SearchSlide";
import { CustomToastProvider } from "@/components/ui/CustomToast";
import { CustomModalProvider } from "@/components/ui/CustomModal";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Colors, APP_FONT_OPTIONS } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStore } from "@/hooks/use-store";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { language, fontFamily, fontSizeLevel } = useStore();
  const [hasHydrated, setHasHydrated] = useState(
    useStore.persist.hasHydrated(),
  );

  const [fontsLoaded, fontError] = useFonts({
    Vazirmatn: require("../../assets/fonts/Vazirmatn.ttf"),
    Shabnam: require("../../assets/fonts/Shabnam.ttf"),
    Sahel: require("../../assets/fonts/Sahel.ttf"),
  });

  useEffect(() => {
    const unsubscribe = useStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hasHydrated && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated, fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === "android") {
      (RNStatusBar as any).setBackgroundColor?.(colors.statusBarBackground);
    }
  }, [colors.statusBarBackground]);

  // Dynamic Web CSS Injection for Persian Font Families & Font Sizing
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      let styleEl = document.getElementById(
        "kutik-font-styles",
      ) as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "kutik-font-styles";
        document.head.appendChild(styleEl);
      }

      const fontOption = APP_FONT_OPTIONS.find((f) => f.id === fontFamily);
      const fontCSS =
        fontOption?.fontFamilyStyle || "'Vazirmatn', system-ui, sans-serif";
      const scaleVal = (fontSizeLevel || 9) / 9;

      styleEl.innerHTML = `
        @font-face {
          font-family: 'Vazirmatn';
          src: url('/assets/fonts/Vazirmatn.ttf') format('truetype');
          font-display: swap;
        }
        @font-face {
          font-family: 'Shabnam';
          src: url('/assets/fonts/Shabnam.ttf') format('truetype');
          font-display: swap;
        }
        @font-face {
          font-family: 'Sahel';
          src: url('/assets/fonts/Sahel.ttf') format('truetype');
          font-display: swap;
        }

        html, body, #root, [data-reactroot] {
          background-color: ${colors.background} !important;
          transition: background-color 0.2s ease-in-out;
        }

        body, #root, [class*="r-"], text, button, input, textarea {
          font-family: ${fontCSS} !important;
        }

        :root {
          --app-font-scale: ${scaleVal};
        }
      `;
    }
  }, [fontFamily, fontSizeLevel, colors.background]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ErrorBoundary>
          <View
            style={[
              styles.container,
              {
                direction: language === "fa" ? "rtl" : "ltr",
                backgroundColor: colors.background,
              },
            ]}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="index" options={{ animation: "none" }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="profile" options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="settings/index" options={{ animation: "slide_from_right" }} />
              <Stack.Screen
                name="auth/welcome"
                options={{ animation: "fade" }}
              />
              <Stack.Screen name="auth/phone" />
              <Stack.Screen name="auth/verify" />
              <Stack.Screen name="auth/profile" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>

            {hasHydrated && (
              <>
                <SearchSlide />
                <FilterSlide />
                <FloatingDrawer />
                <CustomToastProvider />
                <CustomModalProvider />
                <BottomToolbar />
              </>
            )}

            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: insets.top,
                backgroundColor: colors.statusBarBackground,
                zIndex: 9999,
                pointerEvents: "none",
              }}
            />
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </View>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
