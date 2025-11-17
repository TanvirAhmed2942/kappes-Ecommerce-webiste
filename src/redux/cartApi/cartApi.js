import { api } from "../baseApi";

const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => {
        return {
          url: `/cart`,
          method: "GET",
        };
      },
    }),
    addToCart: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/cart/create`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    updateMyCart: builder.mutation({
      query: ({ data, productId }) => {
        return {
          url: `/cart/items/${productId}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    removeFromCart: builder.mutation({
      query: (productId) => {
        return {
          url: `/cart/items/${productId}`,
          method: "DELETE",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateMyCartMutation,
  useRemoveFromCartMutation,
} = cartApi;
