import { api } from "../baseApi";

const policiesAndFaqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query({
      query: () => {
        return {
          url: `/faqs`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetFAQsQuery } = policiesAndFaqApi;
