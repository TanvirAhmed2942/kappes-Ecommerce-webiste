"use client";

import {
  Heart,
  LayoutGrid,
  Lock,
  LogOut,
  Package,
  ShoppingCart,
  Star,
  Store,
  Ticket,
  UserCog,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Image from "next/image";
import {
  getStoreInfo,
  setStoreInfo,
} from "../../features/sellerStoreSlice/sellerStoreSlice";
import { useSelector, useDispatch } from "react-redux";
import { getImageUrl } from "../../redux/baseUrl";
import { VscTag } from "react-icons/vsc";
import { TbBoomFilled, TbPackages } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import { MdAdsClick } from "react-icons/md";
import { useGetStoreInfoQuery } from "../../redux/sellerApi/storeInfoApi/storeInfoApi";
import { useEnableChitchatMutation } from "../../redux/chitchatApi/chitchatApi";
import useToast from "../../hooks/useShowToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AppSidebar = () => {
  const [activeItem, setActiveItem] = useState("Overview");
  const [isChitChatModalOpen, setIsChitChatModalOpen] = useState(false);
  const [chitchatsClientId, setChitchatsClientId] = useState("");
  const [chitchatsAccessToken, setChitchatsAccessToken] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const storeInfo = useSelector(getStoreInfo);
  const {
    data: storeInfoData,
    isLoading: storeInfoLoading,
    error: storeInfoError,
    refetch: refetchStoreInfo,
  } = useGetStoreInfoQuery();
  const menuItems = [
    {
      icon: LayoutGrid,
      label: "Overview",
      active: true,
      path: "/seller/overview",
    },
    { icon: Package, label: "Category", path: "/seller/category" },
    { icon: TbPackages, label: "SubCategory", path: "/seller/subcategory" },
    { icon: VscTag, label: "Brand", path: "/seller/brand" },
    { icon: BsBoxSeam, label: "Product", path: "/seller/product" },
    { icon: ShoppingCart, label: "Order List", path: "/seller/order" },
    { icon: Ticket, label: "Coupon", path: "/seller/coupon" },
    { icon: Store, label: "Store info", path: "/seller/store" },
    { icon: Heart, label: "Owner info", path: "/seller/owner" },
    { icon: Star, label: "Reviews", path: "/seller/review" },
    { icon: MdAdsClick, label: "Advertisement", path: "/seller/advertise" },
    // { icon: UserCog, label: "Admin Role", path: "/seller/admin" },
    { icon: Lock, label: "Change Password", path: "/seller/change-password" },
    { icon: LogOut, label: "Logout" },
  ];
  const handleLogout = () => {
    logout();
    router.push("/auth/become-seller-login");
  };
  const [
    enableChitchat,
    { isLoading: isEnableChitchatLoading, isError: isEnableChitchatError },
  ] = useEnableChitchatMutation();
  const toast = useToast();

  // Update store info in Redux when API data is available
  useEffect(() => {
    if (storeInfoData?.data?.name) {
      dispatch(
        setStoreInfo({
          storeName: storeInfoData.data.name,
          storeLogo: storeInfoData.data.logo,
          isAdvertised: storeInfoData.data.isAdvertised || false,
          advertisedAt: storeInfoData.data.advertisedAt || null,
          advertisedExpiresAt: storeInfoData.data.advertisedExpiresAt || null,
          advertisementBanner: storeInfoData.data.advertisement_banner || [],
          isChitChatsEnabled: storeInfoData.data.isChitChatsEnabled || false,
        })
      );
    }
  }, [storeInfoData, storeInfo, dispatch, storeInfoLoading, storeInfoError]);

  useEffect(() => {
    const currentMenuItem = menuItems.find((item) => item.path === pathname);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.label);
    }
  }, [pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.label);
    if (item.path) {
      router.push(item.path);
    }
    if (item.label === "Logout") {
      handleLogout();
    }
  };

  const isChitChatEnabled =
    storeInfoData?.data?.isChitChatsEnabled || storeInfo?.isChitChatsEnabled;

  const handleChitChatClick = () => {
    // If ChitChat is disabled, show modal to enter credentials
    if (!isChitChatEnabled) {
      setIsChitChatModalOpen(true);
    }
    // If enabled, do nothing (or you can add functionality to disable it)
  };

  const handleSaveChitChatCredentials = async () => {
    // Validate inputs
    if (!chitchatsClientId.trim() || !chitchatsAccessToken.trim()) {
      toast.showError("Please fill in both fields");
      return;
    }

    try {
      const shopId = localStorage.getItem("shop");

      if (!shopId) {
        console.error("Shop ID not found in localStorage");
        toast.showError("Shop ID not found. Please login again.");
        return;
      }

      const requestData = {
        shopId: shopId,
        chitchats_client_id: chitchatsClientId.trim(),
        chitchats_access_token: chitchatsAccessToken.trim(),
      };

      console.log("Enabling ChitChat with data:", requestData);

      const response = await enableChitchat({
        data: requestData,
      }).unwrap();

      console.log("ChitChat enabled successfully:", response);

      if (response?.success) {
        toast.showSuccess(
          response?.message || "ChitChat enabled successfully!"
        );
        // Close modal and reset form
        setIsChitChatModalOpen(false);
        setChitchatsClientId("");
        setChitchatsAccessToken("");
        // Refetch store info to get updated chitchat status
        refetchStoreInfo();
      } else {
        toast.showError(response?.message || "Failed to enable ChitChat");
      }
    } catch (error) {
      console.error("Error enabling chit chat:", error);
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessages?.[0]?.message ||
        error?.data?.error?.[0]?.message ||
        error?.message ||
        "Failed to enable ChitChat. Please try again.";

      toast.showError(errorMessage);
    }
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg p-6 min-h-screen">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <Image
          src={
            storeInfo?.storeLogo
              ? `${getImageUrl}${
                  storeInfo.storeLogo.startsWith("/")
                    ? storeInfo.storeLogo.slice(1)
                    : storeInfo.storeLogo
                }`
              : "/assets/default-store-logo.png"
          }
          alt="store logo"
          width={100}
          height={100}
          className="w-24 h-24 ring-2 ring-[#B01501] rounded-full object-contain bg-white p-1"
        />

        <h2 className="text-xl font-semibold text-gray-900 my-2">
          {storeInfoLoading
            ? "Loading..."
            : storeInfo?.storeName || "Store Name"}
        </h2>
        {storeInfoError && (
          <p className="text-xs text-red-500">Error loading store info</p>
        )}
      </div>

      <div
        className={`flex items-center gap-2 p-4 rounded-lg cursor-pointer transition-colors ${
          isChitChatEnabled ? "bg-transparent" : "bg-red-300 hover:bg-red-400"
        }`}
        onClick={handleChitChatClick}
      >
        {isChitChatEnabled ? (
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 205 197"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 146.5L102.5 197V0L46.5 103L0 67.5L12.5 146.5Z"
                fill="#F22631"
              />
              <path
                d="M192.5 146.5L102.5 197V0L158.5 103L205 67.5L192.5 146.5Z"
                fill="#B52428"
              />
            </svg>
            <p className="text-xs text-gray-500">Chit Chat Enabled</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 205 197"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 146.5L102.5 197V0L46.5 103L0 67.5L12.5 146.5Z"
                fill="#EBEBEB"
              />
              <path
                d="M192.5 146.5L102.5 197V0L158.5 103L205 67.5L192.5 146.5Z"
                fill="#A7A7A7"
              />
            </svg>
            <p className="text-xs text-gray-500">
              {isEnableChitchatLoading ? "Enabling..." : "Chit Chat Disabled"}
            </p>
          </div>
        )}
      </div>

      {/* ChitChat Credentials Modal */}
      <Dialog open={isChitChatModalOpen} onOpenChange={setIsChitChatModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable ChitChat Shipping</DialogTitle>
            <DialogDescription>
              Enter your ChitChat credentials to enable shipping integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chitchats_client_id">
                ChitChats Client ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chitchats_client_id"
                placeholder="Enter ChitChats Client ID"
                value={chitchatsClientId}
                onChange={(e) => setChitchatsClientId(e.target.value)}
                disabled={isEnableChitchatLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chitchats_access_token">
                ChitChats Access Token <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chitchats_access_token"
                type="password"
                placeholder="Enter ChitChats Access Token"
                value={chitchatsAccessToken}
                onChange={(e) => setChitchatsAccessToken(e.target.value)}
                disabled={isEnableChitchatLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsChitChatModalOpen(false);
                setChitchatsClientId("");
                setChitchatsAccessToken("");
              }}
              disabled={isEnableChitchatLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChitChatCredentials}
              disabled={isEnableChitchatLoading}
              className="bg-[#B01501] hover:bg-[#8B1100] text-white"
            >
              {isEnableChitchatLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#B01501] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium flex items-center justify-between w-full">
                {item.label}
                {item.label === "Advertisement" && storeInfo?.isAdvertised ? (
                  <TbBoomFilled className="w-5 h-5 text-red-500 animate-pulse" />
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppSidebar;
