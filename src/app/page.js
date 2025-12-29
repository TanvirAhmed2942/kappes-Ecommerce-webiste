"use client";
import Banner from "../components/Home/Banner/banner";
import PopularCategories from "../components/Home/Popular Categories/popularCategories";
import ProductRecomendation from "../components/Home/Recomendation/productRecomendation";
import TrendingProduct from "../components/Home/Trending Products/trendingProduct";
import AdvertisementBanner from "../components/Home/AdvertisementBanner/AdvertisementBanner";
import useAuth from "../hooks/useAuth";
import Image from "next/image";

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
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold text-gray-800">Maintenance</h1>
        <p className="text-lg text-gray-600">
          We are currently down for maintenance. Please check back later.
        </p>
      </div>
      {/* <Image
        src="/assets/home/maintenance.png"
        alt="Maintenance"
        width={1000}
        height={1000}
        className="w-full h-full object-contain scale-"
      /> */}
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
