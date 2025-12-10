import { api } from "../baseApi";

const advertisementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    toggleAdvertisement: builder.mutation({
      query: ({ data, shopId }) => {
        return {
          url: `/shop/toggle-advertise/${shopId}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Advertisement"],
    }),
  }),
  overrideExisting: true,
});

export const { useToggleAdvertisementMutation } = advertisementApi;
