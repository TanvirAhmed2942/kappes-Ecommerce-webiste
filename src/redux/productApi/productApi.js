import { api } from "../baseApi";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPopularCategory: builder.query({
      query: () => {
        return {
          url: `/category?sort=-ctgViewCount`,
          method: "GET",
        };
      },
    }),
    getCategory: builder.query({
      query: () => {
        return {
          url: `/category`,
          method: "GET",
        };
      },
    }),
    getRecommendedProducts: builder.query({
      query: () => {
        return {
          url: `/product/recommended`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    getRelatedProducts: builder.query({
      query: (categoryId) => {
        return {
          url: `/product/category/${categoryId}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    getTrendingProducts: builder.query({
      query: (params) => {
        const { page = 1, limit = 10, ...queryParams } = params || {};
        return {
          url: `/product`,
          method: "GET",
          params: {
            sort: "-purchaseCount",
            page,
            limit,
            ...queryParams,
          },
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    getAllProducts: builder.query({
      query: (params) => {
        const { id, page = 1, limit = 10, ...queryParams } = params || {};

        // If id is provided, get a specific product
        if (id) {
          return {
            url: `/product/${id}`,
            method: "GET",
          };
        }

        // Otherwise get all products with pagination
        return {
          url: `/product`,
          method: "GET",
          params: {
            page,
            limit,
            ...queryParams,
          },
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    getFeaturedProducts: builder.query({
      query: (params) => {
        const { page = 1, limit = 10 } = params || {};
        return {
          url: `/product`,
          method: "GET",
          params: {
            isFeatured: true,
            page,
            limit,
          },
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    updateProduct: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/product",
          method: "PATCH",
          body: data,
        };
      },
    }),
    getReviewByProductId: builder.query({
      query: (productId) => {
        return {
          url: `/review/product/${productId}`,
          method: "GET",
        };
      },
    }),
    getShopProducts: builder.query({
      query: (params) => {
        const { page = 1, limit = 10, ...queryParams } = params || {};
        return {
          url: `/product`,
          method: "GET",
          params: {
            page,
            limit,
            ...queryParams,
          },
        };
      },
    }),
    addToFavProduct: builder.mutation({
      query: (productId) => {
        return {
          url: `/wishlist`,
          method: "POST",
          body: { productId: productId },
        };
      },
      invalidatesTags: ["WISHLIST", "PRODUCT"],
      transformResponse: (response) => {
        return response;
      },
    }),
    removeFromFavProduct: builder.mutation({
      query: (productId) => {
        return {
          url: `/wishlist/${productId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["WISHLIST", "PRODUCT"],
      transformResponse: (response) => {
        return response;
      },
    }),
    getFavProducts: builder.query({
      query: () => {
        return {
          url: `/wishlist`,
          method: "GET",
        };
      },
      providesTags: ["WISHLIST"],
      transformResponse: (response) => {
        return response;
      },
    }),
    getProductByProvince: builder.query({
      query: (provinceName) => {
        if (!provinceName) {
          throw new Error("Province name is required");
        }
        return {
          url: `/product/province/${encodeURIComponent(provinceName)}`,
          method: "GET",
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Ensure each province gets its own cache entry
        return `${endpointName}(${queryArgs || ""})`;
      },
      providesTags: (result, error, provinceName) => [
        { type: "PRODUCT", id: `PROVINCE-${provinceName}` },
      ],
      transformResponse: (response) => {
        return response;
      },
    }),
    getProductByTerritory: builder.query({
      query: (territoryName) => {
        if (!territoryName) {
          throw new Error("Territory name is required");
        }
        return {
          url: `/product/territory/${encodeURIComponent(territoryName)}`,
          method: "GET",
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Ensure each territory gets its own cache entry
        return `${endpointName}(${queryArgs || ""})`;
      },
      providesTags: (result, error, territoryName) => [
        { type: "PRODUCT", id: `TERRITORY-${territoryName}` },
      ],
      transformResponse: (response) => {
        return response;
      },
    }),
    getProductByCity: builder.query({
      query: (cityName) => {
        if (!cityName) {
          throw new Error("City name is required");
        }
        return {
          url: `/product/city/${encodeURIComponent(cityName)}`,
          method: "GET",
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Ensure each city gets its own cache entry
        return `${endpointName}(${queryArgs || ""})`;
      },
      providesTags: (result, error, cityName) => [
        { type: "PRODUCT", id: `CITY-${cityName}` },
      ],
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPopularCategoryQuery,
  useGetRecommendedProductsQuery,
  // useGetRelatedProductsQuery, // Commented out to avoid duplicate declaration
  useGetTrendingProductsQuery,
  useGetAllProductsQuery,
  useGetFeaturedProductsQuery,
  useUpdateProductMutation,
  useGetReviewByProductIdQuery,
  useGetShopProductsQuery,
  useAddToFavProductMutation,
  useRemoveFromFavProductMutation,
  useGetFavProductsQuery,
  useGetCategoryQuery,
  useGetProductByProvinceQuery,
  useGetProductByTerritoryQuery,
  useGetProductByCityQuery,
} = productApi;

// Export directly to ensure it's available
export const useGetRelatedProductsQuery =
  productApi.endpoints.getRelatedProducts.useQuery;
