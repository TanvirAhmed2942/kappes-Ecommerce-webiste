"use client";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  useGetAllSubCategoryQuery,
  useDeleteSubcategoryMutation,
} from "../../../redux/sellerApi/subCategory/subCategoryApi";
import useToast from "../../../hooks/useShowToast";
import { getImageUrl } from "../../../redux/baseUrl";
import SubCategoryViewModal from "./ViewSubCategoryModal";

const SubCategoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch subcategories with pagination and search from API
  const {
    data: subCategoriesData,
    isLoading,
    error,
    refetch,
  } = useGetAllSubCategoryQuery({
    page: currentPage,
    limit: 10,
    searchTerm: searchTerm,
  });

  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubcategoryMutation();

  // Extract subcategories from API response
  // Response structure: { success: true, data: { subCategorys: [...], meta: {...} } }
  const subCategories = Array.isArray(subCategoriesData?.data?.subCategorys)
    ? subCategoriesData.data.subCategorys
    : [];

  // Extract pagination meta from API response
  const paginationMeta = subCategoriesData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalPages = paginationMeta.totalPage || 1;

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "/placeholder-image.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${getImageUrl}${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  };

  const handleView = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsViewModalOpen(true);
  };

  const handleEdit = (subCategory) => {
    router.push(
      `/seller/subcategory/add-subcategory?id=${encodeURIComponent(
        subCategory._id
      )}`
    );
  };

  const handleDelete = async (subCategory) => {
    if (
      !confirm(
        `Are you sure you want to delete subcategory "${subCategory.name}"?`
      )
    ) {
      return;
    }

    try {
      const response = await deleteSubCategory(subCategory._id).unwrap();
      if (response?.success) {
        toast.showSuccess("Subcategory deleted successfully!");
        refetch();
      } else {
        toast.showError(response?.message || "Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Delete subcategory error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to delete subcategory. Please try again.";
      toast.showError(errorMessage);
    }
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Subcategory List
        </h1>

        {/* Card Container */}
        <Card className="shadow-sm p-0">
          <CardContent className="p-5">
            {/* Top Bar */}
            <div className="flex pb-4 justify-between items-center border-b border-gray-200">
              <Button
                onClick={() =>
                  router.push("/seller/subcategory/add-subcategory")
                }
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Subcategory
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-8">Loading subcategories...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  Error loading subcategories:{" "}
                  {error?.data?.message || error?.message || "Unknown error"}
                  <div className="text-xs mt-2 text-gray-500">
                    Please check your connection and try again.
                  </div>
                </div>
              ) : !Array.isArray(subCategories) ? (
                <div className="text-center py-8 text-red-600">
                  Invalid data format received from server.
                  <div className="text-xs mt-2 text-gray-500">
                    Expected array but got: {typeof subCategories}
                  </div>
                </div>
              ) : subCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "No subcategories found matching your search"
                    : "No subcategories found. Click 'Add Subcategory' to create one."}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-200 hover:bg-gray-200">
                      <TableHead className="font-semibold text-gray-900">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Image
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(subCategories) &&
                      subCategories.map((subCategory) => (
                        <TableRow key={subCategory?._id || Math.random()}>
                          <TableCell className="text-gray-900 font-medium">
                            {subCategory?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="w-16 h-16 rounded-md overflow-hidden">
                              <img
                                src={getImageSrc(subCategory?.thumbnail)}
                                alt={subCategory?.name || "Subcategory"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900 max-w-xs">
                            <p className="truncate">
                              {subCategory?.description || "N/A"}
                            </p>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            {subCategory?.categoryId?.name || "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-900">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subCategory?.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {subCategory?.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleView(subCategory)}
                                className="border-orange-400 text-orange-500 h-10 w-10 hover:bg-orange-50 hover:text-orange-600"
                                disabled={isDeleting}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(subCategory)}
                                className="border-green-400 text-green-500 h-10 w-10 hover:bg-green-50 hover:text-green-600"
                                disabled={isDeleting}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(subCategory)}
                                className="border-red-400 text-red-500 h-10 w-10 hover:bg-red-50 hover:text-red-600"
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination */}
            {subCategories.length > 0 && paginationMeta.total > 0 && (
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {subCategories.length} of {paginationMeta.total}{" "}
                  subcategories
                  {searchTerm && ` (filtered by "${searchTerm}")`}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
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
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                        className={
                          currentPage === pageNum
                            ? "bg-red-700 hover:bg-red-800"
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
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={isLoading}
                        className={
                          currentPage === totalPages
                            ? "bg-red-700 hover:bg-red-800"
                            : ""
                        }
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
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
          </CardContent>
        </Card>
      </div>

      {/* View Modal */}
      <SubCategoryViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        subCategory={selectedSubCategory}
      />
    </div>
  );
};

export default SubCategoryList;
