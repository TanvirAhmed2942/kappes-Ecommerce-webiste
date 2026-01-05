"use client"; // Ensure this is a Client Component

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ProvinceRelatedProducts from "./provinceRelatedProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useGetShopListProvinceQuery,
  useGetLocationListQuery,
} from "../../redux/shopApi/shopApi";
import { getImageUrl } from "../../redux/baseUrl";
// All locations data with flags
const locationsData = {
  province: [
    {
      id: 1,
      name: "British Columbia",
      image: "/assets/province/britshColumbia.png",
    },
    { id: 2, name: "Alberta", image: "/assets/province/alberta.png" },
    { id: 3, name: "Manitoba", image: "/assets/province/manitoba.png" },
    { id: 4, name: "Saskatchewan", image: "/assets/province/saskatchewan.png" },
    { id: 5, name: "Ontario", image: "/assets/province/ontario.png" },
    { id: 6, name: "Quebec", image: "/assets/province/quebec.png" },
    {
      id: 7,
      name: "New Brunswick",
      image: "/assets/province/newBrunswick.png",
    },
    { id: 8, name: "Nova Scotia", image: "/assets/province/novaScotia.png" },
    {
      id: 9,
      name: "Prince Edward Island",
      image: "/assets/province/princeEdwardIsland.png",
    },
    {
      id: 10,
      name: "Newfoundland",
      image: "/assets/province/newFoundland.png",
    },
  ],
  territory: [
    { id: 1, name: "Yukon", image: "/assets/city/Yukon.png" },
    {
      id: 2,
      name: "Northwest Territories",
      image: "/assets/city/Northwest Territories.png",
    },
    { id: 3, name: "Nunavut", image: "/assets/city/Nunavut.png" },
  ],
  city: [
    { id: 1, name: "Toronto", image: "/assets/province/ontario.png" },
    { id: 2, name: "Vancouver", image: "/assets/province/britshColumbia.png" },
    { id: 3, name: "Montreal", image: "/assets/province/quebec.png" },
    { id: 4, name: "Calgary", image: "/assets/province/alberta.png" },
    { id: 5, name: "Edmonton", image: "/assets/province/alberta.png" },
    { id: 6, name: "Ottawa", image: "/assets/province/ontario.png" },
    { id: 7, name: "Winnipeg", image: "/assets/province/manitoba.png" },
    { id: 8, name: "Halifax", image: "/assets/province/novaScotia.png" },
  ],
};

