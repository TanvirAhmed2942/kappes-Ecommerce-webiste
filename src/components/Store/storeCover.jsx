"use client";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import { getImageUrl } from "../../redux/baseUrl";
import { useCreateChatMutation } from "../../redux/shopuserChatApi/shopuserChatApi";
import useToast from "../../hooks/useShowToast";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
const StoreCover = ({ shopInfo }) => {
  const [following, setFollowing] = useState(false);
  const [createChat, { isLoading }] = useCreateChatMutation();
  const params = useParams();
  const storeId = params?.id;
  const { userId } = useUser();
  const { isLoggedIn } = useAuth();

  const toast = useToast();
  const router = useRouter();

  const handleCreateChat = async () => {
    if (!isLoggedIn) {
      toast.showError("Please login to Message this Seller.");
      return;
    }

    // Better error messages to identify which value is missing
    if (!userId) {
      console.error("Missing userId:", userId);
      toast.showError(
        "Unable to create chat. User information not available. Please try refreshing the page."
      );
      return;
    }

    if (!storeId) {
      console.error("Missing storeId:", storeId);
      toast.showError(
        "Unable to create chat. Store information not available."
      );
      return;
    }

    console.log("Creating chat with userId:", userId, "storeId:", storeId);

    try {
      const response = await createChat({
        participants: [
          {
            participantId: userId,
            participantType: "User",
          },
          {
            participantId: storeId,
            participantType: "Shop",
          },
        ],
      }).unwrap();

      console.log(response);

      if (response?.success) {
        toast.showSuccess(response?.message || "Chat created successfully!");
        router.push(`/chat/${response?.data?._id}`);
      } else {
        toast.showError(response?.message || "Failed to create chat");
      }
    } catch (error) {
      console.log(error);
      // Extract error message from different possible error structures
      let errorMessage = "Failed to create chat. Please try again.";

      if (error?.data?.errorMessages && error.data.errorMessages.length > 0) {
        errorMessage = error.data.errorMessages[0].message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.showError(errorMessage);
    }
  };

  return (
    <div className="w-full  mx-auto overflow-hidden">
      {/* Banner Image */}
      <div className="relative h-40 md:h-52 lg:h-64 w-full bg-gray-200 overflow-hidden">
        <Image
          src={`${getImageUrl}${shopInfo?.shopCover}`}
          width={5000}
          height={5000}
          alt="Mountain landscape with fog"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-start p-4 md:p-6">
        {/* Profile Avatar */}
        <div className="relative -mt-16 md:-mt-20 flex-shrink-0 mb-4 md:mb-0">
          {/* <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white bg-white"> */}
          <div className="flex items-center justify-center h-full w-full  text-white">
            <Image
              src={`${getImageUrl}${shopInfo?.logo}`}
              width={1000}
              height={1000}
              alt="storeLogo"
              className="w-24 h-24 border-2 rounded-lg"
            />
          </div>
          {/* </Avatar> */}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4 md:ml-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{shopInfo?.name}</h2>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">
                  ({shopInfo?.rating} reviews)
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {shopInfo?.followers} Followers
              </p>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                variant="outline"
                className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white border-none disabled:opacity-50"
                onClick={handleCreateChat}
                // disabled={!userId || isLoading || !shopInfo?.id}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Message"}
              </Button>

              <Button
                variant={following ? "outline" : "default"}
                className={`flex-1 md:flex-none ${
                  following ? "border-gray-300" : ""
                }`}
                onClick={() => setFollowing(!following)}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">About us</h3>
            <p className="text-gray-700 text-sm md:text-base">
              {shopInfo?.aboutUs}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCover;
