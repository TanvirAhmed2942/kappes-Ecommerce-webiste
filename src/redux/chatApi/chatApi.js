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
      providesTags: ["ChatList"],
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
        const invalidatedTags = [];

        if (dataString) {
          try {
            const data = JSON.parse(dataString);
            // Invalidate messages for this chat
            invalidatedTags.push({ type: "Messages", id: data.chatId });
          } catch (e) {
            // Ignore parse errors
          }
        }

        // Also invalidate chat lists to refresh the sorted order
        // This ensures the chat list is re-fetched and re-sorted after sending a message
        invalidatedTags.push({ type: "ChatList" });
        return invalidatedTags;
      },
    }),
    getMessages: builder.query({
      query: ({ chatId, page = 1, limit = 10 }) => {
        return {
          url: `/message/chat/${chatId}?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { chatId }) => [
        { type: "Messages", id: chatId },
      ],
      // Keep cache time very short - 0 seconds
      keepUnusedDataFor: 0,
      // Transform response to include chatId for verification
      transformResponse: (response, meta, arg) => {
        return {
          ...response,
          _chatId: arg.chatId,
          _page: arg.page, // Also include page number
        };
      },
    }),
    getShopId: builder.query({
      query: () => {
        return {
          url: `/shop/my-shops`,
          method: "GET",
        };
      },
    }),
    getChatListShopOwner: builder.query({
      query: (shopId) => {
        return {
          url: `/chat/shop/${shopId}`,
          method: "GET",
        };
      },
      providesTags: ["ChatList"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetChatforUserQuery,
  useCreateMessageMutation,
  useGetMessagesQuery,
  useGetChatListShopOwnerQuery,
  useGetShopIdQuery,
} = chatApi;
