import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const AccountBreadcrumb = ({
  items = null,
  currentPath = "Dashboard",
  title = ""
}) => {
  // If custom items array is provided, use it
  const breadcrumbItems = items || [
    { label: "Account", path: "/account" },
    { label: currentPath, path: null }
  ];

  return (
    <div className="relative overflow-hidden bg-[#1A1A1A] py-8 sm:py-10 text-white border-b border-gray-800">
      {/* Dark Vegetable/Organic Food Overlay Image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
        <img
          src="/leaves.jpg"
          alt="Vegetables background texture"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition"
          >
            <Home size={15} />
          </Link>

          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight size={14} className="text-gray-500 shrink-0" />
                {isLast || !item.path ? (
                  <span className="text-[#00B207] font-semibold">{item.label}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AccountBreadcrumb;
