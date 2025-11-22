import { api } from '../../baseApi';


const overviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: (id) => {
        return {
          url: `/shop/overview/${id}`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyCartQuery,
} = overviewApi;
