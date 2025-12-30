"use client";
import Banner from "../components/Home/Banner/banner";
import PopularCategories from "../components/Home/Popular Categories/popularCategories";
import ProductRecomendation from "../components/Home/Recomendation/productRecomendation";
import TrendingProduct from "../components/Home/Trending Products/trendingProduct";
import AdvertisementBanner from "../components/Home/AdvertisementBanner/AdvertisementBanner";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";

function Home() {
  return (
    <div className="h-100vh w-100vw ">
      <Banner />
      <PopularCategories />
      <AdvertisementBanner />
      <ProductRecomendation />
      <TrendingProduct />
    </div>
  );
}

const Maintenance = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("February 21, 2026").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/Immigrate-to-Canada.webp')",
        backgroundBlendMode: "multiply",
        backgroundColor: "rgba(0, 0, 0, 0.3)",

        WebkitFilter: "grayscale(10%)",
        MozFilter: "grayscale(10%)",
        OFilter: "grayscale(10%)",
        MSFilter: "grayscale(10%)",
        filter: "grayscale(10%)",
      }}
    >
      {/* Black opacity overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 p-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white font-comfortaa">
          Maintenance
        </h1>
        <p className="text-xl md:text-2xl text-white">
          We are currently down for maintenance. Please check back later.
        </p>

        {/* Countdown Timer */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold text-white font-comfortaa">
              {timeLeft.days}
            </div>
            <div className="text-sm md:text-base text-white/80 mt-2">Days</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold text-white font-comfortaa">
              {timeLeft.hours}
            </div>
            <div className="text-sm md:text-base text-white/80 mt-2">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold text-white font-comfortaa">
              {timeLeft.minutes}
            </div>
            <div className="text-sm md:text-base text-white/80 mt-2">
              Minutes
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold text-white font-comfortaa">
              {timeLeft.seconds}
            </div>
            <div className="text-sm md:text-base text-white/80 mt-2">
              Seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Maintenance />;
  }

  return <Home />;
}
