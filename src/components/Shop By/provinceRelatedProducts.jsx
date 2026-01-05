"use client";
import useVirtualizedList from "../../hooks/VirtualizedList";
import { useState, useMemo } from "react";
import Image from "next/image";

import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";
import { getImageUrl } from "../../redux/baseUrl";
import { MapPin } from "lucide-react";

export default function ProvinceRelatedProducts({
  shops = [],
  isLoading = false,
  selectedLocation = "",
  selectedTab = "province",
}) {
  const [sortOption, setSortOption] = useState("featured");

  // Transform API shops to match component structure
  const transformedShops = useMemo(() => {
    return shops.map((shop) => {
      // Format location: City, Province/Territory
      const city = shop.address?.city || "";
      const province = shop.address?.province || shop.address?.territory || "";
      const location = [city, province].filter(Boolean).join(", ");

      return {
        id: shop._id || shop.id,
        name: shop.name,
        logo: shop.logo,
        coverPhoto: shop.coverPhoto,
        banner: shop.banner || [],
        rating: Math.round(shop.rating || 0),
        totalReviews: shop.totalReviews || 0,
        totalFollowers: shop.totalFollowers || 0,
        location: location,
        city: city,
        province: province,
        isAdvertised: shop.isAdvertised || false,
        isActive: shop.isActive || false,
        description: shop.description || "",
      };
    });
  }, [shops]);

  // Sort shops based on sort option
  const sortedShops = useMemo(() => {
    const sorted = [...transformedShops];
    switch (sortOption) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "followers":
        return sorted.sort((a, b) => b.totalFollowers - a.totalFollowers);
      case "newest":
        return sorted; // API doesn't provide createdAt in this response
      default:
        return sorted;
    }
  }, [transformedShops, sortOption]);

  const ITEM_HEIGHT = 400;
  const COLUMN_COUNT = 3;
  const OVERSCAN = 5;

  const { containerRef, visibleItems, totalHeight, offsetY } =
    useVirtualizedList(sortedShops, ITEM_HEIGHT, OVERSCAN, COLUMN_COUNT);

  return (
    <div className="flex flex-col w-full">
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline">
            Shops ({sortedShops.length} shops)
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-auto w-full"
        style={{ height: "calc(100vh - 73px)", minHeight: "400px" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading shops...</p>
            </div>
          </div>
        ) : !selectedLocation ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                Please select a {selectedTab} to view shops
              </p>
            </div>
          </div>
        ) : sortedShops.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                No shops found for this {selectedTab}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ height: `${totalHeight}px` }}>
            <div
              className="absolute left-0 right-0"
              style={{ transform: `translateY(${offsetY}px)` }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                {visibleItems.map((shopItem) => {
                  // Construct cover photo URL (use coverPhoto or first banner image)
                  const coverPath =
                    shopItem.coverPhoto || shopItem.banner?.[0] || "";
                  let coverUrl = "/assets/default-shop-cover.jpg";
                  if (coverPath) {
                    if (coverPath.startsWith("http")) {
                      coverUrl = coverPath;
                    } else {
                      // Ensure proper URL construction - remove trailing slash from base and leading slash from path
                      const baseUrl = getImageUrl().replace(/\/$/, ""); // Remove trailing slash
                      const cleanPath = coverPath.startsWith("/")
                        ? coverPath
                        : `/${coverPath}`;
                      coverUrl = `${baseUrl}${cleanPath}`;
                      console.log("coverUrl", coverUrl);
                    }
                  }

                  // Construct logo URL
                  const logoPath = shopItem.logo || "";
                  let logoUrl = "/assets/default-store-logo.png";
                  if (logoPath) {
                    if (logoPath.startsWith("http")) {
                      logoUrl = logoPath;
                    } else {
                      // Ensure proper URL construction - remove trailing slash from base and leading slash from path
                      const baseUrl = getImageUrl().replace(/\/$/, ""); // Remove trailing slash
                      const cleanPath = logoPath.startsWith("/")
                        ? logoPath
                        : `/${logoPath}`;
                      logoUrl = `${baseUrl}${cleanPath}`;
                      console.log("logoUrl", logoUrl);
                    }
                  }

                  return (
                    <Link key={shopItem.id} href={`/store/${shopItem.id}`}>
                      <Card className="overflow-hidden rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col bg-white">
                        {/* Background Image Container */}
                        <div className="relative w-full h-56 bg-gray-200 rounded-lg">
                          <Image
                            src={coverUrl}
                            alt={shopItem.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {/* Logo Badge - Bottom Left */}
                          <div className="absolute -bottom-6 left-3 bg-white rounded-lg p-1 shadow-lg">
                            <div className="relative w-14 h-14 perspective-1000">
                              <Image
                                src={logoUrl}
                                alt={`${shopItem.name} logo`}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full rounded-lg hover:rotate-x-40 hover:-rotate-y-10 hover:-rotate-z-10 hover:scale-110 transition-transform duration-300"
                                sizes="80px"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shop Info */}
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {shopItem.name}
                          </h3>
                          {shopItem.location && (
                            <div className="flex items-center text-sm text-gray-600 mt-auto">
                              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {shopItem.location}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
