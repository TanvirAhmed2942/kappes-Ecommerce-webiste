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
  }),
  overrideExisting: true,
});

export const { useCreateVariantMutation, useGetallVariantQuery } = variantApi;
