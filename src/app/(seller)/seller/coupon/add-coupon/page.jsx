"use client";

import { Button } from '../../../../../components/ui/button'; 
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { useState } from 'react';

export default function AddCouponForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: '',
    discountAmount: '',
    useLimit: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePublish = () => {
    // Validate required fields
    const requiredFields = ['title', 'description', 'code', 'discountAmount', 'useLimit', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Publishing coupon:', formData);
    alert('Coupon published successfully!');
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: '',
      discountAmount: '',
      useLimit: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="">
      <div className="">
        <h1 className="text-3xl font-semibold mb-8">Add Coupon</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Coupon Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                Coupon Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter coupon Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Coupon Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                Coupon Description<span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                placeholder="Enter coupon Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-base">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Enter coupon code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Discount Type */}
            <div className="space-y-2 w-full">
              <Label htmlFor="discountType" className="text-base">
                Discount Type
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => handleInputChange('discountType', value)}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Amount */}
            <div className="space-y-2">
              <Label htmlFor="discountAmount" className="text-base">
                Discount Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountAmount"
                placeholder="Enter discount amount"
                type="number"
                value={formData.discountAmount}
                onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Use limit Per Customer */}
            <div className="space-y-2">
              <Label htmlFor="useLimit" className="text-base">
                Use limit Per Customer<span className="text-red-500">*</span>
              </Label>
              <Input
                id="useLimit"
                placeholder="Enter use limit"
                type="number"
                value={formData.useLimit}
                onChange={(e) => handleInputChange('useLimit', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-base">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                placeholder="mm/dd/yyyy"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="h-12"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-base">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                placeholder="mm/dd/yyyy"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-8 h-12 text-base border-red-500 text-red-500 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              className="px-8 h-12 text-base bg-red-600 hover:bg-red-700"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}