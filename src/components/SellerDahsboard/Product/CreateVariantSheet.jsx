"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../components/ui/sheet";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useGetAllCategoryQuery } from "../../../redux/sellerApi/category/categoryApi";
import { useGetSubCategoryReletedToCategoryQuery } from "../../../redux/sellerApi/subCategory/subCategoryApi";
import { useCreateVariantMutation } from "../../../redux/variantApi/variantApi";
import { useDispatch } from "react-redux";
import { setVariantDetails } from "../../../features/variantSlice/variantSlice";

export default function CreateVariantSheet({
  open,
  onOpenChange,
  selectedCategory: controlledCategory,
  onCategoryChange,
  selectedSubcategory: controlledSubcategory,
  onSubcategoryChange,
}) {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({}); // Store values for each field
  const [variantImages, setVariantImages] = useState([]); // Store variant images
  const [variantName, setVariantName] = useState(""); // Identifier / name
  const [variantDescription, setVariantDescription] = useState("");
  const [createVariant, { isLoading: isCreating }] = useCreateVariantMutation();

  // Color picker options
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
    { name: "White", value: "#ffffff" },
  ];

  // Fetch categories
  const { data: categoryData, isLoading: isLoadingCategories } =
    useGetAllCategoryQuery();

  // Determine controlled vs internal selection
  const categoryValue = controlledCategory ?? selectedCategory;
  const subcategoryValue = controlledSubcategory ?? selectedSubcategory;

  // Fetch subcategories when category is selected
  const { data: subcategoryData, isLoading: isLoadingSubcategories } =
    useGetSubCategoryReletedToCategoryQuery(categoryValue, {
      skip: !categoryValue,
    });

  // Extract categories from API response
  const categories = Array.isArray(categoryData?.data?.categorys)
    ? categoryData.data.categorys
    : Array.isArray(categoryData?.data)
    ? categoryData.data
    : [];

  // Extract subcategories from API response
  const subcategories = Array.isArray(subcategoryData?.data?.subCategorys)
    ? subcategoryData.data.subCategorys
    : Array.isArray(subcategoryData?.data)
    ? subcategoryData.data
    : [];

  // Get requiredFieldsForVariant from selected subcategory
  const selectedSubcategoryData = subcategories.find(
    (sub) => sub._id === subcategoryValue
  );
  const requiredFields =
    selectedSubcategoryData?.requiredFieldsForVariant || [];

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedFields([]);
      setFieldValues({});
      setVariantImages([]);
      setVariantName("");
      setVariantDescription("");
    }
  }, [open]);

  // Reset subcategory and fields when category changes
  useEffect(() => {
    if (!onCategoryChange) {
      setSelectedSubcategory("");
    }
    setSelectedFields([]);
    setFieldValues({});
  }, [categoryValue, onCategoryChange]);

  // Reset fields when subcategory changes
  useEffect(() => {
    setSelectedFields([]);
    setFieldValues({});
  }, [subcategoryValue]);

  const handleCategorySelect = (value) => {
    if (onCategoryChange) {
      onCategoryChange(value);
      onSubcategoryChange?.("");
    } else {
      setSelectedCategory(value);
      setSelectedSubcategory("");
    }
  };

  const handleSubcategorySelect = (value) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(value);
    } else {
      setSelectedSubcategory(value);
    }
  };

  const handleFieldToggle = (field) => {
    setSelectedFields((prev) => {
      const isChecked = prev.includes(field);
      if (isChecked) {
        // Remove field and its value
        const newFields = prev.filter((f) => f !== field);
        setFieldValues((prevValues) => {
          const newValues = { ...prevValues };
          delete newValues[field];
          return newValues;
        });
        return newFields;
      } else {
        // Add field with default value
        const isColorField = field.toLowerCase().includes("color");
        const defaultValue = isColorField ? "#3b82f6" : "";
        setFieldValues((prevValues) => ({
          ...prevValues,
          [field]: defaultValue,
        }));
        return [...prev, field];
      }
    });
  };

  const handleFieldValueChange = (field, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorSelect = (field, color) => {
    setFieldValues((prev) => ({
      ...prev,
      [field]: color.value,
    }));
  };

  // Check if a field is a color field
  const isColorField = (field) => {
    return field.toLowerCase().includes("color");
  };

  // Compress image function
  const compressImage = (
    file,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8
  ) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Compression failed"));
              }
            },
            file.type,
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Handle variant image upload
  const handleVariantImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - variantImages.length;

    if (files.length > remainingSlots) {
      alert(
        `You can only upload ${remainingSlots} more image(s). Maximum 5 images allowed.`
      );
      return;
    }

    // Validate file types
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      alert("Please select only image files.");
      e.target.value = "";
      return;
    }

    // Validate individual file sizes (max 10MB per file)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (oversizedFiles.length > 0) {
      alert(
        `Some images are too large. Maximum size per image is 10MB. Please reduce the size of ${oversizedFiles.length} image(s) and try again.`
      );
      e.target.value = "";
      return;
    }

    try {
      // Compress all images
      const compressedFiles = await Promise.all(
        imageFiles.map((file) => compressImage(file))
      );

      // Check total size after compression (max 40MB total to prevent 413 errors)
      // Server can handle 10MB per image, with max 5 images = 50MB, but we'll set 40MB as safe limit
      const totalSize = compressedFiles.reduce(
        (sum, file) => sum + file.size,
        0
      );
      const MAX_TOTAL_SIZE = 40 * 1024 * 1024; // 40MB total

      if (totalSize > MAX_TOTAL_SIZE) {
        alert(
          `Total image size is too large (${(totalSize / 1024 / 1024).toFixed(
            2
          )}MB). Maximum total size is 40MB. Please reduce the number of images or use smaller images.`
        );
        e.target.value = "";
        return;
      }

      const newImages = [...variantImages, ...compressedFiles].slice(0, 5);
      setVariantImages(newImages);
    } catch (error) {
      console.error("Error compressing images:", error);
      alert("Error processing images. Please try again.");
    }

    // Reset input
    e.target.value = "";
  };

  // Remove variant image
  const removeVariantImage = (indexToRemove) => {
    setVariantImages(
      variantImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCreateVariant = () => {
    // Validation
    if (!variantName.trim()) {
      alert("Variant name is required");
      return;
    }

    if (!variantDescription || variantDescription.length < 10) {
      alert("Variant description must be at least 10 characters long");
      return;
    }

    if (variantDescription.length > 500) {
      alert("Variant description must not exceed 500 characters");
      return;
    }

    if (variantImages.length < 1) {
      alert("Please upload at least 1 variant image");
      return;
    }

    if (variantImages.length > 5) {
      alert("Maximum 5 variant images allowed");
      return;
    }

    // Build normalized fields payload (color fields include name + code)
    const normalizedFields = {};
    selectedFields.forEach((field) => {
      const value = fieldValues[field];
      if (!value) return;
      if (isColorField(field)) {
        const matchedColor = colors.find(
          (c) => c.value.toLowerCase() === value.toLowerCase()
        );
        normalizedFields[field] = {
          name: matchedColor?.name || "Color",
          code: value,
        };
      } else {
        normalizedFields[field] = value;
      }
    });

    const payload = {
      categoryId: categoryValue,
      subCategoryId: subcategoryValue,
      identifier: variantName.trim(),
      description: variantDescription.trim(),
      ...normalizedFields,
    };

    // Check total size before creating FormData
    const totalImageSize = variantImages.reduce(
      (sum, img) => sum + img.size,
      0
    );
    const MAX_RECOMMENDED_SIZE = 35 * 1024 * 1024; // 35MB recommended max (warning threshold)

    if (totalImageSize > MAX_RECOMMENDED_SIZE) {
      const sizeInMB = (totalImageSize / 1024 / 1024).toFixed(2);
      const proceed = confirm(
        `Warning: Total image size is ${sizeInMB}MB, which might be too large for the server. Maximum recommended is 35MB (server can handle up to 10MB per image). This may cause a 413 error.\n\nDo you want to continue anyway?`
      );
      if (!proceed) {
        return;
      }
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    variantImages.forEach((img) => formData.append("image", img));

    createVariant(formData)
      .unwrap()
      .then((res) => {
        const variantId = res?.data?._id;
        // Persist variant id
        dispatch(
          setVariantDetails({
            variantId: variantId || null,
          })
        );
        alert("Variant created successfully");
        onOpenChange(false);
      })
      .catch((err) => {
        let errorMessage = "Failed to create variant. Please try again.";

        // Handle specific error cases
        const status = err?.status || err?.originalStatus;
        const errorData = err?.data || err?.error;

        if (
          status === 413 ||
          (errorData && errorData.toString().includes("413"))
        ) {
          errorMessage =
            "Request too large (413 Error). The server rejected the request because it's too big. Images have been compressed, but if the error persists, please:\n- Upload fewer images (max 3-4 images)\n- Ensure each image is under 10MB\n- Total size should be under 40MB\n- Contact your server administrator to increase the upload size limit if needed";
        } else if (
          err?.error === "FETCH_ERROR" ||
          (errorData && errorData.toString().includes("CORS"))
        ) {
          errorMessage =
            "Network error. This might be a CORS issue or network problem. Please check your connection and try again.";
        } else if (err?.data?.message) {
          errorMessage = err.data.message;
        } else if (errorData) {
          errorMessage = errorData.toString();
        }

        alert(errorMessage);
        console.error("Create variant error:", err);
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto "
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">
            Create Variant
          </SheetTitle>
          <SheetDescription>
            Select a category and subcategory to see available variant fields
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={categoryValue}
              onValueChange={handleCategorySelect}
              disabled={isLoadingCategories}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCategories ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="no-categories" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Selection */}
          <div className="space-y-2">
            <Label htmlFor="subcategory" className="text-base font-medium">
              Subcategory <span className="text-red-500">*</span>
            </Label>
            <Select
              value={subcategoryValue}
              onValueChange={handleSubcategorySelect}
              disabled={!categoryValue || isLoadingSubcategories}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue
                  placeholder={
                    !categoryValue
                      ? "Select category first"
                      : isLoadingSubcategories
                      ? "Loading subcategories..."
                      : subcategories.length === 0
                      ? "No subcategories available"
                      : "Select a subcategory"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {!categoryValue ? (
                  <SelectItem value="no-category" disabled>
                    Please select a category first
                  </SelectItem>
                ) : isLoadingSubcategories ? (
                  <SelectItem value="loading" disabled>
                    Loading subcategories...
                  </SelectItem>
                ) : subcategories.length === 0 ? (
                  <SelectItem value="no-subcategories" disabled>
                    No subcategories available
                  </SelectItem>
                ) : (
                  subcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Variant Name */}
          {subcategoryValue && (
            <div className="space-y-2">
              <Label htmlFor="variantName" className="text-base font-medium">
                Variant Name / Identifier{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="variantName"
                type="text"
                placeholder="e.g., Strawberry 500g, Black XL"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {/* Required Fields for Variant */}
          {subcategoryValue && requiredFields.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Required Fields for Variant
              </Label>
              <div className="space-y-1 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {requiredFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Checkbox
                      id={`field-${index}`}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => handleFieldToggle(field)}
                    />
                    <Label
                      htmlFor={`field-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {field}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedFields.length > 0 && (
                <p className="text-sm text-gray-600">
                  {selectedFields.length} field(s) selected
                </p>
              )}
            </div>
          )}

          {/* Input Fields for Selected Variant Fields */}
          {selectedFields.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Variant Field Values
              </Label>
              {selectedFields.map((field) => {
                const isColor = isColorField(field);
                const currentValue = fieldValues[field] || "";

                return (
                  <div key={field} className="space-y-2">
                    <Label
                      htmlFor={`variant-field-${field}`}
                      className="text-sm font-medium capitalize"
                    >
                      {field} <span className="text-red-500">*</span>
                    </Label>
                    {isColor ? (
                      <div className="space-y-2">
                        {/* Color Picker with Predefined Colors */}
                        <div className="flex flex-wrap gap-2">
                          {colors.map((color, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleColorSelect(field, color)}
                              className={`w-10 h-10 rounded-full transition-all ${
                                currentValue === color.value
                                  ? "ring-2 ring-offset-2 ring-gray-400"
                                  : ""
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                        {/* HTML5 Color Input as Fallback */}
                        <div className="flex items-center gap-3">
                          <Input
                            id={`variant-field-${field}`}
                            type="color"
                            value={currentValue}
                            onChange={(e) =>
                              handleFieldValueChange(field, e.target.value)
                            }
                            className="h-12 w-24 cursor-pointer"
                          />
                          <Input
                            type="text"
                            placeholder="Or enter hex color code"
                            value={currentValue}
                            onChange={(e) =>
                              handleFieldValueChange(field, e.target.value)
                            }
                            className="flex-1 h-12"
                            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                          />
                        </div>
                        {currentValue && (
                          <p className="text-xs text-gray-500">
                            Selected: {currentValue}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Input
                        id={`variant-field-${field}`}
                        type="text"
                        placeholder={`Enter ${field}`}
                        value={currentValue}
                        onChange={(e) =>
                          handleFieldValueChange(field, e.target.value)
                        }
                        className="h-12"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {subcategoryValue && requiredFields.length === 0 && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                No required fields for this subcategory
              </p>
            </div>
          )}

          {/* Variant Description */}
          {subcategoryValue && (
            <div className="space-y-2">
              <Label
                htmlFor="variantDescription"
                className="text-base font-medium"
              >
                Variant Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="variantDescription"
                placeholder="Enter variant description (minimum 10, maximum 500 characters)"
                value={variantDescription}
                onChange={(e) => setVariantDescription(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {variantDescription.length} / 500 characters
                </p>
                {variantDescription.length > 0 &&
                  variantDescription.length < 10 && (
                    <p className="text-xs text-red-500">
                      Minimum 10 characters required
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Variant Images */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Variant Images <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500">
              Upload 1-5 images ({variantImages.length}/5)
            </p>

            {/* Image Preview Grid */}
            {variantImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {variantImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative border-2 border-gray-300 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Variant ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {variantImages.length < 5 && (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleVariantImageUpload}
                  className="hidden"
                  disabled={variantImages.length >= 5}
                />
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Drop your images here or
                  </p>
                  <span className="text-sm text-red-600 font-medium hover:text-red-700">
                    Click to upload
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {5 - variantImages.length} slot(s) remaining
                  </p>
                </div>
              </label>
            )}

            {variantImages.length >= 5 && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Maximum 5 images reached. Remove an image to add more.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateVariant}
              disabled={
                !categoryValue ||
                !subcategoryValue ||
                !variantDescription ||
                variantDescription.length < 10 ||
                variantDescription.length > 500 ||
                variantImages.length < 1 ||
                variantImages.length > 5 ||
                !variantName.trim() ||
                isCreating ||
                selectedFields.some(
                  (field) =>
                    !fieldValues[field] || fieldValues[field].trim() === ""
                )
              }
              className="px-8 bg-red-700 hover:bg-red-800 text-white"
            >
              {isCreating ? "Creating..." : "Create Variant"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
