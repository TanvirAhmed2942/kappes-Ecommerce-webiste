import { api } from "../../baseApi";

const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: ({ shopId, page = 1, limit = 10, searchTerm = "" } = {}) => {
        if (!shopId) {
          const shopIdFromStorage =
            typeof window !== "undefined" ? localStorage.getItem("shop") : null;
          if (!shopIdFromStorage) {
            throw new Error("Shop ID is required");
          }
          shopId = shopIdFromStorage;
        }
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (searchTerm && searchTerm.trim()) {
          params.append("searchTerm", searchTerm.trim());
        }
        return {
          url: `/coupon/shop/${shopId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/coupon/create`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    updateCoupon: builder.mutation({
      query: ({ data, couponCode }) => {
        return {
          url: `/coupon/${couponCode}/update-coupon`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => {
        return {
          url: `/coupon/${couponId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Coupon"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
