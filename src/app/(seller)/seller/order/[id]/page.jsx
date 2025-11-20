"use client";

import { Button } from '../../../../../components/ui/button';
import { Card, CardContent } from '../../../../../components/ui/card';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const OrderDetails = () => {
  const [items, setItems] = useState([
    {
      id: '#123455',
      name: 'Tshirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      quantity: 1,
      price: '$50'
    },
    {
      id: '#123455',
      name: 'Tshirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      quantity: 1,
      price: '$50'
    },
    {
      id: '#123455',
      name: 'Tshirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      quantity: 1,
      price: '$50'
    }
  ]);

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="">
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-900">Order #123783</h1>

        {/* All Items Section */}
        <Card className="shadow-sm p-0">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Items</h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Product Id
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.price}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(index)}
                          className="border-red-400 h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>


        <div className='flex flex-col gap-5 w-6/12'>
          {/* Summary Section */}
          <Card className="shadow-sm p-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-24">Order ID</span>
                  <span className="text-sm text-gray-900 font-medium">#192847</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-24">Date</span>
                  <span className="text-sm text-gray-900">20 April 2025</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-24">Total</span>
                  <span className="text-sm text-red-600 font-semibold">$948.5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Section */}
          <Card className="shadow-sm p-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h2>
              <p className="text-sm text-gray-600">
                3517 W. Gray St. Utica, Pennsylvania 57867
              </p>
            </CardContent>
          </Card>

          {/* Payment Method Section */}
          <Card className="shadow-sm p-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
              <p className="text-sm text-gray-600">Bank of Canada</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;