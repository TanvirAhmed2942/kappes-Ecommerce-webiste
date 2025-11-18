"use client";
import SearchBox from "@/common/components/searchBox";
import Image from "next/image";
import React, { useMemo } from "react";
import { useGetBusinessListQuery } from "@/redux/servicesApi/servicsApi";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function Cover() {
  const router = useRouter();
  const { data: businessList, isLoading, error } = useGetBusinessListQuery();

  // Transform businesses from API to SearchBox format
  const searchServices = useMemo(() => {
    if (!businessList?.success || !businessList?.data?.businesses) {
      return [];
    }
    return businessList.data.businesses.map((business) => ({
      id: business._id,
      serviceName: business.name || business.service || "Business",
    }));
  }, [businessList]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    // Find matching business
    const found = searchServices.find(
      (service) =>
        service.serviceName.toLowerCase() === searchTerm.toLowerCase()
    );

    if (found) {
      // Navigate to the business page
      router.push(`/trades-&-services/services/${found.id}`);
    } else {
      // If exact match not found, search for partial matches
      const partialMatch = searchServices.find((service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (partialMatch) {
        router.push(`/trades-&-services/services/${partialMatch.id}`);
      } else {
        console.log("No business found matching:", searchTerm);
      }
    }
  };
  return (
    <div>
      <div className="relative">
        <Image
          src="/assets/tradesAndServies/tradesAndServices.png"
          width={1000}
          height={1000}
          alt="trades and service"
          className="w-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
          <h2 className="text-3xl font-comfortaa md:text-4xl font-semibold text-white mb-4">
            <span>Find Trusted</span> <br />
            <span>Trades & Services near you</span>
          </h2>
          <div className="max-w-5xl mx-auto">
            <SearchBox
              placeholder="Search Trades & Services"
              searchServices={searchServices}
              onSearch={handleSearch}
            />
            <Button
              className="bg-kappes hover:bg-red-700 px-4 sm:px-5 lg:px-6 text-white rounded-r-md flex items-center justify-center mx-auto mt-4"
              onClick={() => router.push("/trades-&-services/all-services")}
            >
              See All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cover;
