"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Upload, X } from 'lucide-react';
import { useState } from 'react';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [stock, setStock] = useState(1);
  const [regularPrice, setRegularPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [tags, setTags] = useState(['Bag', 'Outdoor']);
  const [tagInput, setTagInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6'); // Default blue selected
  const [featureImage, setFeatureImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Red', value: '#ef4444' },
  ];

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleFeatureImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeatureImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setAdditionalImages([...additionalImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (indexToRemove) => {
    setAdditionalImages(additionalImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', {
      productName,
      description,
      category,
      size,
      stock,
      regularPrice,
      discountPrice,
      tags,
      selectedColor,
      featureImage,
      additionalImages
    });
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>

        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <Label htmlFor="productName" className="text-base font-medium">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-2"
                  />

                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Description
                  </Label>

                  <Textarea
                    id="description"
                    placeholder="Write product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-[120px] resize-none"
                  />
                  
                </div>

                {/* Product Category */}
                <div className='w-full'>
                  <Label htmlFor="category" className="text-base font-medium">
                    Product category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size */}
                <div className='w-full'>
                  <Label htmlFor="size" className="text-base font-medium">
                    Size
                  </Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tag */}
                <div>
                  <Label className="text-base font-medium">Tag</Label>
                  <div className="mt-2 min-h-[50px] flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm h-fit"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-gray-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      onBlur={addTag}
                      className="flex-1 min-w-[120px] bg-transparent border-0 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <Label className="text-base font-medium">Color</Label>
                  <div className="mt-2 flex gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-10 h-10 rounded-full transition-all ${selectedColor === color.value
                          ? 'ring-2 ring-offset-2 ring-gray-400'
                          : ''
                          }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Feature Image */}
                <div>
                  <Label className="text-base font-medium">
                    Feature Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    {featureImage ? (
                      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={featureImage}
                          alt="Feature"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={() => setFeatureImage(null)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFeatureImageUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3">
                            <Upload className="w-6 h-6 text-gray-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Drop your image here or
                          </p>
                          <span className="text-sm text-red-600 font-medium hover:text-red-700">
                            Click to upload
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <Label className="text-base font-medium">Additional Images</Label>
                  <div className="mt-2">
                    {additionalImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {additionalImages.map((img, index) => (
                          <div key={index} className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                            <img
                              src={img}
                              alt={`Additional ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            <button
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Drop your images here or
                        </p>
                        <span className="text-sm text-red-600 font-medium hover:text-red-700">
                          Click to upload
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <Label htmlFor="stock" className="text-base font-medium">
                    Stock<span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 w-full flex items-stretch border border-gray-300 rounded-lg overflow-hidden ">
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value) || 1)}
                      className="flex-1 text-center py-2 border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex flex-col border-l border-gray-300">
                      <button
                        onClick={() => setStock(stock + 1)}
                        className="px-2 py-1 hover:bg-gray-100 border-b border-gray-300"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setStock(Math.max(1, stock - 1))}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Regular Price */}
                <div>
                  <Label htmlFor="regularPrice" className="text-base font-medium">
                    Regular Price<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="regularPrice"
                    type="number"
                    placeholder="$0.00"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <Label htmlFor="discountPrice" className="text-base font-medium">
                    Discount Price<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    placeholder="$0.00"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-8 text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-8 bg-red-700 hover:bg-red-800 text-white"
              >
                Publish Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProductForm;