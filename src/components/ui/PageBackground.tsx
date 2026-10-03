import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');

export const PageBackground = () => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[colors.tint + '15', 'transparent']}
        style={[styles.bgCircle, { top: -height * 0.1, left: -width * 0.2, width: width * 0.8, height: width * 0.8 }]}
      />
      <LinearGradient
        colors={[colors.success + '10', 'transparent']}
        style={[styles.bgCircle, { bottom: height * 0.1, right: -width * 0.3, width: width * 0.9, height: width * 0.9 }]}
      />
      <View style={[styles.bgLine, { top: height * 0.4, left: -width * 0.1, backgroundColor: colors.tint + '05', transform: [{ rotate: '45deg' }] }]} />
      <View style={[styles.bgLine, { bottom: height * 0.3, right: -width * 0.1, backgroundColor: colors.success + '05', transform: [{ rotate: '45deg' }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  bgLine: {
    position: 'absolute',
    width: width * 1.5,
    height: 1,
  },
});
