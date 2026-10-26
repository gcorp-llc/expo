import { Redirect } from 'expo-router';
import { useStore } from '@/hooks/use-store';

export default function IndexScreen() {
  const { isAuthenticated, isGuest } = useStore();
  const hasHydrated = useStore.persist.hasHydrated();

  if (!hasHydrated) {
    return null;
  }

  if (isAuthenticated || isGuest) {
    return <Redirect href='/home' />;
  }

  return <Redirect href='/auth/welcome' />;
}
