"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { TbHome } from "react-icons/tb";
import provideIcon from "../../../common/components/provideIcon";
import useUser from "../../../hooks/useUser";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useUpdateUserProfileMutation } from "../../../redux/userprofileApi/userprofileApi";
import useToast from "../../../hooks/useShowToast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Province code mapping
const provinceCodeMap = {
  Alberta: "AB",
  "British Columbia": "BC",
  Manitoba: "MB",
  "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL",
  "Nova Scotia": "NS",
  Ontario: "ON",
  "Prince Edward Island": "PE",
  Quebec: "QC",
  Saskatchewan: "SK",
  "Northwest Territories": "NT",
  Nunavut: "NU",
  Yukon: "YT",
};

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export default function PersonalInfo({ selectedMenu }) {
  const { user, profileData, updateUserProfile } = useUser();

  useEffect(() => {
    if (profileData?.data && profileData.success && profileData.data._id) {
      const profileUserId = profileData.data._id;

      if (!user._id || user._id !== profileUserId) {
        updateUserProfile(profileData.data);
      }
    }
  }, [
    profileData?.data?._id,
    profileData?.success,
    user._id,
    updateUserProfile,
  ]);

  if (selectedMenu !== 1) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <PersonalInfoCard user={user} />
      <ShippingAddressCard user={user} />
    </div>
  );
}

