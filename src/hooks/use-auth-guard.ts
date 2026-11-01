import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useStore } from '@/hooks/use-store';

/**
 * Route protection hook for Expo Router.
 * Redirects unauthenticated users to /auth/welcome when trying to access protected screens.
 */
export function useAuthGuard() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === 'auth';
    const isPublicScreen =
      firstSegment === '(tabs)' ||
      !firstSegment ||
      firstSegment === 'index' ||
      firstSegment === 'product';

    if (!isAuthenticated && !inAuthGroup && !isPublicScreen) {
      // User is trying to access a protected screen while not authenticated
      router.replace('/auth/welcome');
    }
  }, [isAuthenticated, segments, router]);
}
