"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useShowToast";
import { Button } from "../components/ui/button";

export const AuthGuard = ({ children, requiredRole = null }) => {
  const { isLoggedIn, role, isVendor } = useAuth();
  const router = useRouter();
  const { showError } = useToast();
  const [hasShownError, setHasShownError] = useState(false);

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!requiredRole) return true; // No role requirement
    
    // Map role strings to auth checks
    const roleChecks = {
      VENDOR: isVendor || role === "VENDOR",
      SELLER: role === "SELLER",
      ADMIN: role === "ADMIN",
      USER: role === "USER",
    };
    
    return roleChecks[requiredRole] || false;
  };

  const userHasAccess = isLoggedIn && hasRequiredRole();

  useEffect(() => {
    // Reset error state when login status or role changes
    setHasShownError(false);
  }, [isLoggedIn, role]);

  useEffect(() => {
    // Only show error once when access is denied
    if (!userHasAccess && !hasShownError) {
      if (!isLoggedIn) {
        showError("Please login to access this page");
        setHasShownError(true);

        const timeoutId = setTimeout(() => {
          router.replace("/auth/login");
        }, 3000);

        return () => clearTimeout(timeoutId);
      } else if (requiredRole && !hasRequiredRole()) {
        showError(`Access denied. This page requires ${requiredRole} role.`);
        setHasShownError(true);

        const timeoutId = setTimeout(() => {
          router.replace("/");
        }, 3000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [isLoggedIn, role, userHasAccess, hasShownError, router, showError, requiredRole]);

  // Render children with blur effect if access is denied
  return userHasAccess ? (
    children
  ) : (
    <div className="fixed inset-0 bg-white backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center opacity-90 space-y-4">
        <p className="text-red-600 font-semibold mb-4">Access Denied</p>
        <p className="text-gray-700">
          {!isLoggedIn
            ? "Please log in to access this page"
            : requiredRole
            ? `This page requires ${requiredRole} role. Your current role: ${role || "N/A"}`
            : "You don't have permission to access this page"}
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            className="bg-kappes hover:bg-red-800 text-white"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          {!isLoggedIn ? (
            <Button
              className="bg-kappes hover:bg-red-800 text-white"
              onClick={() => router.replace("/auth/login")}
            >
              Login
            </Button>
          ) : (
            <Button
              className="bg-kappes hover:bg-red-800 text-white"
              onClick={() => router.replace("/")}
            >
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Higher-order component for route protection
export const withAuth = (WrappedComponent, requiredRole = null) => {
  return function ProtectedRoute(props) {
    return (
      <AuthGuard requiredRole={requiredRole}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };
};
