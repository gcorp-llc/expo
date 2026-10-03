import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useStore } from './use-store';

export function useColorScheme(): 'light' | 'dark' {
  const systemColorScheme = useNativeColorScheme();
  const themeMode = useStore((state) => state.themeMode);

  if (themeMode === 'system') {
    return (systemColorScheme === 'dark' ? 'dark' : 'light');
  }
  return themeMode === 'dark' ? 'dark' : 'light';
}
