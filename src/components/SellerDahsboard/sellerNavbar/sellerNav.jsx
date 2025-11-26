"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineMessage } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { getImageUrl } from "../../../redux/baseUrl";
import useUser from "../../../hooks/useUser";
import useAuth from "../../../hooks/useAuth";
import { openChat } from "../../../features/chatSlice";
import { logout } from "../../../features/authSlice/authSlice";
import LogoutAlertModal from "./logoutAlertModal";

const SellerNav = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, logout: handleLogout } = useAuth();
  const { userImage, userName } = useUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const cartItemCount = useSelector((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  // Get unread message count from Redux
  const { unreadCount, currentSeller } = useSelector((state) => state.chat);

  // Handle opening chat
  const handleOpenChat = () => {
    if (!currentSeller) {
      dispatch(
        openChat({
          id: 1,
          name: "Customer Support",
          avatar: "/assets/chat/support-avatar.png",
          isOnline: true,
          lastSeen: "Online",
        })
      );
    }
  };

  // Handle logo click - show logout modal
  const handleClickLogo = () => {
    if (isLoggedIn) {
      setIsLogoutModalOpen(true);
    } else {
      router.push("/");
    }
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    // Clear auth state manually without using the hook's logout function
    // which redirects to /auth/login
    dispatch(logout());
    router.push("/auth/become-seller-login");
  };

  // Handle logout cancellation
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };
  const handleClickUser = () => {
    router.push("/seller/overview");
  };
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 lg:px-8 xl:px-32">
      {/* Logo */}
      <div className="flex-shrink-0 cursor-pointer" onClick={handleClickLogo}>
        <Image
          src="/assets/topnavimg.png"
          alt="Website Logo"
          width={200}
          height={200}
          className="object-contain hidden sm:block h-12 sm:h-16"
        />
        <Image
          src="/assets/footer/footericon.png"
          alt="Website Logo"
          width={36}
          height={36}
          className="object-contain block sm:hidden w-9 h-9"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Messages Icon - Responsive */}
        <Link href="/chat/all-chat" className="relative">
          <Button
            onClick={handleOpenChat}
            className="relative flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none bg-white shadow-none w-10 h-10  rounded-full hover:bg-gray-100 sm:hover:bg-gray-300 cursor-pointer p-0"
          >
            <AiOutlineMessage className="!w-7 !h-7" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Conditional: Sign In or User Name */}
        {!isLoggedIn ? (
          <Link
            href="/auth/logins"
            className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-gray-700 text-sm sm:text-base"
          >
            <FaRegUser className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleClickUser}
          >
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage
                src={
                  userImage
                    ? `${getImageUrl}/${userImage}`
                    : "/assets/userProfile/profileImage.jpg"
                }
                alt={userName || "User"}
              />
              <AvatarFallback className="text-xs sm:text-sm">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 max-w-[120px] sm:max-w-[200px] truncate">
              {userName || "User"}
            </span>
          </div>
        )}
      </div>

      {/* Logout Alert Modal */}
      <LogoutAlertModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </nav>
  );
};

export default SellerNav;
