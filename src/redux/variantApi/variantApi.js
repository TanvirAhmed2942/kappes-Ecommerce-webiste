import { api } from "../baseApi";

const variantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createVariant: builder.mutation({
      query: (formData) => ({
        url: "/variant",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Variant"],
    }),
    getallVariant: builder.query({
      query: (subCategoryId) => {
        const params = new URLSearchParams();
        if (subCategoryId) {
          params.append("subCategoryId", subCategoryId);
        }
        const queryString = params.toString();
        return {
          url: `/variant${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Variant"],
    }),
    getVariantById: builder.query({
      query: (id) => {
        return {
          url: `/variant/single/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Variant"],
    }),
    updateVariant: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/variant/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Variant"],
    }),
    deleteVariant: builder.mutation({
      query: (id) => {
        return {
          url: `/variant/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Variant"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateVariantMutation,
  useGetallVariantQuery,
  useGetVariantByIdQuery,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} = variantApi;
