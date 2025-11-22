"use client";

import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const products = Array(10).fill({
    name: 'Hiking Traveler Backpack',
    id: '#7712309',
    category: 'Outdoor',
    price: '$50',
    sold: '20',
    publishDate: '22 Dec 2024'
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (index) => {
    console.log('View product', index);
  };

  const handleEdit = (index) => {
    console.log('Edit product', index);
  };

  const handleDelete = (index) => {
    console.log('Delete product', index);
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Product List</h1>

        {/* Card Container */}
        <Card className="shadow-sm p-0">
          <CardContent className="p-5">
            {/* Top Bar */}
            <div className=" flex pb-4 justify-between items-center border-b border-gray-200">
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

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200 hover:bg-gray-200">
                    <TableHead className="font-semibold text-gray-900">
                      Product Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Product Id
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Price
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Sold
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Publish Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-900">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {product.id}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {product.price}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {product.sold}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {product.publishDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(index)}
                            className="border-orange-400 text-orange-500 h-10 w-10 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(index)}
                            className="border-green-400 text-green-500 h-10 w-10 hover:bg-green-50 hover:text-green-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(index)}
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
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-gray-200 flex justify-end items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(1)}
                className={currentPage === 1 ? "bg-red-700 hover:bg-red-800" : ""}
              >
                1
              </Button>
              <Button
                variant={currentPage === 2 ? "default" : "outline"}
                onClick={() => setCurrentPage(2)}
                className={currentPage === 2 ? "bg-red-700 hover:bg-red-800" : ""}
              >
                2
              </Button>
              <Button
                variant={currentPage === 3 ? "default" : "outline"}
                onClick={() => setCurrentPage(3)}
                className={currentPage === 3 ? "bg-red-700 hover:bg-red-800" : ""}
              >
                3
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                disabled={currentPage === 3}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductList;