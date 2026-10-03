import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Iconify } from '@/components/ui/Iconify';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

interface FABProps {
  onPress?: () => void;
}

export const FAB = ({ onPress }: FABProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handlePress = () => {
    router.push('/chat/contacts');
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.tint, shadowColor: colors.shadow }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Iconify icon="solar:pen-bold" width={22} height={22} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
});
