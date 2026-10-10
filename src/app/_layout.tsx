import "../../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { activateKeepAwakeAsync } from "expo-keep-awake";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FilterSlide } from "@/components/ui/FilterSlide";
import { FloatingDrawer } from "@/components/ui/FloatingDrawer";
import { SearchSlide } from "@/components/ui/SearchSlide";
import { CustomToastProvider } from "@/components/ui/CustomToast";
import { Colors } from "@/constants/theme";
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
  const colorScheme = useColorScheme();
  const { language } = useStore();
  const [hasHydrated, setHasHydrated] = useState(
    useStore.persist.hasHydrated(),
  );

  // useEffect(() => {
  //   if (__DEV__) {
  //     activateKeepAwakeAsync().catch(() => {});
  //   }
  // }, []);

  useEffect(() => {
    const unsubscribe = useStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ErrorBoundary>
          <View
            style={[
              styles.container,
              { direction: language === "fa" ? "rtl" : "ltr" },
            ]}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "ios_from_right",
                contentStyle: { backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen name="index" options={{ animation: "none" }} />
              <Stack.Screen name="(tabs)" />
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
              </>
            )}

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
