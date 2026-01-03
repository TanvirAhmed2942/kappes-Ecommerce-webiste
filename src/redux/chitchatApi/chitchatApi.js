import { api } from "../baseApi";

const chitchatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    enableChitchat: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/chit-chat-shipments/shipping-keys`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["Chitchat"],
    }),
  }),
  overrideExisting: true,
});

export const { useEnableChitchatMutation } = chitchatApi;
