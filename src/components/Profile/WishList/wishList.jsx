"use client";
import React, { useState, useEffect } from "react";
import WishListCard from "./wishListCard";
import { useGetFavProductsQuery } from "../../../redux/productApi/productApi";
import { Button } from "../../../components/ui/button";

function WishList({ selectedMenu }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch wishlist with pagination from API
  const {
    data: rawApiData,
    isLoading,
    error,
  } = useGetFavProductsQuery({
    page: currentPage,
    limit: 10,
  });

  // Extract products from wishlist items - response structure: data.result.items
  const products = React.useMemo(() => {
    if (!rawApiData?.success || !rawApiData?.data?.result?.items) {
      return [];
    }

    const items = rawApiData.data.result.items;
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .map((item) => {
        // Extract product from item.product
        const product = item?.product;
        if (
          product &&
          typeof product === "object" &&
          (product._id || product.id)
        ) {
          return product;
        }
        return null;
      })
      .filter(Boolean); // Remove null/undefined entries
  }, [rawApiData]);

  // Extract pagination meta from API response
  const paginationMeta = rawApiData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalPages = paginationMeta.totalPage || 1;

  // Early return if not the right menu (after all hooks)
  if (selectedMenu !== 3) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full p-4 z-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="w-full p-4 z-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading wishlist</p>
            <p className="text-gray-500 text-sm">
              {error?.message || "Please try again later"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 z-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        <p className="text-gray-600">
          {paginationMeta.total || products.length}{" "}
          {paginationMeta.total === 1 ? "item" : "items"} in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No favorite products yet
            </h3>
            <p className="text-gray-500">
              Start adding products to your wishlist by clicking the heart icon
              on any product.
            </p>
          </div>
        ) : (
          products.map((product, index) => {
            return (
              <WishListCard
                key={product._id || product.id || index}
                product={product}
              />
            );
          })
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && paginationMeta && totalPages > 1 && (
        <div className="flex flex-wrap justify-between items-center gap-2 mt-6">
          <div className="text-sm text-gray-600">
            Showing {products.length} of{" "}
            {paginationMeta.total || products.length} items
          </div>
          <div className="flex flex-wrap justify-end items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Prev
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                  className={
                    currentPage === pageNum
                      ? "bg-[#AF1500] text-white hover:bg-[#8c1100]"
                      : ""
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <Button
                  size="sm"
                  variant={currentPage === totalPages ? "default" : "outline"}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={isLoading}
                  className={
                    currentPage === totalPages
                      ? "bg-[#AF1500] text-white hover:bg-[#8c1100]"
                      : ""
                  }
                >
                  {totalPages}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishList;
