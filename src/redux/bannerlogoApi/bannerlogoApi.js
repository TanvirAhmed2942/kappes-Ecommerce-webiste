import { api } from "../baseApi";

const bannerlogoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBannerLogo: builder.query({
      query: () => {
        return {
          url: `/settings/banner-logo`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetBannerLogoQuery } = bannerlogoApi;
