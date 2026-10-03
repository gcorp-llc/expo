// =============================================================================
// @cardiani/api-client — HTTP client برای backend API
// =============================================================================

import type {
  ApiResponse,
  PaginatedResponse,
  Category,
  Brand,
  MarketplaceProduct,
  ProductVariant,
  CartItem,
  MarketplaceOrder,
  OrderItem,
  ProductReview,
  ProductRatingSummary,
  AdminUser,
  AdminUserDetail,
  AuditLog,
  ModerationTask,
  DashboardOverviewStats,
  ModerationDashboardStats,
  MarketplaceAdminStats,
  PaymentDashboardStats,
  ModerationActivityLog,
  NotificationDto,
  NotificationDeliveryDto,
  NotificationPreferenceDto,
  DeviceDto,
} from "@cardiani/types";

export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  store_description: string;
  status: string;
  verification_state: string;
  created_at: string;
  updated_at: string;
}

export interface SellerOrder {
  seller_id: string;
  created_at: string;
  order_id: string;
  user_id: string;
  status: string;
  total_amount: number;
  final_amount: number;
  shipping_address_id?: string;
  updated_at: string;
  items?: any[];
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ── پایه‌ای‌ترین متد ────────────────────────────────────────────────────
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      return { success: false, error: text };
    }

    return res.json() as Promise<ApiResponse<T>>;
  }

  // ── Health ───────────────────────────────────────────────────────────────
  health() {
    return this.request<{ status: string; service: string }>("GET", "/api/health");
  }

  // ── Events ───────────────────────────────────────────────────────────────
  publishEvent(eventType: string, payload: Record<string, unknown>) {
    return this.request<{ id: string; event_type: string; status: string }>(
      "POST",
      "/api/events",
      { event_type: eventType, payload }
    );
  }

  testEvent() {
    return this.request<unknown>("GET", "/api/events/test");
  }

  // ── Search ───────────────────────────────────────────────────────────────
  search<T>(query: string) {
    const q = encodeURIComponent(query);
    return this.request<PaginatedResponse<T>>("GET", `/api/search?q=${q}`);
  }

  // ── Marketplace (Phase 26 - Step 4 Unified Commerce API Client) ──────────────

  // Catalog, Categories & Brands
  getProducts() {
    return this.request<MarketplaceProduct[]>("GET", "/api/v1/marketplace/products");
  }

  getProductById(id: string) {
    return this.request<MarketplaceProduct>("GET", `/api/v1/marketplace/products/${id}`);
  }

  getProductBySlug(slug: string) {
    return this.request<MarketplaceProduct>("GET", `/api/v1/marketplace/products/slug/${slug}`);
  }

  getRelatedProducts(id: string) {
    return this.request<MarketplaceProduct[]>("GET", `/api/v1/marketplace/products/${id}/related`);
  }

  getProductAvailability(id: string) {
    return this.request<any>("GET", `/api/v1/marketplace/products/${id}/availability`);
  }

  getCategories() {
    return this.request<Category[]>("GET", "/api/v1/marketplace/categories");
  }

  getCategoriesTree() {
    return this.request<Category[]>("GET", "/api/v1/marketplace/categories/tree");
  }

  getBrands() {
    return this.request<Brand[]>("GET", "/api/v1/marketplace/brands");
  }

  searchMarketplace(
    query: string,
    options?: {
      categoryId?: string;
      brandId?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }
  ) {
    const params = new URLSearchParams({ q: query });
    if (options?.categoryId) params.append("category_id", options.categoryId);
    if (options?.brandId) params.append("brand_id", options.brandId);
    if (options?.minPrice !== undefined) params.append("min_price", options.minPrice.toString());
    if (options?.maxPrice !== undefined) params.append("max_price", options.maxPrice.toString());
    if (options?.inStock !== undefined) params.append("in_stock", options.inStock.toString());

    return this.request<MarketplaceProduct[]>(
      "GET",
      `/api/v1/marketplace/search?${params.toString()}`
    );
  }

  // Persistent Cart Operations
  getCart() {
    return this.request<CartItem[]>("GET", "/api/v1/marketplace/cart");
  }

  addToCart(productId: string, variantId?: string, quantity: number = 1) {
    return this.request<any>("POST", "/api/v1/marketplace/cart", {
      product_id: productId,
      variant_id: variantId || null,
      quantity,
    });
  }

  updateCartItem(itemId: string, quantity: number) {
    return this.request<any>("PATCH", "/api/v1/marketplace/cart", {
      item_id: itemId,
      quantity,
    });
  }

  removeCartItem(itemId: string) {
    return this.request<any>("DELETE", `/api/v1/marketplace/cart/${itemId}`);
  }

  // Orders and Checkout Preparation
  checkout(shippingAddressId?: string, couponCode?: string) {
    return this.request<MarketplaceOrder>("POST", "/api/v1/marketplace/checkout", {
      shipping_address_id: shippingAddressId || null,
      coupon_code: couponCode || null,
    });
  }

  createOrder(
    items: Array<[string, string | null, number]>,
    shippingAddressId?: string,
    couponCode?: string
  ) {
    return this.request<MarketplaceOrder>("POST", "/api/v1/marketplace/orders", {
      items,
      shipping_address_id: shippingAddressId || null,
      coupon_code: couponCode || null,
    });
  }

  getOrders() {
    return this.request<MarketplaceOrder[]>("GET", "/api/v1/marketplace/orders");
  }

  getOrderById(id: string) {
    return this.request<MarketplaceOrder>("GET", `/api/v1/marketplace/orders/${id}`);
  }

  cancelOrder(id: string) {
    return this.request<any>("POST", `/api/v1/marketplace/orders/${id}/cancel`);
  }

  // Reviews and Rating Aggregates Foundation
  submitReview(productId: string, orderId: string, rating: number, comment: string) {
    return this.request<ProductReview>("POST", "/api/v1/marketplace/reviews", {
      product_id: productId,
      order_id: orderId,
      rating,
      comment,
    });
  }

  submitProductReview(productId: string, orderId: string, rating: number, comment: string) {
    return this.request<ProductReview>("POST", `/api/v1/marketplace/products/${productId}/reviews`, {
      order_id: orderId,
      rating,
      comment,
    });
  }

  editReview(reviewId: string, rating: number, comment: string) {
    return this.request<ProductReview>("PATCH", `/api/v1/marketplace/reviews/${reviewId}`, {
      rating,
      comment,
    });
  }

  deleteReview(reviewId: string) {
    return this.request<any>("DELETE", `/api/v1/marketplace/reviews/${reviewId}`);
  }

  getProductReviews(productId: string) {
    return this.request<ProductReview[]>("GET", `/api/v1/marketplace/products/${productId}/reviews`);
  }

  getProductRating(productId: string) {
    return this.request<ProductRatingSummary>("GET", `/api/v1/marketplace/products/${productId}/rating`);
  }

  getProductRatingSummary(productId: string) {
    return this.request<ProductRatingSummary>(
      "GET",
      `/api/v1/marketplace/products/${productId}/rating-summary`
    );
  }

  getSellerRating(sellerId: string) {
    return this.request<any>("GET", `/api/v1/marketplace/sellers/${sellerId}/rating`);
  }

  submitReport(targetType: "REVIEW" | "PRODUCT" | "SELLER", targetId: string, reason: string, description: string) {
    return this.request<any>("POST", "/api/v1/marketplace/reports", {
      target_type: targetType,
      target_id: targetId,
      reason,
      description,
    });
  }

  // Admin Moderation
  approveReview(reviewId: string) {
    return this.request<ProductReview>("POST", `/api/v1/marketplace/reviews/${reviewId}/approve`);
  }

  rejectReview(reviewId: string) {
    return this.request<ProductReview>("POST", `/api/v1/marketplace/reviews/${reviewId}/reject`);
  }

  removeReview(reviewId: string) {
    return this.request<ProductReview>("POST", `/api/v1/marketplace/reviews/${reviewId}/remove`);
  }

  // Seller Dashboard Foundations
  createProduct(p: Partial<MarketplaceProduct>) {
    return this.request<MarketplaceProduct>("POST", "/api/v1/marketplace/products", p);
  }

  updateProduct(id: string, p: Partial<MarketplaceProduct>) {
    return this.request<MarketplaceProduct>("PATCH", `/api/v1/marketplace/products/${id}`, p);
  }

  transitionProductStatus(id: string, status: string) {
    return this.request<MarketplaceProduct>("PATCH", `/api/v1/marketplace/products/${id}/status`, {
      status,
    });
  }

  deleteProduct(id: string) {
    return this.request<any>("DELETE", `/api/v1/marketplace/products/${id}`);
  }

  // ── Phase 26 - Step 5 Seller Platform SDK Methods ───────────────────────

  registerSeller(storeName: string, storeDescription: string) {
    return this.request<Seller>("POST", "/api/v1/marketplace/sellers/register", {
      store_name: storeName,
      store_description: storeDescription,
    });
  }

  getSellerMe() {
    return this.request<Seller>("GET", "/api/v1/marketplace/sellers/me");
  }

  getSellerById(id: string) {
    return this.request<Seller>("GET", `/api/v1/marketplace/sellers/${id}`);
  }

  updateSellerStatus(id: string, status: string) {
    return this.request<Seller>("PATCH", `/api/v1/marketplace/sellers/${id}/status`, {
      status,
    });
  }

  getSellerProducts() {
    return this.request<MarketplaceProduct[]>("GET", "/api/v1/marketplace/sellers/me/products");
  }

  publishSellerProduct(p: Partial<MarketplaceProduct>) {
    return this.request<MarketplaceProduct>("POST", "/api/v1/marketplace/sellers/me/products", p);
  }

  getSellerInventory() {
    return this.request<any[]>("GET", "/api/v1/marketplace/sellers/me/inventory");
  }

  adjustSellerInventory(productId: string, quantityDelta: number) {
    return this.request<any>("PATCH", `/api/v1/marketplace/sellers/me/inventory/${productId}`, {
      quantity_delta: quantityDelta,
    });
  }

  getSellerOrders() {
    return this.request<SellerOrder[]>("GET", "/api/v1/marketplace/sellers/me/orders");
  }

  getSellerOrderById(orderId: string) {
    return this.request<SellerOrder>("GET", `/api/v1/marketplace/sellers/me/orders/${orderId}`);
  }

  updateSellerOrderStatus(orderId: string, status: string) {
    return this.request<SellerOrder>("PATCH", `/api/v1/marketplace/sellers/me/orders/${orderId}/status`, {
      status,
    });
  }

  // ─── Phase 27 Admin Panel APIs ───────────────────────────────────────────

  getAdminOverview() {
    return this.request<DashboardOverviewStats>("GET", "/api/v1/admin/overview");
  }

  getAdminUsers(params?: { page?: number; limit?: number; status?: string; role?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);
    if (params?.role) query.append("role", params.role);
    if (params?.search) query.append("search", params.search);
    return this.request<AdminUser[]>("GET", `/api/v1/admin/users?${query.toString()}`);
  }

  getAdminUserById(id: string) {
    return this.request<AdminUserDetail>("GET", `/api/v1/admin/users/${id}`);
  }

  suspendUser(id: string) {
    return this.request<{ status: string }>("POST", `/api/v1/admin/users/${id}/suspend`);
  }

  activateUser(id: string) {
    return this.request<{ status: string }>("POST", `/api/v1/admin/users/${id}/activate`);
  }

  assignUserRoles(id: string, roles: string[]) {
    return this.request<{ status: string }>("POST", `/api/v1/admin/users/${id}/roles`, { roles });
  }

  getAdminAuditLogs(params?: { page?: number; limit?: number; admin_id?: string; target_id?: string; action?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.admin_id) query.append("admin_id", params.admin_id);
    if (params?.target_id) query.append("target_id", params.target_id);
    if (params?.action) query.append("action", params.action);
    return this.request<AuditLog[]>("GET", `/api/v1/admin/audit?${query.toString()}`);
  }

  getAdminModerationStats() {
    return this.request<ModerationDashboardStats>("GET", "/api/v1/admin/dashboard/moderation");
  }

  getAdminModerationActivity() {
    return this.request<ModerationActivityLog[]>("GET", "/api/v1/admin/dashboard/moderation/activity");
  }

  getAdminMarketplaceStats() {
    return this.request<MarketplaceAdminStats>("GET", "/api/v1/admin/dashboard/marketplace");
  }

  getAdminPaymentStats() {
    return this.request<PaymentDashboardStats>("GET", "/api/v1/admin/dashboard/payments");
  }

  getModerationTasks(params?: { page?: number; limit?: number; status?: string; entity_type?: string; priority?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);
    if (params?.entity_type) query.append("entity_type", params.entity_type);
    if (params?.priority) query.append("priority", params.priority);
    return this.request<ModerationTask[]>("GET", `/api/v1/admin/moderation/tasks?${query.toString()}`);
  }

  getModerationTaskById(id: string) {
    return this.request<ModerationTask>("GET", `/api/v1/admin/moderation/tasks/${id}`);
  }

  updateModerationTaskStatus(id: string, status: string, comment?: string) {
    return this.request<ModerationTask>("PATCH", `/api/v1/admin/moderation/tasks/${id}/status`, { status, comment });
  }

  assignModerator(id: string, moderatorId: string, comment?: string) {
    return this.request<ModerationTask>("POST", `/api/v1/admin/moderation/tasks/${id}/assign`, { moderator_id: moderatorId, comment });
  }

  approveModerationTask(id: string, comment?: string) {
    return this.request<ModerationTask>("POST", `/api/v1/admin/moderation/tasks/${id}/approve`, { comment });
  }

  rejectModerationTask(id: string, comment?: string) {
    return this.request<ModerationTask>("POST", `/api/v1/admin/moderation/tasks/${id}/reject`, { comment });
  }

  escalateModerationTask(id: string, comment?: string) {
    return this.request<ModerationTask>("POST", `/api/v1/admin/moderation/tasks/${id}/escalate`, { comment });
  }

  cancelModerationTask(id: string, comment?: string) {
    return this.request<ModerationTask>("POST", `/api/v1/admin/moderation/tasks/${id}/cancel`, { comment });
  }

  // ─── Phase 28 - Step 4 Unified Notification Platform Deliveries & Devices APIs ───

  getDeliveries(id: string) {
    return this.request<any[]>("GET", `/api/v1/notifications/${id}/deliveries`);
  }

  getNotificationStatus(id: string) {
    return this.request<any>("GET", `/api/v1/notifications/${id}/status`);
  }

  registerDeviceV1(deviceId: string, platform: string, token: string) {
    return this.request<any>("POST", "/api/v1/devices/register", {
      device_id: deviceId,
      platform,
      token,
    });
  }

  unregisterDeviceV1(deviceId: string) {
    return this.request<any>("DELETE", `/api/v1/devices/${deviceId}`);
  }

  // ─── Phase 28 - Step 5 Standardized Notification Methods ───────────────────

  getNotifications(params?: { limit?: number; cursor?: string; unread?: boolean; category?: string }) {
    const q = new URLSearchParams();
    if (params?.limit !== undefined) q.append("limit", params.limit.toString());
    if (params?.cursor !== undefined) q.append("cursor", params.cursor);
    if (params?.unread !== undefined) q.append("unread", params.unread.toString());
    if (params?.category !== undefined) q.append("category", params.category);

    const qs = q.toString();
    const path = qs ? `/api/v1/notifications?${qs}` : "/api/v1/notifications";
    return this.request<{ notifications: NotificationDto[]; unread_count: number; next_cursor?: string }>(
      "GET",
      path
    );
  }

  getNotification(id: string) {
    return this.request<NotificationDto>("GET", `/api/v1/notifications/${id}`);
  }

  markNotificationRead(id: string) {
    return this.request<{ status: string }>("PATCH", `/api/v1/notifications/${id}/read`);
  }

  markAllNotificationsRead() {
    return this.request<{ status: string }>("PATCH", "/api/v1/notifications/read-all");
  }

  deleteNotification(id: string) {
    return this.request<{ status: string }>("DELETE", `/api/v1/notifications/${id}`);
  }

  getNotificationDeliveries(id: string) {
    return this.request<NotificationDeliveryDto[]>("GET", `/api/v1/notifications/${id}/deliveries`);
  }

  registerDevice(payload: { device_id: string; platform: string; token: string }) {
    return this.request<DeviceDto>("POST", "/api/v1/devices/register", payload);
  }

  removeDevice(id: string) {
    return this.request<{ status: string }>("DELETE", `/api/v1/devices/${id}`);
  }

  getNotificationPreferences() {
    return this.request<NotificationPreferenceDto>("GET", "/api/v1/notification-preferences");
  }

  updateNotificationPreferences(payload: {
    email: boolean;
    push: boolean;
    sms: boolean;
    categories: {
      payment?: boolean;
      marketplace?: boolean;
      conversation?: boolean;
      system?: boolean;
    };
    quiet_hours: {
      enabled: boolean;
      start?: string;
      end?: string;
    };
  }) {
    return this.request<NotificationPreferenceDto>("PUT", "/api/v1/notification-preferences", payload);
  }
}

/** singleton کارخانه — URL از env می‌آید */
export function createApiClient(token?: string): ApiClient {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:4000";
  return new ApiClient(baseUrl, token);
}