function ShopByProvinceLayout() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const locationParam = searchParams.get("location");

  const [selectedType, setSelectedType] = useState(typeParam || "province");
  const [selectedLocation, setSelectedLocation] = useState(
    locationParam ? decodeURIComponent(locationParam) : "Manitoba"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch all locations from API (no pagination)
  const { data: locationListData } = useGetLocationListQuery();

  // Update state when URL params change
  useEffect(() => {
    if (typeParam) {
      setSelectedType(typeParam);
    }
    if (locationParam) {
      setSelectedLocation(decodeURIComponent(locationParam));
    }
  }, [typeParam, locationParam]);

  // Reset image index when location changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedLocation]);

  // Get current locations based on selected type
  const currentLocations = useMemo(() => {
    return locationsData[selectedType] || [];
  }, [selectedType]);

  // Get selected location data - combine hardcoded flag with API banner image
  const selectedLocationData = useMemo(() => {
    // Get hardcoded location data (for flag image)
    const hardcodedLocation = currentLocations.find(
      (loc) => loc.name === selectedLocation
    );

    // Find matching location in API response by title (matches name)
    // Try exact match first, then case-insensitive match, also trim whitespace
    const apiLocation = locationListData?.data?.result?.find((loc) => {
      const apiTitle = loc.title?.trim();
      const selected = selectedLocation?.trim();
      return (
        apiTitle === selected ||
        apiTitle?.toLowerCase() === selected?.toLowerCase()
      );
    });

    // Get all banner images from API
    const bannerImages = [];
    if (
      apiLocation?.image &&
      Array.isArray(apiLocation.image) &&
      apiLocation.image.length > 0
    ) {
      apiLocation.image.forEach((imagePath) => {
        // Construct full URL - getImageUrl() already includes trailing slash
        if (imagePath.startsWith("http")) {
          bannerImages.push(imagePath); // Already a full URL
        } else {
          // Remove leading slash if present, then construct full URL
          const cleanPath = imagePath.startsWith("/")
            ? imagePath.slice(1)
            : imagePath;
          bannerImages.push(`${getImageUrl()}${cleanPath}`);
        }
      });
    }

    return {
      ...hardcodedLocation,
      bannerImages, // All API images for banner display
      bannerImage: bannerImages[0] || null, // First image for backward compatibility
    };
  }, [currentLocations, selectedLocation, locationListData]);

  // Handle type change
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setSelectedLocation(""); // Reset location when type changes
  };

  // Handle location change
  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };

  // Fetch shops based on selected location
  const {
    data: shopsData,
    isLoading,
    isFetching,
    error,
  } = useGetShopListProvinceQuery(
    {
      location: selectedLocation,
      locationType: selectedType,
    },
    {
      skip: !selectedLocation,
      refetchOnMountOrArgChange: true,
    }
  );

  // Extract shops from API response
  const shops = (() => {
    if (!selectedLocation) return [];
    if (isFetching || isLoading) return [];
    if (error) return [];
    if (shopsData?.data?.result && Array.isArray(shopsData.data.result)) {
      return shopsData.data.result;
    }
    return [];
  })();

  return (
    <div className="px-4 lg:px-32">
      {/* Selection Area */}
      <div className="w-full max-w-4xl mx-auto mt-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Type Select (Province/Territory/City) */}
          <div className="w-full ">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-12 bg-red-700 text-white border-red-700">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="province">
                  <span className="font-medium">Province</span>
                </SelectItem>
                <SelectItem value="territory">
                  <span className="font-medium">Territory</span>
                </SelectItem>
                <SelectItem value="city">
                  <span className="font-medium">City</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Select with Flag */}
          <div className="w-full ">
            <Select
              value={selectedLocation}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-full h-12">
                {selectedLocationData ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={selectedLocationData.image}
                      alt={selectedLocationData.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span>{selectedLocationData.name}</span>
                  </div>
                ) : (
                  <SelectValue placeholder={`Select a ${selectedType}`} />
                )}
              </SelectTrigger>
              <SelectContent>
                {currentLocations.map((location) => (
                  <SelectItem key={location.id} value={location.name}>
                    <div className="flex items-center gap-2">
                      <img
                        src={location.image}
                        alt={location.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span>{location.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Banner Image Display (like see all category) */}
        {selectedLocationData &&
          selectedLocationData.bannerImages &&
          selectedLocationData.bannerImages.length > 0 && (
            <div className="w-full mt-6 mb-6 flex flex-col items-center">
              <div className="w-full md:w-3/3">
                <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img
                    src={selectedLocationData.bannerImages[currentImageIndex]}
                    alt={`${selectedLocationData.name} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation arrows for multiple images */}
                  {selectedLocationData.bannerImages.length > 1 && (
                    <>
                      {/* Previous button */}
                      {currentImageIndex > 0 && (
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) => prev - 1)
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                          aria-label="Previous image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                      )}

                      {/* Next button */}
                      {currentImageIndex <
                        selectedLocationData.bannerImages.length - 1 && (
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) => prev + 1)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                          aria-label="Next image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      )}

                      {/* Dots indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {selectedLocationData.bannerImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Overlay with location name and flag */}
                  {/* Background overlay with opacity - separate from content */}
                  <div className="absolute inset-0 bg-black opacity-30"></div>

                  {/* Content overlay - fully opaque */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {/* Flag icon in top-left */}
                    {selectedLocationData.image && (
                      <div className="absolute top-4 left-4 w-20 h-20 md:w-24 md:h-24 z-20">
                        <Image
                          src={selectedLocationData.image}
                          alt={selectedLocationData.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    {/* Logo/Icon in center */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        <Image
                          src="/assets/logo.png"
                          alt="THE CANUCK MALL"
                          fill
                          className="object-contain"
                          style={{
                            filter:
                              "grayscale(100%)" +
                              " " +
                              "brightness(0) invert(1)",
                          }}
                        />
                      </div>
                      <h1 className="text-white text-2xl md:text-3xl font-bold text-center drop-shadow-lg">
                        THE CANUCK MALL
                      </h1>
                    </div>
                    {/* Location name */}
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold text-center mt-2 drop-shadow-lg">
                      Shop Stores across {selectedLocationData.name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Shops Display */}
      <div className="flex gap-5 py-5 px-5 md:px-24 w-full">
        <ProvinceRelatedProducts
          key={`${selectedType}-${selectedLocation}`}
          shops={shops}
          isLoading={isLoading}
          selectedLocation={selectedLocation}
          selectedTab={selectedType}
          bannerImage={selectedLocationData?.bannerImage}
        />
      </div>
    </div>
  );
}

export default ShopByProvinceLayout;
