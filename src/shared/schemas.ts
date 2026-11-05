import { z } from 'zod';

// ==========================================
// User & Auth Schemas
// ==========================================
export const UserSchema = z.object({
  id: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['user', 'seller', 'admin']).default('user'),
  created_at: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ==========================================
// Product Schemas
// ==========================================
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  oldPrice: z.number().optional(),
  discountPercentage: z.number().optional(),
  rating: z.number().min(0).max(5).default(5),
  reviews: z.number().default(0),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  seller: z.string(),
  in_stock: z.boolean().default(true),
});
export type Product = z.infer<typeof ProductSchema>;

export const ProductListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ProductSchema),
  total: z.number().optional(),
});
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;

// ==========================================
// Order & Payment Schemas
// ==========================================
export const PaymentIntentResponseSchema = z.object({
  client_secret: z.string(),
  publishable_key: z.string().optional(),
  payment_intent_id: z.string(),
  amount: z.number(),
  currency: z.string().default('usd'),
});
export type PaymentIntentResponse = z.infer<typeof PaymentIntentResponseSchema>;

export const OrderItemSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
  title: z.string().optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
  total_amount: z.number().nonnegative(),
  items: z.array(OrderItemSchema).default([]),
  created_at: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;

// ==========================================
// API Error Schema
// ==========================================
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
