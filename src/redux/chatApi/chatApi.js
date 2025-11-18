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
    createMessage: builder.mutation({
      query: (formData) => {
        return {
          url: `/message`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => {
        // Extract chatId from FormData
        const dataString = arg.get("data");
        if (dataString) {
          try {
            const data = JSON.parse(dataString);
            return [{ type: "Messages", id: data.chatId }];
          } catch (e) {
            return [];
          }
        }
        return [];
      },
    }),
    getMessages: builder.query({
      query: (chatId) => {
        return {
          url: `/message/chat/${chatId}`,
          method: "GET",
        };
      },
      providesTags: (result, error, chatId) => [
        { type: "Messages", id: chatId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetChatforUserQuery,
  useCreateMessageMutation,
  useGetMessagesQuery,
} = chatApi;
