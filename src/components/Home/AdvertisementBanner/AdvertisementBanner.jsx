"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

const bannerImages = [
  "/assets/cover.jpg",
  "/assets/cover2.jpg",
  "/assets/cover3.jpg",
  "/assets/cover4.jpg",
  "/assets/storeFront/storeCover1.png",
  "/assets/storeFront/storeCover2.png",
  "/assets/storeFront/storeCover3.png",
  "/assets/tradesAndServies/freshPaint.png",
  "/assets/tradesAndServies/servicePromo.png",
];

function AdvertisementBanner() {
  return (
    <div className="w-full md:w-[90%] mx-auto py-4 md:py-6 lg:py-8 ">
      <div className=" mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          speed={800}
          className="w-full rounded-xl overflow-hidden shadow-lg advertisement-swiper"
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[150px] sm:h-[280px] md:h-[350px] lg:h-[350px] overflow-hidden group cursor-pointer">
                <Image
                  src={image}
                  alt={`Advertisement ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="100vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom pagination styles */}
        <style jsx global>{`
          .advertisement-swiper .swiper-pagination {
            bottom: 12px !important;
          }

          .advertisement-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 9999px;
            margin: 0 4px !important;
            opacity: 0.7;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .advertisement-swiper .swiper-pagination-bullet-active {
            width: 24px;
            background-color: #b01501;
            opacity: 1;
          }

          @media (min-width: 768px) {
            .advertisement-swiper .swiper-pagination {
              bottom: 16px !important;
            }
            .advertisement-swiper .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
            }
            .advertisement-swiper .swiper-pagination-bullet-active {
              width: 32px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdvertisementBanner;
