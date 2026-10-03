// =============================================================================
// @cardiani/types — تایپ‌های مشترک TypeScript در سراسر monorepo
// =============================================================================

// ─── ts-rs Auto-Generated Types Export ─────────────────────────────────────
export * from "./generated/CardianiEvent";
export * from "./generated/UserCreatedPayload";
export * from "./generated/ChatMessageCreatedPayload";
export * from "./generated/VehicleCreatedPayload";
export * from "./generated/PaymentVerifiedPayload";

// ─── API Response ─────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Events (باید با shared/src/lib.rs هماهنگ باشد) ──────────────────────
export interface CardianiEvent {
  id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string; // ISO 8601
}

// ─── User ─────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── Clinic ───────────────────────────────────────────────────────────────
export interface Clinic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────
export interface Doctor {
  id: string;
  user_id: string;
  clinic_id: string;
  specialty: string;
  bio?: string;
  created_at: string;
}

// ─── Appointment ──────────────────────────────────────────────────────────
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

// ─── Phase 24 Real-Time Platform Contracts ────────────────────────────────
export type RealtimeConnectionState =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Authenticating"
  | "Ready"
  | "Reconnecting"
  | "Failed";

export interface RealtimeFrame<P = unknown> {
  event: string;
  version: string;
  timestamp: string; // ISO 8601
  request_id: string; // UUID
  user_id: string; // UUID
  payload: P;
}

// Client -> Server Payloads
export interface AuthenticatePayload {
  token: string;
  device_type: string;
}

export interface SendMessagePayload {
  conversation_id: string;
  content: string;
}

export interface TypingPayload {
  conversation_id: string;
}

export interface PresenceUpdatePayload {
  status: "online" | "offline" | "away" | "last_seen";
}

// Server -> Client Payloads
export interface ConnectionReadyPayload {
  session_id: string;
  status: string;
}

export interface MessageCreatedPayload {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string; // ISO 8601
}

export interface PresenceChangedPayload {
  target_user_id: string;
  status: string;
  last_seen?: number;
}

export interface NotificationCreatedPayload {
  id: string;
  category: string;
  title: string;
  body: string;
  created_at: string;
}

// ─── Marketplace & Commerce Domain (Phase 26 - Step 4) ──────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  status: string; // DRAFT | PENDING_REVIEW | ACTIVE | INACTIVE | OUT_OF_STOCK | DISCONTINUED | ARCHIVED
  brand_id?: string;
  category_id?: string;
  seller_id?: string;
  thumbnail?: string;
  discount_price?: number;
  currency?: string;
  stock_status?: string; // IN_STOCK | OUT_OF_STOCK
  rating_average?: number;
  rating_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, unknown> | string;
  weight: number;
  dimensions: string;
  created_at: string;
}

export interface CartItem {
  user_id: string;
  item_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  added_at: string;
}

export interface MarketplaceOrder {
  id: string;
  user_id: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: string; // CREATED | PAID | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
  shipping_address_id?: string;
  payment_id?: string;
  coupon_code?: string;
  inventory_reservation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_id: string;
  item_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name_snapshot?: string;
  variant_name_snapshot?: string;
}

export interface ProductReview {
  product_id: string;
  user_id: string;
  order_id: string;
  id: string;
  rating: number;
  comment: string;
  status: string; // PENDING_MODERATION | APPROVED | REJECTED
  created_at: string;
  updated_at: string;
}

export interface ProductRatingSummary {
  product_id: string;
  rating_average: number;
  rating_count: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
  updated_at: string;
}

// ─── Phase 27 Admin Platform Contracts ────────────────────────────────────

export interface AdminUserProfile {
  name: string;
  email: string;
}

export interface AdminUser {
  id: string;
  profile: AdminUserProfile;
  roles: string[];
  status: "ACTIVE" | "SUSPENDED";
  created_at: string;
}

export interface AdminUserSession {
  session_id: string;
  ip_address?: string;
  user_agent?: string;
  last_active: string;
}

export interface AdminUserActivitySummary {
  total_orders: number;
  total_spent: number;
  total_moderation_flags: number;
  total_audit_actions: number;
}

export interface AdminUserAuditRecord {
  timestamp: string;
  action: string;
  actor_id: string;
  details: string;
}

export interface AdminUserDetail {
  profile: AdminUserProfile;
  sessions: AdminUserSession[];
  roles: string[];
  activity_summary: AdminUserActivitySummary;
  audit_history: AdminUserAuditRecord[];
}

export interface AuditLog {
  actor: string;
  action: string;
  target: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ModerationTask {
  id: string;
  entity_type: string;
  entity_id: string;
  created_by: string;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "ESCALATED" | "CANCELLED";
  assigned_to?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  reason?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardOverviewStats {
  users: {
    total: number;
    active: number;
    suspended: number;
  };
  marketplace: {
    products: number;
    orders: number;
    revenue: number;
  };
  moderation: {
    pending: number;
    in_review: number;
    escalated: number;
  };
  payments: {
    successful: number;
    failed: number;
    pending: number;
  };
  system: {
    services_health: string;
    database_status: string;
  };
}

export interface ModerationDashboardStats {
  pending: number;
  in_review: number;
  approved: number;
  rejected: number;
  escalated: number;
}

export interface ModerationActivityLog {
  moderation_id: string;
  entity_type: string;
  entity_id: string;
  actor_id: string;
  action: string;
  previous_status?: string;
  new_status: string;
  comment?: string;
  timestamp: string;
}

export interface MarketplaceAdminStats {
  products: {
    total: number;
    active: number;
    pending_review: number;
  };
  orders: {
    pending: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface PaymentDashboardStats {
  successful_payments: number;
  failed_payments: number;
  refunds: number;
  pending_intents: number;
}

// ─── Phase 28 - Step 5 Standardized Notification DTOs ──────────────────────

export interface NotificationDto {
  id: string;
  category: string;
  title: string;
  body: string;
  priority: string;
  status: string;
  metadata: Record<string, any>;
  createdAt: string; // ISO 8601
  deliveredAt?: string; // ISO 8601
  isRead: boolean;
}

export interface NotificationDeliveryDto {
  id: string;
  notificationId: string;
  channel: string;
  status: string;
  attempts: number;
  lastError?: string;
  deliveredAt?: string; // ISO 8601
}

export interface NotificationPreferenceDto {
  userId: string;
  channels: string[];
  categories: string[];
  quietHours: {
    enabled: boolean;
    start?: string;
    end?: string;
  };
}

export interface DeviceDto {
  id: string;
  userId: string;
  platform: string;
  token: string;
  lastSeenAt: string; // ISO 8601
}
