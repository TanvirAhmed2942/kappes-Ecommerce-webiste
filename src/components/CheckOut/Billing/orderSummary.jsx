"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrderMutation } from "@/redux/cartApi/cartApi";
import useToast from "@/hooks/useShowToast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function OrderSummary({
  deliveryOption,
  paymentMethod,
  shippingAddress,
}) {
  const router = useRouter();
  const toast = useToast();
  const { cartItems, totalAmount, formatCurrency, apiResponse, refetch } =
    useCart();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [promoCode, setPromoCode] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  // Calculate totals from cart
  const itemCost =
    totalAmount ||
    cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  const shippingFee = itemCost > 0 ? 29.0 : 0.0; // free shipping if no items
  const discount = promoCode ? 0.0 : 0.0; // Will be calculated by backend if coupon is valid
  const total = itemCost + shippingFee - discount;

  const handlePlaceOrder = async () => {
    if (!deliveryOption) {
      toast.showError("Please select a delivery option");
      return;
    }

    if (!paymentMethod) {
      toast.showError("Please select a payment method");
      return;
    }

    if (!shippingAddress) {
      toast.showError("Please provide a shipping address");
      return;
    }

    if (cartItems.length === 0) {
      toast.showError("Your cart is empty");
      return;
    }

    // Group items by shopId (in case there are items from multiple shops)
    const itemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shopId;
      if (!shopId) {
        console.error("Item missing shopId:", item);
        return;
      }
      if (!itemsByShop[shopId]) {
        itemsByShop[shopId] = [];
      }
      itemsByShop[shopId].push(item);
    });

    // Create orders for each shop
    const orderPromises = Object.entries(itemsByShop).map(
      async ([shopId, items]) => {
        // Transform items to API format
        const products = items.map((item) => ({
          product: item.productId || item.id,
          variant: item.variantId,
          quantity: item.quantity,
        }));

        const orderData = {
          shop: shopId,
          products: products,
          deliveryOptions: deliveryOption,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
        };

        // Add coupon if provided
        if (promoCode) {
          orderData.coupon = promoCode;
        }

        return placeOrder(orderData).unwrap();
      }
    );

    try {
      const responses = await Promise.all(orderPromises);
      console.log("Orders placed successfully:", responses);

      // Show success message
      toast.showSuccess("Order placed successfully!");

      // Refetch cart to clear it
      refetch();

      // Redirect to success page
      router.push("/check-out/billing-procedure/order-place-success");
    } catch (error) {
      console.error("Failed to place order:", error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.error?.[0]?.message ||
        "Failed to place order. Please try again.";
      toast.showError(errorMessage);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-red-700 font-bold">
          Your Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Promo Code Section */}
        <div className="flex space-x-2">
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-grow"
          />
          <Button variant="destructive" className="bg-red-700 hover:bg-red-800">
            Apply
          </Button>
        </div>

        {/* Cost Breakdown */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Item Cost</span>
                <span>{formatCurrency(itemCost)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="border-t pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span className="text-red-700 font-bold">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Agreement */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked === true)}
          />
          <label htmlFor="terms" className="text-sm">
            I have read and agree to the website{" "}
            <Link
              href="/terms-&-condition"
              className="text-blue-800 font-medium"
            >
              terms and conditions
            </Link>
            <span className="text-red-600">*</span>
          </label>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-red-700 hover:bg-red-800"
          size="lg"
          disabled={
            !isAgreed ||
            cartItems.length === 0 ||
            isPlacingOrder ||
            !deliveryOption ||
            !paymentMethod ||
            !shippingAddress
          }
          onClick={handlePlaceOrder}
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>
      </CardFooter>
    </Card>
  );
}
