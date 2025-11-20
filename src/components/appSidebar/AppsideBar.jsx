"use client";

import {
  Heart,
  LayoutGrid,
  Lock,
  LogOut,
  Package,
  ShoppingCart,
  Star,
  Store,
  Ticket,
  UserCog
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
const AppSidebar = () => {
  const [activeItem, setActiveItem] = useState('Overview');
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const menuItems = [
    { icon: LayoutGrid, label: 'Overview', active: true, path: '/seller/overview' },
    { icon: Package, label: 'Product', path: '/seller/product' },
    { icon: ShoppingCart, label: 'Order List', path: '/seller/order' },
    { icon: Ticket, label: 'Coupon', path: '/seller/coupon' },
    { icon: Store, label: 'Store info', path: '/seller/store' },
    { icon: Heart, label: 'Owner info', path: '/seller/owner' },
    { icon: Star, label: 'Reviews', path: '/seller/review' },
    { icon: UserCog, label: 'Admin Role', path: '/seller/admin' },
    { icon: Lock, label: 'Change Password', path: '/seller/change-password' },
    { icon: LogOut, label: 'Logout'},
  ];
  const handleLogout = () => {
    logout();
    router.push('/auth/become-seller-login');
  };

  useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.path === pathname);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.label);
    }
  }, [pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.label);
    if (item.path) {
      router.push(item.path);
    }
    if (item.label === 'Logout') {
      handleLogout();
    }
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg p-6 min-h-screen">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 border-red-600">
            <div className="text-white font-bold text-lg">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <text x="50" y="55" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">PEAK</text>
                <rect x="20" y="25" width="25" height="25" fill="none" stroke="white" strokeWidth="3" rx="2" />
                <rect x="55" y="25" width="25" height="25" fill="none" stroke="white" strokeWidth="3" rx="2" />
                <polyline points="32,32 38,38 32,38" fill="white" />
                <polyline points="68,32 62,38 68,38" fill="white" />
              </svg>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Peak</h2>
        <p className="text-sm text-gray-600">demo@example.com</p>
      </div>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-[#B01501] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppSidebar;