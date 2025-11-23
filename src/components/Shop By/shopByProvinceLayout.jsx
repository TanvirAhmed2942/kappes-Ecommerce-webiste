"use client"; // Ensure this is a Client Component

import React, { useState, useEffect } from "react";
import ProvinceList from "./Province/provinceList";

import ProvinceRelatedProducts from "./provinceRelatedProducts";
import Filter from "../Shop/filter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import CityList from "./City/city";
import TerritoryList from "./Territory/terriToryList";
import {
  useGetProductByProvinceQuery,
  useGetProductByTerritoryQuery,
  useGetProductByCityQuery,
} from "../../redux/productApi/productApi";

function ShopByProvinceLayout() {
  const [selectedTab, setSelectedTab] = useState("province");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  // Reset selected location when tab changes
  useEffect(() => {
    setSelectedLocation("");
  }, [selectedTab]);

  // Track the location for which we're currently displaying data
  const [dataLocation, setDataLocation] = useState("");

  // Reset data location when location changes
  useEffect(() => {
    if (selectedLocation !== dataLocation) {
      setDataLocation(""); // Clear data location when selection changes
    }
  }, [selectedLocation, dataLocation]);

  // Conditionally fetch products based on selected tab and location
  const {
    data: provinceData,
    isLoading: isLoadingProvince,
    isFetching: isFetchingProvince,
    error: provinceError,
  } = useGetProductByProvinceQuery(selectedLocation, {
    skip: selectedTab !== "province" || !selectedLocation,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: territoryData,
    isLoading: isLoadingTerritory,
    isFetching: isFetchingTerritory,
    error: territoryError,
  } = useGetProductByTerritoryQuery(selectedLocation, {
    skip: selectedTab !== "territory" || !selectedLocation,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: cityData,
    isLoading: isLoadingCity,
    isFetching: isFetchingCity,
    error: cityError,
  } = useGetProductByCityQuery(selectedLocation, {
    skip: selectedTab !== "city" || !selectedLocation,
    refetchOnMountOrArgChange: true,
  });

  // Get the appropriate products data based on selected tab
  const productsData =
    selectedTab === "province"
      ? provinceData
      : selectedTab === "territory"
      ? territoryData
      : cityData;

  const isLoading =
    selectedTab === "province"
      ? isLoadingProvince
      : selectedTab === "territory"
      ? isLoadingTerritory
      : isLoadingCity;

  const isFetching =
    selectedTab === "province"
      ? isFetchingProvince
      : selectedTab === "territory"
      ? isFetchingTerritory
      : isFetchingCity;

  const error =
    selectedTab === "province"
      ? provinceError
      : selectedTab === "territory"
      ? territoryError
      : cityError;

  // Update data location when fetch completes (success or error)
  useEffect(() => {
    if (
      selectedLocation &&
      !isFetching &&
      !isLoading &&
      dataLocation !== selectedLocation
    ) {
      // Fetch completed for current location - update data location
      // This happens whether we got data or an error
      setDataLocation(selectedLocation);
    }
  }, [selectedLocation, isFetching, isLoading, dataLocation]);

  // Get products - only show if:
  // 1. We have a location selected
  // 2. Fetch is complete (not fetching/loading)
  // 3. Data location matches selected location (data is for current location)
  // 4. No error occurred
  // 5. We have valid products data
  const products = (() => {
    // If no location selected, return empty
    if (!selectedLocation) {
      return [];
    }

    // If still fetching/loading, return empty
    if (isFetching || isLoading) {
      return [];
    }

    // If data location doesn't match selected location, return empty
    // This ensures we don't show stale data from previous location
    if (dataLocation !== selectedLocation) {
      return [];
    }

    // If there's an error, return empty (no products found)
    if (error) {
      return [];
    }

    // If we have valid products data, return it
    if (
      productsData?.data?.products &&
      Array.isArray(productsData.data.products)
    ) {
      return productsData.data.products;
    }

    // No valid data, return empty
    return [];
  })();
  return (
    <div className="px-4 lg:px-32">
      <div className="w-2/3  mx-auto mt-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 w-full bg-red-700">
            <TabsTrigger
              value="province"
              className="data-[state=active]:text-black data-[state=inactive]:text-white"
            >
              Province
            </TabsTrigger>
            <TabsTrigger
              value="territory"
              className="data-[state=active]:text-black data-[state=inactive]:text-white"
            >
              Territory
            </TabsTrigger>
            <TabsTrigger
              value="city"
              className="data-[state=active]:text-black data-[state=inactive]:text-white"
            >
              City
            </TabsTrigger>
          </TabsList>

          <TabsContent value="province">
            <ProvinceList onSelect={setSelectedLocation} />
          </TabsContent>
          <TabsContent value="territory">
            <TerritoryList onSelect={setSelectedLocation} />
          </TabsContent>
          <TabsContent value="city">
            <CityList onSelect={setSelectedLocation} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex gap-5 py-5 px-5 md:px-24 w-full">
        <Filter />
        <ProvinceRelatedProducts
          key={`${selectedTab}-${selectedLocation}`}
          products={products}
          isLoading={isLoading}
          selectedLocation={selectedLocation}
          selectedTab={selectedTab}
          habdleFilterVisbile={() => setFilterVisible(!filterVisible)}
          filterVisible={filterVisible}
        />
      </div>
    </div>
  );
}

export default ShopByProvinceLayout;
