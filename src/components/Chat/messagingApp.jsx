"use client";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { openChat, closeChat } from "../../features/chatSlice";
import Sidebar from "./chatSidebar";
import ChatBox from "./chatBox";
import { useGetChatforUserQuery } from "@/redux/chatApi/chatApi";
import useUser from "@/hooks/useUser";
import { getImageUrl } from "@/redux/baseUrl";

const MessagingApp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { currentSeller, isChatOpen } = useSelector((state) => state.chat);
  const [selectedChat, setSelectedChat] = useState(null);
  const { userId } = useUser();

  const { data: chatsData, isLoading } = useGetChatforUserQuery();

  // Transform API response to format expected by Sidebar
  const users = useMemo(() => {
    if (!chatsData?.data?.chats || !userId) return [];

    return chatsData.data.chats
      .map((chat) => {
        // Find the other participant (not the current user)
        const otherParticipant = chat.participants.find((participant) => {
          if (participant.participantType === "User") {
            return participant.participantId?._id !== userId;
          }
          // For Shop type, always include (shops are not users)
          return participant.participantType === "Shop";
        });

        if (!otherParticipant) return null;

        const participantId = otherParticipant.participantId;
        const isShop = otherParticipant.participantType === "Shop";

        // Get avatar URL with base URL prefix
        const getAvatarUrl = (imagePath) => {
          if (!imagePath) return "/assets/chat/default-user.png";
          // If image path already starts with http, return as is
          if (imagePath.startsWith("http")) return imagePath;
          // Otherwise, prefix with base URL
          return `${getImageUrl}${
            imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
          }`;
        };

        return {
          id: chat._id,
          chatId: chat._id,
          name: isShop
            ? participantId?.name || "Unknown Shop"
            : participantId?.full_name || "Unknown User",
          avatar: isShop
            ? getAvatarUrl(participantId?.logo)
            : getAvatarUrl(participantId?.image),
          lastMessage: chat.lastMessage
            ? typeof chat.lastMessage === "string"
              ? chat.lastMessage
              : chat.lastMessage.content || "No messages yet"
            : "No messages yet",
          isOnline: true, // You can update this based on your online status logic
          lastSeen: chat.lastMessage?.createdAt
            ? new Date(chat.lastMessage.createdAt).toLocaleTimeString()
            : "Never",
          participantType: otherParticipant.participantType,
          participantId: participantId?._id,
        };
      })
      .filter(Boolean); // Remove null entries
  }, [chatsData, userId]);

  // Sync selectedChat with URL parameter
  useEffect(() => {
    if (!users.length) return;

    if (params?.id) {
      const chatFromUrl = users.find((user) => user.id === params.id);
      if (chatFromUrl && selectedChat?.id !== chatFromUrl.id) {
        setSelectedChat(chatFromUrl);
        dispatch(
          openChat({
            id: chatFromUrl.id,
            name: chatFromUrl.name,
            avatar: chatFromUrl.avatar,
            isOnline: chatFromUrl.isOnline,
            lastSeen: chatFromUrl.lastSeen,
          })
        );
      }
    } else if (!params?.id && !selectedChat && users.length > 0) {
      // If no URL param and no selected chat, select first chat and update URL
      const firstChat = users[0];
      setSelectedChat(firstChat);
      router.push(`/chat/${firstChat.id}`);
      dispatch(
        openChat({
          id: firstChat.id,
          name: firstChat.name,
          avatar: firstChat.avatar,
          isOnline: firstChat.isOnline,
          lastSeen: firstChat.lastSeen,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, users]);

  // Sync selectedChat with Redux currentSeller (fallback)
  useEffect(() => {
    if (currentSeller && currentSeller.id !== selectedChat?.id) {
      setSelectedChat(currentSeller);
      router.push(`/chat/${currentSeller.id}`);
    }
  }, [currentSeller, router, selectedChat]);

  const handleUserSelect = (user) => {
    setSelectedChat(user);
    // Update URL with chat ID
    router.push(`/chat/${user.id}`);
    // Open chat with selected user in Redux
    dispatch(
      openChat({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[85vh] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row border w-full h-[85vh] bg-gray-50 lg:px-32">
      {/* Mobile Sidebar (Horizontal on top) */}
      <div className="md:hidden w-full border-b max-h-48">
        <Sidebar
          users={users}
          selectedChat={selectedChat}
          onUserSelect={handleUserSelect}
          orientation="horizontal"
        />
      </div>

      {/* Desktop Sidebar (Vertical) */}
      <div className="hidden md:block w-80 border-r">
        <Sidebar
          users={users}
          selectedChat={selectedChat}
          onUserSelect={handleUserSelect}
          orientation="vertical"
        />
      </div>

      {/* Chat Area */}
      <ChatBox selectedChat={selectedChat} />
    </div>
  );
};

export default MessagingApp;