function PersonalInfoCard({ user }) {
  const [open, setOpen] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { updateUserProfile } = useUser();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
  });

  // Reset form when user data changes or modal opens
  useEffect(() => {
    if (open && user) {
      reset({
        full_name: user.full_name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      // Create FormData with proper structure
      const formData = new FormData();

      // Add data as JSON object
      formData.append(
        "data",
        JSON.stringify({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email,
        })
      );

      // Console log FormData contents
      console.log("Personal Info FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log("Parsed data:", JSON.parse(formData.get("data")));

      const response = await updateProfile({ data: formData });

      if (response?.data?.success) {
        showSuccess(response.data.message || "Profile updated successfully");
        updateUserProfile(response.data.data); // Update Redux store
        setOpen(false);
      } else {
        const errorMessage =
          response?.error?.data?.message || "Failed to update profile";
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      showError("An error occurred while updating profile");
    }
  };

  return (
    <>
      <Card className="p-0 w-full h-fit md:w-full lg:w-[40rem] lx:w-[60rem] overflow-hidden z-10">
        <div className="bg-kappes px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <span>{provideIcon({ name: "user_pen" })}</span>
            <p>Personal Information</p>
          </div>
          <Button
            className="bg-transparent hover:bg-transparent cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {provideIcon({ name: "edit" })}
          </Button>
        </div>
        <div className="flex flex-col gap-4 p-5 -mt-5">
          <p className="flex items-center gap-4">
            {provideIcon({ name: "user" })}
            {user?.full_name || "Not provided"}
          </p>
          <p className="flex items-center gap-4">
            {provideIcon({ name: "telephone" })}
            {user?.phone || "Not provided"}
          </p>
          <p className="flex items-center gap-4">
            {provideIcon({ name: "message" })}
            {user?.email || "Not provided"}
          </p>
        </div>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
            <DialogDescription>
              Update your personal information below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Full Name<span className="text-red-600">*</span>
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Enter your full name"
                {...register("full_name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number<span className="text-red-600">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+]?[\d\s-()]+$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email<span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-kappes hover:bg-kappes/90"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ShippingAddressCard = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { updateUserProfile } = useUser();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: user?.chitchat_address1 || user?.address?.address || "",
      city: user?.chitchat_city || user?.address?.city || "",
      post: user?.chitchat_postal_code || user?.address?.post || "",
      province_code: user?.chitchat_province_code || "",
      country_code: user?.chitchat_country_code || "CA",
    },
  });

  // Reset form when user data changes or modal opens
  useEffect(() => {
    if (open && user) {
      reset({
        address: user?.chitchat_address1 || user?.address?.address || "",
        city: user?.chitchat_city || user?.address?.city || "",
        post: user?.chitchat_postal_code || user?.address?.post || "",
        province_code: user?.chitchat_province_code || "",
        country_code: user?.chitchat_country_code || "CA",
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      // Create FormData with proper structure
      const formData = new FormData();

      // Map regular fields to chitchat_ prefixed fields
      const chitchatData = {
        chitchat_address1: data.address,
        chitchat_city: data.city,
        chitchat_postal_code: data.post,
        chitchat_province_code: data.province_code,
        chitchat_country_code: data.country_code,
      };

      // Add data as JSON object
      formData.append(
        "data",
        JSON.stringify({
          address: {
            address: data.address,
            city: data.city,
            post: data.post,
          },
          ...chitchatData,
        })
      );

      // Console log FormData contents
      console.log("Address FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log("Parsed data:", JSON.parse(formData.get("data")));

      const response = await updateProfile({ data: formData });

      if (response?.data?.success) {
        showSuccess(response.data.message || "Address updated successfully");
        updateUserProfile(response.data.data); // Update Redux store
        setOpen(false);
      } else {
        const errorMessage =
          response?.error?.data?.message || "Failed to update address";
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Update address error:", error);
      showError("An error occurred while updating address");
    }
  };

  return (
    <>
      <Card className="p-0 w-full h-fit md:w-full lg:w-[40rem] overflow-hidden z-10">
        <div className="bg-kappes px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <span>
              <TbHome size={25} />
            </span>
            <p>Shipping Address</p>
          </div>
          <Button
            className="bg-transparent hover:bg-transparent cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {provideIcon({ name: "home" })}
          </Button>
        </div>
        <div className="flex flex-col gap-4 p-5 -mt-5">
          <p className="flex items-center gap-4">
            <span>{provideIcon({ name: "location" })}</span>
            {user?.chitchat_address1 ||
              user?.address?.address ||
              "No address provided"}
          </p>
          <p className="flex items-center gap-4">
            <span>{provideIcon({ name: "location" })}</span>
            {(() => {
              const city = user?.chitchat_city || user?.address?.city || "";
              const postalCode =
                user?.chitchat_postal_code || user?.address?.post || "";
              const provinceCode = user?.chitchat_province_code || "";
              const countryCode = user?.chitchat_country_code || "";

              // Get province name from code
              const provinceName = provinceCode
                ? Object.entries(provinceCodeMap).find(
                    ([_, code]) => code === provinceCode
                  )?.[0] || provinceCode
                : "";

              const parts = [];
              if (city) parts.push(city);
              if (provinceName) parts.push(provinceName);
              if (postalCode) parts.push(postalCode);
              if (countryCode) parts.push(countryCode);

              return parts.length > 0 ? parts.join(", ") : "No city provided";
            })()}
          </p>
        </div>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shipping Address</DialogTitle>
            <DialogDescription>
              Update your shipping address details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">
                Street Address<span className="text-red-600">*</span>
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your street address"
                {...register("address", {
                  required: "Street address is required",
                  minLength: {
                    value: 5,
                    message: "Address must be at least 5 characters",
                  },
                })}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                City<span className="text-red-600">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter your city"
                {...register("city", {
                  required: "City is required",
                  minLength: {
                    value: 2,
                    message: "City must be at least 2 characters",
                  },
                })}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="post">Postal Code</Label>
              <Input
                id="post"
                type="text"
                placeholder="Enter postal code"
                {...register("post", {
                  pattern: {
                    value: /^[A-Za-z0-9\s-]+$/,
                    message: "Please enter a valid postal code",
                  },
                })}
                className={errors.post ? "border-red-500" : ""}
              />
              {errors.post && (
                <p className="text-sm text-red-500">{errors.post.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province_code">Province Code</Label>
              <Controller
                name="province_code"
                control={control}
                render={({ field }) => {
                  // Find the province name from the code for display
                  const selectedProvince =
                    Object.entries(provinceCodeMap).find(
                      ([_, code]) => code === field.value
                    )?.[0] || "";

                  return (
                    <Select
                      onValueChange={(value) => {
                        // Store the province code, not the name
                        const code = provinceCodeMap[value] || value;
                        field.onChange(code);
                      }}
                      value={selectedProvince}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province} ({provinceCodeMap[province] || ""})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.province_code && (
                <p className="text-sm text-red-500">
                  {errors.province_code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country_code">Country Code</Label>
              <Controller
                name="country_code"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">Canada (CA)</SelectItem>
                      <SelectItem value="US">United States (US)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country_code && (
                <p className="text-sm text-red-500">
                  {errors.country_code.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-kappes hover:bg-kappes/90"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
