"use client";

import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { getImageUrl } from '../../../redux/baseUrl';
import { useDeleteProductMutation, useGetAllProductQuery } from '../../../redux/sellerApi/product/productApi';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const router = useRouter();

  const { data, isLoading } = useGetAllProductQuery(searchTerm);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.data?.result || [];
  const meta = data?.data?.meta || { total: 0, page: 1, totalPage: 1 };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (productId) => {
    router.push('/seller/product/edit-product/' + productId);
  };

  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(productIdToDelete).unwrap();
      setShowDeleteModal(false);
      setProductIdToDelete(null);
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Failed to delete product: ' + (error?.data?.message || 'Unknown error'));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Product List</h1>

        <Card className="shadow-sm p-0">
          <CardContent className="p-5">
            <div className="flex pb-4 justify-between items-center border-b border-gray-200">
              <Button onClick={() => router.push('/seller/product/add-product')} className="bg-red-700 hover:bg-red-800 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
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

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">No products found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-200 hover:bg-gray-200">
                      <TableHead className="font-semibold text-gray-900">Product Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Product Id</TableHead>
                      <TableHead className="font-semibold text-gray-900">Category</TableHead>
                      <TableHead className="font-semibold text-gray-900">Price</TableHead>
                      <TableHead className="font-semibold text-gray-900">Stock</TableHead>
                      <TableHead className="font-semibold text-gray-900">Publish Date</TableHead>
                      <TableHead className="font-semibold text-gray-900">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="text-gray-900">{product.name}</TableCell>
                        <TableCell className="text-gray-900">#{product._id.slice(-8)}</TableCell>
                        <TableCell className="text-gray-900">{product.categoryId?.name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-900">${product.basePrice}</TableCell>
                        <TableCell className="text-gray-900">{product.totalStock}</TableCell>
                        <TableCell className="text-gray-900">{formatDate(product.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(product)}
                              className="border-orange-400 text-orange-500 h-10 w-10 hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(product._id)}
                              className="border-green-400 text-green-500 h-10 w-10 hover:bg-green-50 hover:text-green-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(product._id)}
                              className="border-red-400 text-red-500 h-10 w-10 hover:bg-red-50 hover:text-red-600"
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

            <div className="p-6 border-t border-gray-200 flex justify-end items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              {[...Array(meta.totalPage)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "bg-red-700 hover:bg-red-800" : ""}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(meta.totalPage, currentPage + 1))}
                disabled={currentPage === meta.totalPage}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Product Details</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl + img}
                      alt={`Product ${idx}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Name</h3>
                  <p>{selectedProduct.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-sm">{selectedProduct.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Category</h3>
                  <p>{selectedProduct.categoryId?.name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Brand</h3>
                  <p>{selectedProduct.brandId?.name || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Price</h3>
                    <p>${selectedProduct.basePrice}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Stock</h3>
                    <p>{selectedProduct.totalStock}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProduct.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-200 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedProduct && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Variants</h3>
              <div className="space-y-2">
                {selectedProduct.product_variant_Details?.map((variant, idx) => (
                  <div key={idx} className="border p-3 rounded">
                    <p><span className="font-semibold">Color:</span> {variant.variantId?.color?.name}</p>
                    <p><span className="font-semibold">Storage:</span> {variant.variantId?.storage}</p>
                    <p><span className="font-semibold">RAM:</span> {variant.variantId?.ram}</p>
                    <p><span className="font-semibold">Price:</span> ${variant.variantPrice}</p>
                    <p><span className="font-semibold">Quantity:</span> {variant.variantQuantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;