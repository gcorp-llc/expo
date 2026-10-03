import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { ErrorInfo, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  colorScheme: "light" | "dark"; // اضافه شد: به‌جای صدا زدن هوک داخل کلاس
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary for catching React errors
 * توجه: این کلاس دیگر هیچ هوکی صدا نمی‌زند — colorScheme از props می‌آید.
 * برای استفاده، از export پایین فایل (ErrorBoundary) استفاده کن، نه این کلاس مستقیماً.
 */
class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught error:", error);
    console.error("Error Info:", errorInfo);
    // You can log to error tracking service here (Sentry, etc)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // ✅ دیگر هوک صدا زده نمی‌شود، مستقیماً از props می‌خوانیم
      const colors = Colors[this.props.colorScheme];

      // Use provided fallback or default error UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.destructive }]}>
              ⚠️ Something went wrong
            </Text>
            <Text style={[styles.message, { color: colors.text }]}>
              {this.state.error.message}
            </Text>
            {__DEV__ && (
              <Text style={[styles.stack, { color: colors.textSecondary }]}>
                {this.state.error.stack}
              </Text>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.tint }]}
              onPress={this.resetError}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper تابعی — اینجا صدا زدن هوک کاملاً مجاز است چون یک function component است.
 * از بیرون دقیقاً مثل قبل استفاده می‌شود: <ErrorBoundary>...</ErrorBoundary>
 * پس _layout.tsx نیازی به تغییر ندارد.
 */
export function ErrorBoundary(
  props: Omit<ErrorBoundaryProps, "colorScheme">,
) {
  const colorScheme = useColorScheme(); // ✅ مجاز است، این یک function component است
  return <ErrorBoundaryClass {...props} colorScheme={colorScheme ?? "light"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  stack: {
    fontSize: 12,
    fontFamily: "monospace",
    textAlign: "left",
    maxHeight: 150,
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
