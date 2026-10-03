import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useStore } from './use-store';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const themeMode = useStore((state) => state.themeMode);

  if (themeMode === 'system') {
    return systemColorScheme ?? 'light';
  }
  return themeMode;
}
