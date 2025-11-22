import CarouselPlay from "../../common/components/carousel";
import React from "react";
import { getImageUrl } from "../../redux/baseUrl";

function StoreBanner({ shopBanner }) {
  // Ensure shopBanner is an array
  const bannerArray = Array.isArray(shopBanner) ? shopBanner : [];

  const bannerItem = bannerArray.map((banner, index) => {
    return {
      id: banner?.id || index + 1,
      image: banner?.url || `${getImageUrl}/${banner}`,
    };
  });

  // Don't render carousel if no banners
  if (bannerItem.length === 0) {
    return null;
  }

  return (
    <div className="w-full ">
      <CarouselPlay slideItem={bannerItem} />
    </div>
  );
}

export default StoreBanner;
