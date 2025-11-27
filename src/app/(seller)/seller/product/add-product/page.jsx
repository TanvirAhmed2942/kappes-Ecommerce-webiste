"use client";

import { Minus, Plus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";

import { IoArrowBack } from "react-icons/io5";
import { useGetAllBrandQuery } from "../../../../../redux/sellerApi/brand/brandApi";
import { useGetAllCategoryQuery } from "../../../../../redux/sellerApi/category/categoryApi";
import { useCreateProductMutation } from "../../../../../redux/sellerApi/product/productApi";
import { useGetSubCategoryReletedToCategoryQuery } from "../../../../../redux/sellerApi/subCategory/subCategoryApi";
import { useGetAllVariantQuery } from "../../../../../redux/sellerApi/variant/variantApi";

const AddProductForm = () => {
  const router = useRouter();

  // Basic Info States
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Category & Brand States
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [shopId, setShopId] = useState(localStorage.getItem("shop"));

  // Variant States
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [colorName, setColorName] = useState("Blue");
  const [volume, setVolume] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [variantQuantity, setVariantQuantity] = useState(1);

  // Image States
  const [featureImage, setFeatureImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Filtered subcategories based on selected category
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // API Hooks
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoryData } = useGetAllCategoryQuery();

  // Pass categoryId to the subcategory query
  const { data: subcategoryData, isLoading: subcategoryLoading } =
    useGetSubCategoryReletedToCategoryQuery(categoryId, {
      skip: !categoryId, // Skip the query if no category is selected
    });

  const { data: variantData } = useGetAllVariantQuery();
  const { data: brandData } = useGetAllBrandQuery();

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Yellow", value: "#eab308" },
    { name: "Red", value: "#ef4444" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Gray", value: "#6b7280" },
    { name: "Black", value: "#000000" },
  ];

  // Filter subcategories when category changes
  useEffect(() => {
    console.log("Category ID:", categoryId);
    console.log("Subcategory Data:", subcategoryData);

    if (categoryId && subcategoryData?.data) {
      // Since the API already returns subcategories related to the category,
      // we might not need additional filtering
      // But let's double check the structure
      const subcategories = Array.isArray(subcategoryData.data)
        ? subcategoryData.data
        : subcategoryData.data.subCategorys || subcategoryData.data || [];

      console.log("All subcategories:", subcategories);

      // If the API doesn't filter by category, we need to do it manually
      const filtered = subcategories.filter(
        (sub) => sub.categoryId && sub.categoryId._id === categoryId
      );

      console.log("Filtered subcategories:", filtered);

      setFilteredSubcategories(filtered);
      setSubcategoryId(""); // Reset subcategory when category changes
    } else {
      setFilteredSubcategories([]);
      setSubcategoryId("");
    }
  }, [categoryId, subcategoryData]);

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFeatureImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeatureImage(file);
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages([...additionalImages, ...files]);
  };

  const removeAdditionalImage = (indexToRemove) => {
    setAdditionalImages(
      additionalImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color.value);
    setColorName(color.name);
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !productName ||
      !description ||
      !basePrice ||
      !categoryId ||
      !subcategoryId ||
      !brandId
    ) {
      alert(
        "Please fill all required fields: Product Name, Description, Base Price, Category, Subcategory, and Brand"
      );
      return;
    }

    if (description.length < 10) {
      alert("Description must be at least 10 characters long");
      return;
    }

    if (!featureImage) {
      alert("Please upload a feature image");
      return;
    }

    try {
      const formData = new FormData();

      // Create the product data object matching API structure
      const productData = {
        name: productName,
        description: description,
        basePrice: parseFloat(basePrice),
        tags: tags,
        categoryId: categoryId,
        subcategoryId: subcategoryId,
        shopId: shopId,
        brandId: brandId,
        product_variant_Details: [
          {
            color: {
              name: colorName,
              code: selectedColor,
            },
            ...(volume && { volume: parseFloat(volume) }),
            variantPrice: parseFloat(variantPrice || basePrice),
            variantQuantity: parseInt(variantQuantity),
          },
        ],
      };

      formData.append("data", JSON.stringify(productData));

      // Add feature image
      if (featureImage) {
        formData.append("image", featureImage);
      }

      // Add additional images
      additionalImages.forEach((img) => {
        formData.append("image", img);
      });

      const response = await createProduct(formData).unwrap();
      alert("Product created successfully!");
      router.push("/seller/product");
    } catch (error) {
      alert(
        "Failed to create product: " + (error?.data?.message || "Unknown error")
      );
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    router.push("/seller/product");
  };

  return (
    <div className="">
      <div className="">
        <button
          onClick={() => window.history.back()}
          className="border px-5 py-2 shadow rounded mb-5 cursor-pointer"
        >
          <IoArrowBack />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>

        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="productName"
                    className="text-base font-medium"
                  >
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

                <div>
                  <Label
                    htmlFor="description"
                    className="text-base font-medium"
                  >
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Write product description (minimum 10 characters)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length} / 10 characters minimum
                  </p>
                </div>

                <div className="w-full">
                  <Label htmlFor="category" className="text-base font-medium">
                    Product Category <span className="text-red-500">*</span>
                  </Label>

                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryData?.data?.categorys?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <Label
                    htmlFor="subcategory"
                    className="text-base font-medium"
                  >
                    Product Subcategory <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    value={subcategoryId}
                    onValueChange={setSubcategoryId}
                    disabled={
                      !categoryId ||
                      filteredSubcategories.length === 0 ||
                      subcategoryLoading
                    }
                  >
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue
                        placeholder={
                          subcategoryLoading
                            ? "Loading subcategories..."
                            : !categoryId
                            ? "Select category first"
                            : filteredSubcategories.length === 0
                            ? "No subcategory available"
                            : "Select subcategory"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubcategories.length > 0 ? (
                        filteredSubcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory._id}
                            value={subcategory._id}
                          >
                            {subcategory.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-subcategory" disabled>
                          No subcategory available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {categoryId &&
                    filteredSubcategories.length === 0 &&
                    !subcategoryLoading && (
                      <p className="text-xs text-gray-500 mt-1">
                        No subcategories available for this category
                      </p>
                    )}
                  {subcategoryLoading && (
                    <p className="text-xs text-gray-500 mt-1">
                      Loading subcategories...
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="brand" className="text-base font-medium">
                    Brand <span className="text-red-500">*</span>
                  </Label>
                  <Select value={brandId} onValueChange={setBrandId}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandData?.data?.result?.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="basePrice" className="text-base font-medium">
                    Base Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="0.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Tags</Label>
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
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* ... (rest of your right column code remains the same) */}
                <div>
                  <Label className="text-base font-medium">
                    Feature Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    {featureImage ? (
                      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(featureImage)}
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

                <div>
                  <Label className="text-base font-medium">
                    Additional Images
                  </Label>
                  <div className="mt-2">
                    {additionalImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {additionalImages.map((img, index) => (
                          <div
                            key={index}
                            className="relative border-2 border-gray-300 rounded-lg overflow-hidden"
                          >
                            <img
                              src={URL.createObjectURL(img)}
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

                <div>
                  <Label className="text-base font-medium">Variant Color</Label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorSelect(color)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor === color.value
                            ? "ring-2 ring-offset-2 ring-gray-400"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {colorName} ({selectedColor})
                  </p>
                </div>

                <div>
                  <Label htmlFor="volume" className="text-base font-medium">
                    Volume (Optional)
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    placeholder="e.g., 500"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="variantPrice"
                    className="text-base font-medium"
                  >
                    Variant Price
                  </Label>
                  <Input
                    id="variantPrice"
                    type="number"
                    placeholder="Leave empty to use base price"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="variantQuantity"
                    className="text-base font-medium"
                  >
                    Variant Quantity
                  </Label>
                  <div className="mt-2 w-full flex items-stretch border border-gray-300 rounded-lg overflow-hidden">
                    <input
                      type="number"
                      value={variantQuantity}
                      onChange={(e) =>
                        setVariantQuantity(parseInt(e.target.value) || 1)
                      }
                      className="flex-1 text-center py-2 border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex flex-col border-l border-gray-300">
                      <button
                        onClick={() => setVariantQuantity(variantQuantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 border-b border-gray-300"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          setVariantQuantity(Math.max(1, variantQuantity - 1))
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-8 text-red-600 border-red-600 hover:bg-red-50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="px-8 bg-red-700 hover:bg-red-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Publishing..." : "Publish Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProductForm;
