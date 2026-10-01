import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Grid2X2,
  UserCog,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  MessageSquare,
  Quote,
  Ticket
} from "lucide-react";

import { NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { canSeeModule } from "../../config/permissions";

const Sidebar = ({
  user,
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
  onLogout
}) => {
  const allMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      module: null
    },
    {
      name: "Categories",
      path: "/categories",
      icon: Grid2X2,
      module: "categories"
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
      module: "products"
    },
    {
      name: "Sales",
      path: "/sales",
      icon: ImageIcon,
      module: null
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ShoppingCart,
      module: "orders"
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
      module: "customers"
    },
    {
      name: "Messages",
      path: "/messages",
      icon: MessageSquare,
      module: null
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: Quote,
      module: null
    },
    {
      name: "Coupons",
      path: "/coupons",
      icon: Ticket,
      module: null
    },
    {
      name: "Content Management",
      path: "/content-management",
      icon: FileText,
      module: "contentManagement"
    },
    {
      name: "FAQ",
      path: "/faq",
      icon: HelpCircle,
      module: "faqs"
    },
    {
      name: "Staff",
      path: "/staff",
      icon: UserCog,
      module: null,
      adminOnly: true
    }
  ];

  const isAdmin = user?.role && String(user.role).toUpperCase() === "ADMIN";

  const menuItems = allMenuItems.filter(
    (item) =>
      (!item.adminOnly || isAdmin) &&
      (!item.module || canSeeModule(user, item.module))
  );

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen flex flex-col justify-between bg-white border-r border-gray-200 transition-all duration-300
          ${collapsed ? "lg:w-[76px]" : "lg:w-[240px]"}
          ${sidebarOpen ? "translate-x-0 w-[240px]" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Header Section with Logo & Collapse Toggle */}
        <div
          className={`
            relative h-[72px] shrink-0 flex items-center border-b border-gray-100
            ${collapsed ? "justify-center px-2" : "justify-between px-5"}
          `}
        >
          <img
            src={Logo}
            alt="Ecobazar"
            className={collapsed ? "h-8 w-8 object-cover object-left" : "h-8 object-contain"}
          />

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 lg:hidden p-1"
          >
            <X size={20} />
          </button>

          {/* Desktop Collapse / Expand Toggle Button centered vertically */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:text-green-600 transition z-20 cursor-pointer"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.name : ""}
                className={({ isActive }) => `
                  flex h-10 w-full items-center rounded-lg text-sm font-medium transition
                  ${collapsed ? "justify-center px-0" : "gap-3 px-3.5"}
                  ${isActive
                    ? "bg-green-600 text-white shadow-xs"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-600"}
                `}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Fixed Bottom Section for Settings & Logout */}
        <div className="p-3 border-t border-gray-100 space-y-1 shrink-0 bg-white">
          {isAdmin && (
            <NavLink
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? "Settings" : ""}
              className={({ isActive }) => `
                flex h-10 w-full items-center rounded-lg text-sm font-medium transition
                ${collapsed ? "justify-center px-0" : "gap-3 px-3.5"}
                ${isActive
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"}
              `}
            >
              <Settings size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">Settings</span>}
            </NavLink>
          )}

          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Logout" : ""}
            className={`
              flex h-10 w-full items-center rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer
              ${collapsed ? "justify-center px-0" : "gap-3 px-3.5"}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
