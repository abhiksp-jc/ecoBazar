import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Ecobazar Pagination / Slide Bar Component
 * Matches the reference design with circular arrows, active green circle,
 * and clean numerical paging with truncation ellipses.
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 4) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }

    if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    pages.push("...");
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 select-none ${className}`}
    >
      {/* Previous Page Arrow Button */}
      <button
        type="button"
        onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition border ${
          currentPage === 1
            ? "bg-[#F2F3F4] border-transparent text-gray-300 cursor-not-allowed"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-2xs cursor-pointer"
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers & Ellipses */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((item, idx) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-7 sm:w-8 h-9 sm:h-10 flex items-center justify-center text-gray-400 font-semibold text-xs sm:text-sm tracking-widest"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(item);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange && onPageChange(pageNum)}
              aria-current={isActive ? "page" : undefined}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50/60"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Page Arrow Button */}
      <button
        type="button"
        onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition border ${
          currentPage === totalPages
            ? "bg-[#F2F3F4] border-transparent text-gray-300 cursor-not-allowed"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-2xs cursor-pointer"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
