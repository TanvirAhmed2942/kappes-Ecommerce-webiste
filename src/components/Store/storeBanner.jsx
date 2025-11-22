import CarouselPlay from "../../common/components/carousel";
import React from "react";

function StoreBanner({ shopBanner }) {
  const bannerItem = shopBanner?.map((banner) => {
    return {
      id: banner?.id,
      image: `${getImageUrl}${banner}`,
    };
  });
  return (
    <div className="w-full ">
      <CarouselPlay slideItem={bannerItem} />
    </div>
  );
}

export default StoreBanner;
