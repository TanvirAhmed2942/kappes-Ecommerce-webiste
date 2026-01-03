import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "./baseUrl";

// Custom fetch function that properly handles FormData
const customFetch = async (input, init) => {
  // If body is FormData, ensure Content-Type is not set
  // The browser will automatically set it with the correct boundary
  if (init?.body instanceof FormData && init.headers) {
    const headers = new Headers(init.headers);
    // Remove Content-Type if it exists - browser will set it automatically
    headers.delete("Content-Type");
    init.headers = headers;
  }
  return fetch(input, init);
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    fetchFn: customFetch,
    prepareHeaders: (headers, { extra, endpoint }) => {
      const token = localStorage.getItem("accessToken");
      const verifyToken = localStorage.getItem("verifyToken");
      if (verifyToken) {
        headers.set("resettoken", verifyToken);
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "PRODUCT",
    "CATEGORY",
    "BRAND",
    "USER",
    "UserProfile",
    "CART",
    "ORDER",
    "WISHLIST",
    "Messages",
    "ChatList",
    "Product",
    "Chat",
    "ShopAdmin",
    "ShopInfo",
    "Shop",
    "Follow",
    "Contact",
    "order",
    "brand",
    "category",
    "product",
    "user",
    "cart",
    "wishlist",
    "messages",
    "chat",
    "shop",
    "variant",
    "subcategory",
    "MyOrders",
    "ProductReviews",
    "FAQs",
    "FAQsSeller",
    "PrivacyPolicy",
    "TermsAndConditions",
    "StripeConnectedAccount",
    "Variant",
    "Advertisement",
    "Coupon",
    "Chitchat",
  ],
});

export const imageUrl = getBaseUrl();
