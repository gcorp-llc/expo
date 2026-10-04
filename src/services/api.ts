import { Platform } from "react-native";
import { ApiClient } from "@cardiani/api-client";
import { PRODUCTS } from "@/constants/mock-data";

// Automatically resolve emulator host addresses
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4400";
  }
  return "http://127.0.0.1:4400";
};

// Create a singleton instance of our API Client
export const api = new ApiClient(getBaseUrl());

export const productService = {
  getProducts: async () => {
    try {
      const res = await api.getProducts();
      if (res?.success && res?.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Offline mode fallback to mock PRODUCTS
    }
    return PRODUCTS;
  },

  getProductById: async (id: string) => {
    try {
      const res = await api.getProductById(id);
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback to searching mock PRODUCTS
    }
    return PRODUCTS.find((p) => p.id === id) || null;
  },

  getRelatedProducts: async (id: string) => {
    try {
      const res = await api.getRelatedProducts(id);
      if (res?.success && res?.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Offline mode fallback to mock related products
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
    try {
      const res = await api.searchMarketplace(query, options);
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return [];
  },

  getProductReviews: async (id: string) => {
    try {
      const res = await api.getProductReviews(id);
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return [];
  },

  getProductRatingSummary: async (id: string) => {
    try {
      const res = await api.getProductRatingSummary(id);
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return null;
  },

  submitReview: async (productId: string, orderId: string, rating: number, comment: string) => {
    try {
      return await api.submitProductReview(productId, orderId, rating, comment);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },

  editReview: async (reviewId: string, rating: number, comment: string) => {
    try {
      return await api.editReview(reviewId, rating, comment);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      return await api.deleteReview(reviewId);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },

  getSellerRating: async (sellerId: string) => {
    try {
      const res = await api.getSellerRating(sellerId);
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return null;
  },

  submitReport: async (targetType: "REVIEW" | "PRODUCT" | "SELLER", targetId: string, reason: string, description: string) => {
    try {
      return await api.submitReport(targetType, targetId, reason, description);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },
};

export const mobileCartService = {
  getCart: async () => {
    try {
      const res = await api.getCart();
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return [];
  },

  addToCart: async (productId: string, variantId?: string, quantity: number = 1) => {
    try {
      return await api.addToCart(productId, variantId, quantity);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    try {
      return await api.updateCartItem(itemId, quantity);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },

  removeCartItem: async (itemId: string) => {
    try {
      return await api.removeCartItem(itemId);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },
};

export const mobileOrderService = {
  checkout: async (shippingAddressId?: string, couponCode?: string) => {
    try {
      return await api.checkout(shippingAddressId, couponCode);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },

  getOrders: async () => {
    try {
      const res = await api.getOrders();
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return [];
  },

  getOrderById: async (id: string) => {
    try {
      const res = await api.getOrderById(id);
      if (res?.success && res?.data) {
        return res.data;
      }
    } catch {
      // Offline mode fallback
    }
    return null;
  },

  cancelOrder: async (id: string) => {
    try {
      return await api.cancelOrder(id);
    } catch {
      return { success: false, error: "Offline mode" };
    }
  },
};
