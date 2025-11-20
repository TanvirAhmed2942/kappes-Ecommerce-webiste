import { api } from "../baseApi";

const userprofileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => {
        return {
          url: `/users/profile`,
          method: "GET",
        };
      },
      providesTags: ["UserProfile"],
    }),
    updateUserProfile: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/users/profile",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["UserProfile"],
    }),
    getMyOrders: builder.query({
      query: () => {
        return {
          url: "/order/my-orders",
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetMyOrdersQuery,
} = userprofileApi;
