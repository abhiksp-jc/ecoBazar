import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Heart,
  ShoppingBag,
  Settings,
  LogOut
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { clearCustomerSession } from "../../utils/authSession";
import { showToast } from "../../utils/sweetalert";

const AccountSidebar = ({ activeTab = "dashboard", setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCart } = useCart();

  const handleLogout = () => {
    clearCustomerSession();
    showToast("Signed out successfully.", "info");
    navigate("/");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/account",
      action: () => {
        if (setActiveTab) setActiveTab("dashboard");
        navigate("/account");
      }
    },
    {
      id: "orders",
      label: "Order History",
      icon: Clock,
      path: "/account/orders",
      action: () => {
        if (setActiveTab) setActiveTab("orders");
        navigate("/account/orders");
      }
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      path: "/wishlist",
      action: () => {
        navigate("/wishlist");
      }
    },
    {
      id: "cart",
      label: "Shopping Cart",
      icon: ShoppingBag,
      path: "/cart",
      action: () => {
        if (openCart) {
          openCart();
        } else {
          navigate("/cart");
        }
      }
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/account/settings",
      action: () => {
        if (setActiveTab) setActiveTab("settings");
        navigate("/account/settings");
      }
    },
    {
      id: "logout",
      label: "Log-out",
      icon: LogOut,
      isLogout: true,
      action: handleLogout
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Navigation</h2>
      </div>

      <nav className="py-2 flex flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (!activeTab && item.id === "settings" && location.pathname.includes("/settings")) ||
            (!activeTab && item.id === "orders" && (location.pathname.includes("/order") || location.pathname.includes("/orders"))) ||
            (!activeTab && item.id === "dashboard" && location.pathname === "/account");

          if (item.isLogout) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="flex items-center gap-3.5 px-6 py-3.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/50 transition text-left cursor-pointer group"
              >
                <Icon
                  size={18}
                  className="text-gray-400 group-hover:text-red-500 transition"
                />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className={`flex items-center gap-3.5 px-6 py-3.5 text-xs sm:text-sm font-medium transition text-left cursor-pointer relative ${
                isActive
                  ? "bg-[#EAF7E9] text-[#00B207] font-semibold"
                  : "text-gray-600 hover:text-[#00B207] hover:bg-gray-50"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#00B207]" />
              )}
              <Icon
                size={18}
                className={isActive ? "text-[#00B207]" : "text-gray-400"}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AccountSidebar;
