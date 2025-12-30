"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetFollowedShopsQuery } from "../../../redux/userprofileApi/userprofileApi";
import { getImageUrl } from "../../../redux/baseUrl";
import { Card, CardContent } from "../../ui/card";
import { MapPin } from "lucide-react";

function FollowedShop({ selectedMenu }) {
  const {
    data: followedShopsData,
    isLoading,
    error,
  } = useGetFollowedShopsQuery();

  // Extract shops array from response - handle different response structures
  const extractShops = () => {
    if (!followedShopsData) return [];

    // Case 1: { success: true, data: { shops: [...] } }
    if (
      followedShopsData?.success &&
      followedShopsData?.data?.shops &&
      Array.isArray(followedShopsData.data.shops)
    ) {
      return followedShopsData.data.shops;
    }

    // Case 2: { data: { shops: [...] } }
    if (
      followedShopsData?.data?.shops &&
      Array.isArray(followedShopsData.data.shops)
    ) {
      return followedShopsData.data.shops;
    }

    // Case 3: { success: true, data: [...] }
    if (followedShopsData?.success && Array.isArray(followedShopsData.data)) {
      return followedShopsData.data;
    }

    // Case 4: { data: [...] }
    if (Array.isArray(followedShopsData?.data)) {
      return followedShopsData.data;
    }

    // Case 5: { data: { result: [...] } }
    if (
      followedShopsData?.data?.result &&
      Array.isArray(followedShopsData.data.result)
    ) {
      return followedShopsData.data.result;
    }

    // Case 6: Direct array
    if (Array.isArray(followedShopsData)) {
      return followedShopsData;
    }

    return [];
  };

  const followedShops = extractShops();

  // Debug logging
  console.log("Followed Shops API Response:", followedShopsData);
  console.log("Extracted Shops:", followedShops);

  if (selectedMenu !== 4) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading followed shops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        <p>
          Error:{" "}
          {error?.data?.message ||
            error?.message ||
            "Failed to load followed shops"}
        </p>
      </div>
    );
  }

  if (!Array.isArray(followedShops) || followedShops.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-gray-900">
        <p>You haven't followed any shops yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Followed Shops</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {followedShops.map((shop) => {
          const shopId = shop._id || shop.id;
          const shopName = shop.name || shop.storeName || "Shop";

          // Format location: City, Province/Territory
          const city = shop.address?.city || "";
          const province =
            shop.address?.province || shop.address?.territory || "";
          const location = [city, province].filter(Boolean).join(", ");

          // Construct cover photo URL (use coverPhoto or first banner image)
          const coverPath = shop.coverPhoto || shop.banner?.[0] || "";
          const coverUrl = coverPath
            ? coverPath.startsWith("http")
              ? coverPath
              : `${getImageUrl}${
                  coverPath.startsWith("/") ? coverPath.slice(1) : coverPath
                }`
            : "/assets/default-shop-cover.jpg";

          // Construct logo URL
          const logoPath = shop.logo || shop.image || "";
          const logoUrl = logoPath
            ? logoPath.startsWith("http")
              ? logoPath
              : `${getImageUrl}${
                  logoPath.startsWith("/") ? logoPath.slice(1) : logoPath
                }`
            : "/assets/default-store-logo.png";

          return (
            <Link key={shopId} href={`/store/${shopId}`}>
              <Card className="overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full  flex flex-col bg-white">
                {/* Background Image Container */}
                <div className="relative w-full h-32 bg-gray-200 rounded-lg">
                  <Image
                    src={coverUrl}
                    alt={shopName}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  {/* Logo Badge - Bottom Left */}
                  <div className="absolute bottom-2 left-2 bg-white rounded-lg p-1 shadow-lg">
                    <div className="relative w-10 h-10">
                      <Image
                        src={logoUrl}
                        alt={`${shopName} logo`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="40px"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                  {shopName}
                </h3>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default FollowedShop;
