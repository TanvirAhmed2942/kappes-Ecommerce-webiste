"use client";


import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Upload } from 'lucide-react';
import { useState } from 'react';

export default function EditStoreOwnerForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleInputChange('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const requiredFields = ['name', 'phone', 'email', 'image'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    console.log('Updating store owner info:', formData);
    alert('Store owner info updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      image: null
    });
    setImagePreview(null);
  };

  return (
    <div className="">
      <div className="w-6/12">
        <h1 className="text-3xl font-semibold mb-8">Edit Store Owner Info</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Your Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-14"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-14"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-14"
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-base">
                Image<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="image"
                  className="flex items-center justify-center h-14 px-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-gray-500">
                    {imagePreview ? 'Change owner image' : 'Upload owner image'}
                  </span>
                </label>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Owner preview"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-12 h-12 text-base border-red-500 text-red-500 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="px-12 h-12 text-base bg-red-600 hover:bg-red-700"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}