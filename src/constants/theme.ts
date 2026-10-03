import { Platform } from 'react-native';

// Synchronized with Frontend OKLCH colors (Converted to Hex)
const tintColorLight = '#3a93e6'; // OKLCH(0.65 0.15 250)
const tintColorDark = '#68b5f5';  // OKLCH(0.75 0.12 245)

export const Colors = {
  light: {
    text: '#262f38',         // OKLCH(0.3 0.02 250)
    textSecondary: '#5b646f', // OKLCH(0.5 0.02 250)
    background: '#edf2f8',    // OKLCH(0.96 0.01 250)
    secondaryBackground: '#e0e5eb', // OKLCH(0.92 0.01 250)

    surface: 'rgba(255, 255, 255, 0.8)', // Glass effect
    surfaceStrong: '#ffffff',

    tint: tintColorLight,
    icon: '#262f38',
    tabIconDefault: '#5b646f',
    tabIconSelected: tintColorLight,

    border: '#d9dfe5',       // OKLCH(0.9 0.01 250)
    headerBackground: 'rgba(237, 242, 248, 0.95)',
    chatBackground: '#ffffff',

    success: '#10B981',
    destructive: '#d74745',  // OKLCH(0.6 0.18 25)
    warning: '#F59E0B',

    shadow: 'rgba(38, 47, 56, 0.06)',
    card: '#ffffff',
    cardTransparent: 'rgba(255, 255, 255, 0.9)',
  },

  dark: {
    text: '#c6cedb',         // OKLCH(0.85 0.02 260)
    textSecondary: '#88909c', // OKLCH(0.65 0.02 260)
    background: '#1a2029',    // OKLCH(0.24 0.02 260)
    secondaryBackground: '#2d333d', // OKLCH(0.32 0.02 260)

    surface: 'rgba(33, 39, 48, 0.8)', // OKLCH(0.27 0.02 260) with alpha
    surfaceStrong: '#212730',

    tint: tintColorDark,
    icon: '#c6cedb',
    tabIconDefault: '#88909c',
    tabIconSelected: tintColorDark,

    border: 'rgba(52, 59, 69, 0.3)', // OKLCH(0.35 0.02 260)
    headerBackground: 'rgba(26, 32, 41, 0.95)',
    chatBackground: '#1a2029',

    success: '#10B981',
    destructive: '#d74745',
    warning: '#FBBF24',

    shadow: 'rgba(0, 0, 0, 0.4)',
    card: '#212730',
    cardTransparent: 'rgba(33, 39, 48, 0.9)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Fonts = {
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  }),
  fa: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: "'Vazirmatn', system-ui, sans-serif",
  }),
};