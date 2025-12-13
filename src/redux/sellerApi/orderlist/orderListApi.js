import { api } from "../../baseApi";

const OrderListApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrder: builder.query({
      query: ({
        shopId,
        page = 1,
        limit = 10,
        searchTerm = "",
        status = "",
      } = {}) => {
        if (!shopId) {
          throw new Error("Shop ID is required");
        }
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (searchTerm && searchTerm.trim()) {
          params.append("searchTerm", searchTerm.trim());
        }
        if (status && status !== "default" && status.trim()) {
          params.append("status", status.trim());
        }
        return {
          url: `/order/shop/${shopId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
    getOrderById: builder.query({
      query: (id) => {
        return {
          url: `/order/${id}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),

    deleteOrder: builder.mutation({
      query: (Id) => {
        return {
          url: `/order/cancel/${Id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["order"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllOrderQuery,
  useGetOrderByIdQuery,
  useDeleteOrderMutation,
} = OrderListApi;
