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

  // Conditionally fetch products based on selected tab and location
  const { data: provinceData, isLoading: isLoadingProvince } =
    useGetProductByProvinceQuery(selectedLocation, {
      skip: selectedTab !== "province" || !selectedLocation,
    });

  const { data: territoryData, isLoading: isLoadingTerritory } =
    useGetProductByTerritoryQuery(selectedLocation, {
      skip: selectedTab !== "territory" || !selectedLocation,
    });

  const { data: cityData, isLoading: isLoadingCity } = useGetProductByCityQuery(
    selectedLocation,
    {
      skip: selectedTab !== "city" || !selectedLocation,
    }
  );

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

  const products = productsData?.data?.products || [];
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
