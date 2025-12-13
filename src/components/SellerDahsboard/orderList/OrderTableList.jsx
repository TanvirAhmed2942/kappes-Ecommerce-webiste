"use client";

import { Eye, Filter, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  useDeleteOrderMutation,
  useGetAllOrderQuery,
} from "../../../redux/sellerApi/orderlist/orderListApi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

const OrderTableList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const router = useRouter();
  const shopId =
    typeof window !== "undefined" ? localStorage.getItem("shop") : null;

  // Reset to page 1 when search term or filter status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Fetch orders with pagination, search, and status filter from API
  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrderQuery(
    {
      shopId,
      page: currentPage,
      limit: 10,
      searchTerm: searchTerm,
      status: filterStatus !== "default" ? filterStatus : "",
    },
    { skip: !shopId }
  );

  const [deleteOrder, { isLoading: deleteOrderLoading }] =
    useDeleteOrderMutation();

  // Format orders from API response
  const formatOrders = (orders) => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders.map((order) => ({
      id: order._id,
      shortId: `#${order._id.slice(-8).toUpperCase()}`,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      customer: order.user?.full_name || "Unknown Customer",
      amount: `$${order.finalAmount?.toFixed(2) || "0.00"}`,
      status: order.status,
      rawData: order, // Keep original data for reference
    }));
  };

  // Get orders from API response
  const orders = useMemo(() => {
    return orderData?.data?.orders ? formatOrders(orderData.data.orders) : [];
  }, [orderData]);

  // Extract pagination meta from API response
  const paginationMeta = orderData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalPages = paginationMeta.totalPage || 1;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "pending":
        return "text-orange-500";
      case "cancelled":
        return "text-red-600";
      case "processing":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const handleView = (orderId) => {
    console.log("View order", orderId);
    router.push(`/seller/order/${orderId}`);
  };

  const handleEdit = (orderId) => {
    console.log("Edit order", orderId);
    // Implement edit functionality
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      const response = await deleteOrder(orderToDelete.id).unwrap();
      console.log(response);
      alert(response.message);
      console.log("Order deleted successfully:", orderToDelete.id);
      // Refetch orders after deletion
      refetch();
    } catch (error) {
      console.error("Failed to delete order:", error.data);
      // You can add toast notification here if needed
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error loading orders</div>
      </div>
    );
  }

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
                    <SelectItem value="default">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by order ID, customer, or date..."
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
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {order.shortId}
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
                          <span
                            className={`text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(order.id)}
                              className="border-orange-400 h-10 w-10 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(order.id)}
                              className="border-green-400 text-green-500 h-10 w-10 hover:bg-green-50 hover:text-green-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button> */}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(order)}
                              disabled={deleteOrderLoading}
                              className="border-red-400 text-red-500 h-10 w-10 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {searchTerm || filterStatus !== "default"
                          ? "No orders match your search criteria"
                          : "No orders found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {orders.length > 0 && paginationMeta.total > 0 && (
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {orders.length} of {paginationMeta.total} orders
                  {searchTerm && ` (filtered by "${searchTerm}")`}
                  {filterStatus !== "default" && ` (status: ${filterStatus})`}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order <strong>{orderToDelete?.shortId}</strong> for customer{" "}
              <strong>{orderToDelete?.customer}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteOrderLoading}
            >
              {deleteOrderLoading ? "Deleting..." : "Delete Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderTableList;
