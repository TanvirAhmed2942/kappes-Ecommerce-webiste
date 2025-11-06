import { api } from "../baseApi";

const policiesAndFaqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query({
      query: () => {
        return {
          url: `/faq`,
          method: "GET",
        };
      },
    }),
    getPrivacyPolicy: builder.query({
      query: () => {
        return {
          url: `/settings/privacy-policy`,
          method: "GET",
        };
      },
    }),
    getTermsAndConditions: builder.query({
      query: () => {
        return {
          url: `/settings/termsOfService`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFAQsQuery,
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
} = policiesAndFaqApi;
