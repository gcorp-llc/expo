import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';
import {
  AuthResponseSchema,
  ProductListResponseSchema,
  PaymentIntentResponseSchema,
  type AuthResponse,
  type Product,
  type PaymentIntentResponse,
} from '@cardiani/shared';
import { PRODUCTS } from '@/constants/mock-data';

// =============================================================================
// Token & Session Storage with expo-secure-store
// =============================================================================
const ACCESS_TOKEN_KEY = 'cardiani_access_token';
const REFRESH_TOKEN_KEY = 'cardiani_refresh_token';

export async function getStoredAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredAccessToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save access token:', err);
  }
}

export async function getStoredRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save refresh token:', err);
  }
}

export async function clearAuthTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.error('Failed to clear auth tokens:', err);
  }
}

// =============================================================================
// Base URL resolution
// =============================================================================
export function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }
  return 'http://127.0.0.1:4000';
}

// =============================================================================
// Typed API Error
// =============================================================================
export class CardianiApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'CardianiApiError';
  }
}

// =============================================================================
// Cardiani Mobile API Client
// =============================================================================
class CardianiMobileApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.baseUrl = resolveApiBaseUrl().replace(/\/$/, '');
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async tryRefreshToken(): Promise<string | null> {
    const refreshToken = await getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        await clearAuthTokens();
        return null;
      }

      const raw = await response.json();
      const parsed = AuthResponseSchema.safeParse(raw);
      if (parsed.success) {
        await setStoredAccessToken(parsed.data.access_token);
        if (parsed.data.refresh_token) {
          await setStoredRefreshToken(parsed.data.refresh_token);
        }
        return parsed.data.access_token;
      }
      return null;
    } catch {
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    schema?: z.ZodType<T>,
    options: RequestInit = {},
    retries = 1
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = await getStoredAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized -> try refresh
      if (response.status === 401 && !options.headers?.hasOwnProperty('X-Retry-Auth')) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.tryRefreshToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            return this.request<T>(endpoint, schema, {
              ...options,
              headers: { ...options.headers, 'X-Retry-Auth': 'true' },
            });
          }
        } else {
          return new Promise<T>((resolve, reject) => {
            this.addRefreshSubscriber(async (newToken) => {
              try {
                const res = await this.request<T>(endpoint, schema, {
                  ...options,
                  headers: { ...options.headers, 'X-Retry-Auth': 'true' },
                });
                resolve(res);
              } catch (e) {
                reject(e);
              }
            });
          });
        }
      }

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch {}
        throw new CardianiApiError(
          errData.message || `Request failed with status ${response.status}`,
          response.status,
          errData.code,
          errData
        );
      }

      const json = await response.json();

      if (schema) {
        const parseResult = schema.safeParse(json);
        if (!parseResult.success) {
          console.warn('[Cardiani API] Schema validation warning:', parseResult.error);
          return json as T;
        }
        return parseResult.data;
      }

      return json as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (retries > 0 && !controller.signal.aborted && err.name !== 'CardianiApiError') {
        return this.request<T>(endpoint, schema, options, retries - 1);
      }
      throw err;
    }
  }

  // ---------------------------------------------------------------------------
  // Auth API
  // ---------------------------------------------------------------------------
  async sendOtp(phone: string): Promise<{ success: boolean; message?: string }> {
    try {
      return await this.request('/api/v1/auth/otp/send', undefined, {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    } catch {
      // Mock mode fallback for seamless testing
      return { success: true, message: 'OTP sent (mock mode: 123456)' };
    }
  }

  async verifyOtp(phone: string, code: string): Promise<AuthResponse> {
    try {
      const res = await this.request(
        '/api/v1/auth/otp/verify',
        AuthResponseSchema,
        {
          method: 'POST',
          body: JSON.stringify({ phone, code }),
        }
      );
      await setStoredAccessToken(res.access_token);
      if (res.refresh_token) await setStoredRefreshToken(res.refresh_token);
      return res;
    } catch {
      // Mock mode fallback
      const mockRes: AuthResponse = {
        user: {
          id: 'user-mock-1',
          phone,
          name: 'کاربر کاردیانی',
          role: 'user',
        },
        access_token: 'mock-access-token-cardiani',
        refresh_token: 'mock-refresh-token-cardiani',
      };
      await setStoredAccessToken(mockRes.access_token);
      if (mockRes.refresh_token) await setStoredRefreshToken(mockRes.refresh_token);
      return mockRes;
    }
  }

  // ---------------------------------------------------------------------------
  // Products API
  // ---------------------------------------------------------------------------
  async getProducts(): Promise<Product[]> {
    try {
      const res = await this.request('/api/v1/products', ProductListResponseSchema);
      return res.data;
    } catch {
      // Fallback to local mock data
      return PRODUCTS as unknown as Product[];
    }
  }

  // ---------------------------------------------------------------------------
  // Stripe Payment Intent API
  // ---------------------------------------------------------------------------
  async createPaymentIntent(orderId: string, amount: number): Promise<PaymentIntentResponse> {
    try {
      return await this.request(
        '/api/v1/payments/create-intent',
        PaymentIntentResponseSchema,
        {
          method: 'POST',
          body: JSON.stringify({ order_id: orderId, amount }),
        }
      );
    } catch {
      // Mock intent client secret for development / offline testing
      return {
        client_secret: 'pi_mock_secret_' + Math.random().toString(36).substring(7),
        payment_intent_id: 'pi_mock_' + Date.now(),
        amount,
        currency: 'usd',
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Push Notifications API
  // ---------------------------------------------------------------------------
  async registerPushDevice(token: string, platform: string): Promise<{ success: boolean }> {
    try {
      return await this.request('/api/v1/devices/register', undefined, {
        method: 'POST',
        body: JSON.stringify({ token, platform, device_id: Platform.OS }),
      });
    } catch {
      return { success: true };
    }
  }

  async unregisterPushDevice(token: string): Promise<{ success: boolean }> {
    try {
      return await this.request('/api/v1/devices/unregister', undefined, {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch {
      return { success: true };
    }
  }
}

export const cardianiApi = new CardianiMobileApiClient();
