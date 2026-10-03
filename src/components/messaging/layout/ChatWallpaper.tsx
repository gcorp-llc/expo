import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface WallpaperProps {
  type: 'gradient' | 'solid' | 'pattern';
  color?: string;
}

// Telegram-like doodle pattern as Base64 SVG
const DOODLE_PATTERN = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxwYXRoIGQ9Ik0yMCAyMGg4djhIMjB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xIi8+CjxwYXRoIGQ9Ik00MCA0MGg0djRINDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xIi8+CjxwYXRoIGQ9Ik02MCAyMGg0djRINDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xIi8+CjxwYXRoIGQ9Ik04MCA0MGg4djhIODB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xIi8+CjxwYXRoIGQ9Ik0xMDAgMjBoNHY0SDEwMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz4KPHBhdGggZD0iTTIwIDYwaDR2NEgyMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz4KPHBhdGggZD0iTTQwIDgwaDh2OEg0MHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz4KPHBhdGggZD0iTTgwIDYwaDR2NEg4MHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz4KPHBhdGggZD0iTTEwMCA4MGg4djhIMTAweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMSIvPgo8cGF0aCBkPSJNMjAgMTAwaDh2OEgyMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz4KPHBhdGggZD0iTTYwIDYwaDR2NEg2MHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz4KPHBhdGggZD0iTTYwIDEwMGg0djRINjB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4xIi8+CjxwYXRoIGQ9Ik04MCAxMDBoNHY0SDgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMSIvPgo8L2c+Cjwvc3ZnPg==`;

export const ChatWallpaper = ({ type, color }: WallpaperProps) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const bgColor = color || colors.background;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]}>
      {type === 'pattern' && (
        <ImageBackground
          source={{ uri: DOODLE_PATTERN }}
          style={StyleSheet.absoluteFill}
          resizeMode="repeat"
          imageStyle={{ opacity: colorScheme === 'dark' ? 0.03 : 0.05 }}
        />
      )}
    </View>
  );
};
