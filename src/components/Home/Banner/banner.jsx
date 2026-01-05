"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useGetBannerLogoQuery } from "../../../redux/bannerlogoApi/bannerlogoApi";
import { getImageUrl } from "../../../redux/baseUrl";

export default React.memo(function Banner() {
  const { data: bannerLogo, isLoading } = useGetBannerLogoQuery();

  // Get banners from API response
  const bannerImages = React.useMemo(() => {
    if (!bannerLogo?.data?.banner) return [];

    return Array.isArray(bannerLogo.data.banner) ? bannerLogo.data.banner : [];
  }, [bannerLogo]);

  if (isLoading) {
    return (
      <div className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[600px] 2xl:h-[800px] bg-gray-200 animate-pulse" />
    );
  }

  if (!bannerImages || bannerImages.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={bannerImages.length > 1}
        className="w-full h-full"
      >
        {bannerImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full">
              <Image
                width={2048}
                height={2048}
                src={`${getImageUrl()}${
                  image.startsWith("/") ? image.slice(1) : image
                }`}
                alt={`Banner ${index + 1}`}
                className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[600px] 2xl:h-[800px] object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pill-style pagination */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 9999px;
          margin: 0 6px !important;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          width: 24px;
          background-color: #b01501;
        }

        @media (min-width: 768px) {
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
          }
          .swiper-pagination-bullet-active {
            width: 32px;
          }
        }
      `}</style>
    </div>
  );
});
