import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useStore } from "@/hooks/use-store";
import { APP_FONT_OPTIONS } from "@/constants/theme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const fontFamily = useStore((state) => state.fontFamily);
  const fontSizeLevel = useStore((state) => state.fontSizeLevel);

  const activeFontOption = APP_FONT_OPTIONS.find((f) => f.id === fontFamily);
  const fontStyle = activeFontOption?.fontFamilyStyle;
  const fontScale = (fontSizeLevel || 9) / 9;

  const baseStyle =
    type === "default"
      ? styles.default
      : type === "title"
        ? styles.title
        : type === "defaultSemiBold"
          ? styles.defaultSemiBold
          : type === "subtitle"
            ? styles.subtitle
            : type === "link"
              ? styles.link
              : styles.default;

  const fontSizeVal =
    "fontSize" in baseStyle ? (baseStyle as any).fontSize : undefined;
  const lineHeightVal =
    "lineHeight" in baseStyle ? (baseStyle as any).lineHeight : undefined;

  const scaledFontSize = fontSizeVal
    ? Math.round(fontSizeVal * fontScale)
    : undefined;
  const scaledLineHeight = lineHeightVal
    ? Math.round(lineHeightVal * fontScale)
    : undefined;

  return (
    <Text
      style={[
        baseStyle,
        {
          color,
          fontFamily: fontStyle,
          fontSize: scaledFontSize,
          lineHeight: scaledLineHeight,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
