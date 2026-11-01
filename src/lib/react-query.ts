import { QueryClient } from '@tanstack/react-query';
import { zustandStorage } from './storage';

// =============================================================================
// Standardized Query Keys
// =============================================================================
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (filters?: Record<string, any>) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    related: (id: string) => ['products', 'related', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (status?: string) => ['orders', 'list', status] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
    shop: ['profile', 'shop'] as const,
  },
};

// =============================================================================
// Query Client with Offline Caching Defaults
// =============================================================================
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 60 * 24, // 24 hours in cache
      retry: (failureCount, error: any) => {
        // Never retry 401 or 403
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// =============================================================================
// MMKV/AsyncStorage Offline Cache Persister Helper
// =============================================================================
const REACT_QUERY_CACHE_KEY = 'cardiani_react_query_cache';

export async function persistQueryCache(client: QueryClient = queryClient): Promise<void> {
  try {
    const dehydrated = client.getQueryCache().getAll().map((query) => ({
      queryKey: query.queryKey,
      state: query.state,
    }));
    await zustandStorage.setItem(REACT_QUERY_CACHE_KEY, JSON.stringify(dehydrated));
  } catch (err) {
    console.warn('[React Query] Failed to persist cache:', err);
  }
}

export async function restoreQueryCache(client: QueryClient = queryClient): Promise<void> {
  try {
    const cached = await zustandStorage.getItem(REACT_QUERY_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          client.setQueryData(item.queryKey, item.state?.data);
        });
      }
    }
  } catch (err) {
    console.warn('[React Query] Failed to restore cache:', err);
  }
}
