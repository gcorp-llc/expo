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
    return PRODUCTS;
  },

  getProductById: async (id: string) => {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) return found;
    // Return fallback product if ID not matched
    return {
      id: id || "1",
      name: "محصول نمونه کاردیانی",
      price: 1250000,
      oldPrice: 1500000,
      discountPercentage: 16,
      rating: 4.8,
      reviews: 12,
      category: "لوازم جانبی",
      description: "این یک محصول نمونه با کیفیت بالا جهت نمایش دمو در اپلیکیشن کاردیانی است.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      seller: "فروشگاه مرکزی کاردیانی",
    };
  },

  getRelatedProducts: async (id: string) => {
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
    const q = query.toLowerCase();
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  },

  getProductReviews: async (id: string) => {
    return [
      {
        id: "rev-1",
        rating: 5,
        comment: "کیفیت عالی و ارسال بسیار سریع. کاملاً راضی هستم.",
        userName: "کاربر خریدار",
        createdAt: "1403/01/15",
      },
      {
        id: "rev-2",
        rating: 4,
        comment: "بسته‌بندی مناسب و با کیفیت، دقیقا مطابق با توضیحات.",
        userName: "رضا محمدی",
        createdAt: "1403/01/10",
      },
    ];
  },

  getProductRatingSummary: async (id: string) => {
    return {
      rating_average: 4.8,
      rating_count: 12,
    };
  },

  submitReview: async (productId: string, orderId: string, rating: number, comment: string) => {
    return { success: true, message: "Review submitted successfully" };
  },

  editReview: async (reviewId: string, rating: number, comment: string) => {
    return { success: true };
  },

  deleteReview: async (reviewId: string) => {
    return { success: true };
  },

  getSellerRating: async (sellerId: string) => {
    return { rating_average: 4.9, rating_count: 45 };
  },

  submitReport: async (targetType: "REVIEW" | "PRODUCT" | "SELLER", targetId: string, reason: string, description: string) => {
    return { success: true };
  },
};

import { useStore } from "@/hooks/use-store";

export const mobileCartService = {
  getCart: async (): Promise<any[]> => {
    const { cartItems } = useStore.getState();
    return cartItems.map((ci) => ({
      item_id: ci.id,
      product_id: ci.id,
      quantity: ci.quantity,
    }));
  },

  addToCart: async (productId: string, variantId?: string, quantity: number = 1) => {
    useStore.getState().addToCart(productId, quantity);
    return { success: true, message: "Added to cart" };
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    useStore.getState().updateCartQuantity(itemId, quantity);
    return { success: true };
  },

  removeCartItem: async (itemId: string) => {
    useStore.getState().removeFromCart(itemId);
    return { success: true };
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
