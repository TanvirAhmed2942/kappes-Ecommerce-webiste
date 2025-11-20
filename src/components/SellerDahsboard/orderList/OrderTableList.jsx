"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Eye, Filter, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const OrderTableList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const orders = [
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Pending' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Canceled' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
    { id: '#28VR5K59', date: '10 March, 2024', customer: 'Tom Hardy', amount: '$50', status: 'Delivered' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'default' ||
      order.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-500';
      case 'canceled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleView = (index) => {
    console.log('View order', index);
    router.push(`/seller/order/${index}`);
  };

  const handleEdit = (index) => {
    console.log('Edit order', index);
  };

  const handleDelete = (index) => {
    console.log('Delete order', index);
  };

  return (
    <div className="">
      <div className="">
        {/* Card Container */}
        <Card className="shadow-sm p-0">
          <CardContent className="p-6">
            {/* Top Bar */}
            <div className="flex pb-6 justify-between items-center border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Order List</h1>

              <div className="flex items-center gap-4">
                {/* Filter Dropdown */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Input */}
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Order Id
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(index)}
                            className="border-orange-400 h-10 w-10 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default OrderTableList;