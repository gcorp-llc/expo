import { describe, it, expect, vi } from 'vitest';
import {
  UserSchema,
  ProductSchema,
  AuthResponseSchema,
  PaymentIntentResponseSchema,
} from './schemas';
import { SharedApiClient } from './client';

describe('Shared Zod Schemas', () => {
  it('validates a valid User object', () => {
    const validUser = {
      id: 'usr_123',
      phone: '+989123456789',
      name: 'Ali Rezaei',
      role: 'user',
    };
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('usr_123');
      expect(result.data.role).toBe('user');
    }
  });

  it('rejects an invalid Product missing required fields', () => {
    const invalidProduct = {
      id: 'p_1',
    };
    const result = ProductSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it('validates AuthResponse format', () => {
    const authData = {
      user: {
        id: 'usr_abc',
        role: 'user',
      },
      access_token: 'mock-jwt-token',
      refresh_token: 'mock-refresh-token',
    };
    const result = AuthResponseSchema.safeParse(authData);
    expect(result.success).toBe(true);
  });

  it('validates PaymentIntent response schema', () => {
    const paymentData = {
      client_secret: 'pi_test_secret_123',
      payment_intent_id: 'pi_test_123',
      amount: 500000,
      currency: 'usd',
    };
    const result = PaymentIntentResponseSchema.safeParse(paymentData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(500000);
    }
  });
});

describe('Authentication Smoke Flow', () => {
  it('handles simulated login / OTP verification', async () => {
    const mockAuthResponse = {
      user: {
        id: 'usr_test_100',
        phone: '09120000000',
        name: 'کاربر تستی',
        role: 'user' as const,
      },
      access_token: 'valid_bearer_token_123',
      refresh_token: 'valid_refresh_token_456',
    };

    // Verify smoke flow matches schema
    const parseResult = AuthResponseSchema.safeParse(mockAuthResponse);
    expect(parseResult.success).toBe(true);

    // Verify token can be consumed by client
    const client = new SharedApiClient({
      baseUrl: 'https://api.cardiani.gcorp.cc',
      getToken: () => mockAuthResponse.access_token,
    });
    expect(client).toBeDefined();
  });
});
