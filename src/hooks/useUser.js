import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo, useEffect } from "react";
import {
  selectUser,
  selectUserProfile,
  selectUserName,
  selectUserEmail,
  selectUserImage,
  selectUserId,
  setUser,
  clearUser,
} from "@/features/userSlice/userSlice";
import { useGetUserProfileQuery } from "@/redux/userprofileApi/userprofileApi";

const useUser = () => {
  const dispatch = useDispatch();

  // Get user data from Redux store
  const user = useSelector(selectUser);
  const userProfile = useSelector(selectUserProfile);
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);
  const userImage = useSelector(selectUserImage);
  const userIdFromRedux = useSelector(selectUserId);

  // Get user profile from API
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery();

  // Get userId from Redux or fallback to profileData
  const userId = useMemo(() => {
    return userIdFromRedux || profileData?.data?._id || null;
  }, [userIdFromRedux, profileData?.data?._id]);

  // Automatically sync profileData to Redux when available
  // This ensures userId and all user data is available in Redux for other components
  useEffect(() => {
    if (profileData?.data && profileData.success && profileData.data._id) {
      const profileUserId = profileData.data._id;
      // Sync to Redux if userId is missing or different
      if (!userIdFromRedux || userIdFromRedux !== profileUserId) {
        dispatch(setUser(profileData.data));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.data?._id, profileData?.success, userIdFromRedux, dispatch]);

  const updateUserProfile = useCallback(
    (userData) => {
      // Only update if data is actually different
      try {
        if (JSON.stringify(userData) !== JSON.stringify(user)) {
          dispatch(setUser(userData));
        }
      } catch {
        // Fallback if stringify fails
        dispatch(setUser(userData));
      }
    },
    [dispatch, user]
  );

  const clearUserProfile = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);

  return {
    // State
    user,
    userProfile,
    userName,
    userEmail,
    userImage,
    userId,
    // API Data
    profileData,
    isLoading,
    error,
    refetch,

    // Actions
    updateUserProfile,
    clearUserProfile,
  };
};

export default useUser;
