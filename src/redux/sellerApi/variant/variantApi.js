import { api } from "../../baseApi";

const subCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllVariant: builder.query({
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
      providesTags: ["variant"],
    }),

    getVariantById: builder.query({
      query: (id) => {
        return {
          url: `/variant/single/${id}`,
          method: "GET",
        };
      },
      providesTags: ["variant"],
    }),

    getVariantBySlug: builder.query({
      query: (slug) => {
        return {
          url: `/variant/slug/${slug}`,
          method: "GET",
        };
      },
      providesTags: ["variant"],
    }),

    getVariantByCategoryId: builder.query({
      query: (id) => {
        return {
          url: `/variant/subcategory/${id}`,
          method: "GET",
        };
      },
      providesTags: ["variant"],
    }),

    getVariantFieldBySubCategoryId: builder.query({
      query: (id) => {
        return {
          url: `/variant/variant-subcategory/${id}`,
          method: "GET",
        };
      },
      providesTags: ["variant"],
    }),

    createVariant: builder.mutation({
      query: (data) => {
        // For FormData, don't set Content-Type header - browser will set it automatically
        // with the correct multipart/form-data boundary. This prevents CORS errors.
        if (data instanceof FormData) {
          return {
            url: `/variant`,
            method: "POST",
            body: data,
            // Don't set headers - browser will set Content-Type automatically
          };
        }
        // For JSON payloads, set Content-Type
        return {
          url: `/variant`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["variant"],
    }),

    updateSubVariant: builder.mutation({
      query: ({ data, id }) => {
        // For FormData, don't set Content-Type header - browser will set it automatically
        // with the correct multipart/form-data boundary. This prevents CORS errors.
        if (data instanceof FormData) {
          return {
            url: `/variant/${id}`,
            method: "PATCH",
            body: data,
            // Don't set headers - browser will set Content-Type automatically
          };
        }
        // For JSON payloads, set Content-Type
        return {
          url: `/variant/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["variant"],
    }),

    deleteSubcategory: builder.mutation({
      query: (id) => {
        return {
          url: `/variant/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["variant"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllVariantQuery,
  useGetVariantByIdQuery,
  useGetVariantBySlugQuery,
  useGetVariantByCategoryIdQuery,
  useGetVariantFieldBySubCategoryIdQuery,
  useCreateVariantMutation,
  useUpdateSubVariantMutation,
  useDeleteSubcategoryMutation,
} = subCategoryApi;
