import { api } from "../../baseApi";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: ({ shopId, page = 1, limit = 10, searchTerm = "" } = {}) => {
        if (!shopId) {
          throw new Error("Shop ID is required");
        }
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (searchTerm && searchTerm.trim()) {
          params.append("searchTerm", searchTerm.trim());
        }
        return {
          url: `/product/shop/${shopId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => {
        return {
          url: `/product/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: (data) => {
        return {
          url: `/product/create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ data, productId }) => {
        return {
          url: `/product/${productId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => {
        return {
          url: `/product/${productId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Product"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} = productApi;
