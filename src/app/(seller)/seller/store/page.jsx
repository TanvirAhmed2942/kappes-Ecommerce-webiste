"use client";


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useState } from 'react';

export default function EditStoreInfoForm() {
  const [formData, setFormData] = useState({
    storeName: '',
    territory: '',
    shortDescription: '',
    province: '',
    logo: null,
    city: '',
    coverPhoto: null,
    detailAddress: ''
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      handleInputChange(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logo') {
          setLogoPreview(reader.result);
        } else if (field === 'coverPhoto') {
          setCoverPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const requiredFields = ['storeName', 'territory', 'shortDescription', 'province', 'logo', 'city', 'coverPhoto', 'detailAddress'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Updating store info:', formData);
    alert('Store info updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      storeName: '',
      territory: '',
      shortDescription: '',
      province: '',
      logo: null,
      city: '',
      coverPhoto: null,
      detailAddress: ''
    });
    setLogoPreview(null);
    setCoverPreview(null);
  };

  return (
    <div className="">
      <div className="">
        <h1 className="text-3xl font-semibold mb-8">Edit Store Info</h1>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-base">
                Store Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="storeName"
                placeholder="Enter your store name"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                className="h-14"
              />
            </div>

            {/* Territory */}
            <div className="space-y-2 w-full">
              <Label htmlFor="territory" className="text-base">
                Territory<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.territory}
                onValueChange={(value) => handleInputChange('territory', value)}
              >
                <SelectTrigger className="h-14 w-full">
                  <SelectValue placeholder="Choose territory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-base">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="shortDescription"
                placeholder="Describe about your company"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="min-h-14 resize-none"
              />
            </div>

            {/* Province */}
            <div className="space-y-2 w-full">
              <Label htmlFor="province" className="text-base">
                Province<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.province}
                onValueChange={(value) => handleInputChange('province', value)}
              >
                <SelectTrigger className="h-14 w-full">
                  <SelectValue placeholder="Choose Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="province1">Province 1</SelectItem>
                  <SelectItem value="province2">Province 2</SelectItem>
                  <SelectItem value="province3">Province 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label htmlFor="logo" className="text-base">
                Logo <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="logo"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('logo', e)}
                />
                <label
                  htmlFor="logo"
                  className="flex items-center justify-center h-14 px-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-gray-500">
                    {logoPreview ? 'Change image' : 'Upload image'}
                  </span>
                </label>
                {logoPreview && (
                  <div className="mt-2">
                    <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-cover rounded" />
                  </div>
                )}
              </div>
            </div>

            {/* City */}
            <div className="space-y-2 w-full">
              <Label htmlFor="city" className="text-base">
                City<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleInputChange('city', value)}
              >
                <SelectTrigger className="h-14 w-full">
                  <SelectValue placeholder="Choose Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city1">City 1</SelectItem>
                  <SelectItem value="city2">City 2</SelectItem>
                  <SelectItem value="city3">City 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cover Photo */}
            <div className="space-y-2">
              <Label htmlFor="coverPhoto" className="text-base">
                Cover Photo <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="coverPhoto"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('coverPhoto', e)}
                />
                <label
                  htmlFor="coverPhoto"
                  className="flex items-center justify-center h-14 px-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-gray-500">
                    {coverPreview ? 'Change image' : 'Upload image'}
                  </span>
                </label>
                {coverPreview && (
                  <div className="mt-2">
                    <img src={coverPreview} alt="Cover preview" className="h-20 w-auto object-cover rounded" />
                  </div>
                )}
              </div>
            </div>

            {/* Detail Address */}
            <div className="space-y-2">
              <Label htmlFor="detailAddress" className="text-base">
                Detail Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="detailAddress"
                placeholder="Enter details address"
                value={formData.detailAddress}
                onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                className="h-14"
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
              onClick={handleUpdate}
              className="px-8 h-12 text-base bg-red-600 hover:bg-red-700"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}