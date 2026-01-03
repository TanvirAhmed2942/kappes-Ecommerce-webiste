import { api } from "../../baseApi";

const subCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllVariantADD: builder.query({
      query: (arg) => {
        const params = new URLSearchParams();

        // Handle both object and string arguments for backward compatibility
        let subCategoryId = null;
        let productRef = null;

        if (typeof arg === "string") {
          // Backward compatibility: if string is passed, treat it as subCategoryId
          subCategoryId = arg;
        } else if (arg && typeof arg === "object") {
          subCategoryId = arg.subCategoryId;
          productRef = arg.productRef !== undefined ? arg.productRef : null;
        }

        // Get vendor ID (createdBy) from JWT token
        let createdBy = null;
        if (typeof window !== "undefined") {
          try {
            const token = localStorage.getItem("accessToken");
            if (token) {
              // Decode JWT token to get userId (vendor ID)
              const base64Url = token.split(".")[1];
              if (base64Url) {
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split("")
                    .map(
                      (c) =>
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    )
                    .join("")
                );
                const decoded = JSON.parse(jsonPayload);
                createdBy =
                  decoded._id ||
                  decoded.id ||
                  decoded.userId ||
                  decoded.sub ||
                  null;
              }
            }
          } catch (error) {
            console.error("Error decoding token for vendor ID:", error);
          }
        }

        if (subCategoryId) {
          params.append("subCategoryId", subCategoryId);
        }
        if (productRef !== null && productRef !== undefined) {
          params.append("productRef", productRef);
        } else {
          params.append("productRef", "null");
        }
        if (createdBy) {
          params.append("createdBy", createdBy);
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
  useGetAllVariantADDQuery,
  useGetVariantByIdQuery,
  useGetVariantBySlugQuery,
  useGetVariantByCategoryIdQuery,
  useGetVariantFieldBySubCategoryIdQuery,
  useCreateVariantMutation,
  useUpdateSubVariantMutation,
  useDeleteSubcategoryMutation,
} = subCategoryApi;
