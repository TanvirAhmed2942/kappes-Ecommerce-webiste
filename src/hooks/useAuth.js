import { useSelector, useDispatch } from "react-redux";
import {
  selectIsLoggedIn,
  selectRole,
  selectAccessToken,
  setRole,
  setAccessToken,
  setRefreshToken,
  login,
  logout,
} from "@/features/authSlice/authSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Get values from both Redux state and localStorage
  const reduxIsLoggedIn = useSelector(selectIsLoggedIn);
  const accessToken = useSelector(selectAccessToken);
  const role = useSelector(selectRole);

  // Decode JWT token to get userId
  const getUserId = () => {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") return null;

      // Get token from Redux or localStorage
      const token = accessToken || localStorage.getItem("accessToken");

      if (!token) return null;

      // Decode the token
      const decoded = jwtDecode(token);

      // Return userId (common JWT fields: _id, id, userId, sub)
      return decoded._id || decoded.id || decoded.userId || decoded.sub || null;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  };

  const userId = getUserId();

  // Determine if user is logged in
  const isLoggedIn = (() => {
    // Check if we're in browser environment
    if (typeof window === "undefined") return false;

    // Check Redux state first
    if (reduxIsLoggedIn) return true;

    // Check localStorage as a fallback
    const storedAccessToken = localStorage.getItem("accessToken");
    return !!storedAccessToken;
  })();

  const loginUser = (userData) => {
    dispatch(login(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const updateTokens = ({ accessToken, refreshToken }) => {
    if (accessToken) dispatch(setAccessToken(accessToken));
    if (refreshToken) dispatch(setRefreshToken(refreshToken));
  };

  const updateRole = (newRole) => {
    dispatch(setRole(newRole));
  };

  return {
    // State
    isLoggedIn,
    role,
    accessToken,
    userId,

    // Actions
    login: loginUser,
    logout: logoutUser,
    updateTokens,
    updateRole,

    // Checks
    isAdmin: role === "ADMIN",
    isSeller: role === "SELLER",
    isUser: role === "USER",
  };
};

export default useAuth;
