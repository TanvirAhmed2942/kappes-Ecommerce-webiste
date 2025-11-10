import { api } from "../baseApi";

const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChatforUser: builder.query({
      query: () => {
        return {
          url: `/chat/user`,
          method: "GET",
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetChatforUserQuery } = chatApi;
