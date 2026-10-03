import { Platform } from "react-native";
import { ApiClient } from "@cardiani/api-client";
import { useStore } from "@/hooks/use-store";

// Automatically resolve emulator host addresses
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4400";
  }
  return "http://127.0.0.1:4400";
};

// Create a singleton instance of our API Client
export const api = new ApiClient(getBaseUrl());

import { PRODUCTS } from "@/constants/mock-data";

export const productService = {
  getProducts: async () => {
    try {
      const res = await api.getProducts();
      if (res.success && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      console.warn("[productService] API failed, falling back to mock PRODUCTS", e);
    }
    return PRODUCTS;
  },

  getProductById: async (id: string) => {
    try {
      const res = await api.getProductById(id);
      if (res.success && res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn("[productService] API failed, searching in mock PRODUCTS", e);
    }
    return PRODUCTS.find((p) => p.id === id) || null;
  },

  getRelatedProducts: async (id: string) => {
    try {
      const res = await api.getRelatedProducts(id);
      if (res.success && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      console.warn("[productService] API failed, returning mock related products", e);
    }
    const current = PRODUCTS.find((p) => p.id === id);
    if (current) {
      return PRODUCTS.filter((p) => p.category === current.category && p.id !== id);
    }
    return PRODUCTS.slice(0, 4);
  },

  searchProducts: async (
    query: string,
    options?: { categoryId?: string; brandId?: string; minPrice?: number; maxPrice?: number; inStock?: boolean }
  ) => {
    const res = await api.searchMarketplace(query, options);
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  },

  getProductReviews: async (id: string) => {
    const res = await api.getProductReviews(id);
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  },

  getProductRatingSummary: async (id: string) => {
    const res = await api.getProductRatingSummary(id);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  submitReview: async (productId: string, orderId: string, rating: number, comment: string) => {
    return await api.submitProductReview(productId, orderId, rating, comment);
  },

  editReview: async (reviewId: string, rating: number, comment: string) => {
    return await api.editReview(reviewId, rating, comment);
  },

  deleteReview: async (reviewId: string) => {
    return await api.deleteReview(reviewId);
  },

  getSellerRating: async (sellerId: string) => {
    const res = await api.getSellerRating(sellerId);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  submitReport: async (targetType: "REVIEW" | "PRODUCT" | "SELLER", targetId: string, reason: string, description: string) => {
    return await api.submitReport(targetType, targetId, reason, description);
  },
};

export const mobileCartService = {
  getCart: async () => {
    const res = await api.getCart();
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  },

  addToCart: async (productId: string, variantId?: string, quantity: number = 1) => {
    return await api.addToCart(productId, variantId, quantity);
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    return await api.updateCartItem(itemId, quantity);
  },

  removeCartItem: async (itemId: string) => {
    return await api.removeCartItem(itemId);
  },
};

export const mobileOrderService = {
  checkout: async (shippingAddressId?: string, couponCode?: string) => {
    return await api.checkout(shippingAddressId, couponCode);
  },

  getOrders: async () => {
    const res = await api.getOrders();
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  },

  getOrderById: async (id: string) => {
    const res = await api.getOrderById(id);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  },

  cancelOrder: async (id: string) => {
    return await api.cancelOrder(id);
  },
};
