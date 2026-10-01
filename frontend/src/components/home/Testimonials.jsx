import React, { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import testimonialService from "../../services/testimonialService";

const FALLBACK_TESTIMONIALS = [
  {
    _id: "seed-1",
    name: "Robert Fox",
    role: "Customer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    review:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum pulvinar purus vehicula. The organic vegetables arrived super fresh and perfectly packed!",
    rating: 5
  },
  {
    _id: "seed-2",
    name: "Dianne Russell",
    role: "Customer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    review:
      "Duis gravida turpis dui, eget bibendum magna congue nec. Morbi cursus porttitor enim lobortis molestie. Best customer service and the delivery was right on time. Highly recommended for daily groceries!",
    rating: 5
  },
  {
    _id: "seed-3",
    name: "Eleanor Pena",
    role: "Customer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    review:
      "Maecenas vulputate, odio in facilisis sodales, sem nisi fringilla leo, ut feugiat quam nisi id nulla. Quality of the organic fruits is unmatched. I won't buy anywhere else!",
    rating: 5
  }
];

const getAvatarUrl = (avatar, name) => {
  if (!avatar) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Customer")}&background=00B207&color=fff&size=150`;
  }
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  const backendBase =
    import.meta.env?.VITE_BACKEND_URL || "http://localhost:5000";
  return `${backendBase.replace(/\/$/, "")}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
};

const Testimonials = () => {
  const [items, setItems] = useState(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const approved = await testimonialService.getApprovedTestimonials();
        if (isMounted && approved && approved.length > 0) {
          setItems(approved);
        }
      } catch (err) {
        console.error("Failed to load approved reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Responsive items per view: 1 for mobile, 2 for tablet, 3 for desktop
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  // Keep currentIndex bounded when items or visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="my-16 bg-[#F2F2F2]/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header section with Title, Feedback Button, and Slider Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="text-center sm:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00B207]">
              Client Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Discover real experiences from thousands of happy shoppers
            </p>
          </div>

          {items.length > visibleCount && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:border-[#00B207] hover:bg-[#00B207] hover:text-white text-gray-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                aria-label="Previous feedback"
                title="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:border-[#00B207] hover:bg-[#00B207] hover:text-white text-gray-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                aria-label="Next feedback"
                title="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Slider: 3 items visible in one horizontal line on desktop */}
        <div
          className="overflow-hidden -mx-3 py-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item._id || item.id || idx}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3"
              >
                <div className="h-full relative flex flex-col justify-between rounded-2xl bg-white p-7 shadow-xs border border-gray-150 transition-all duration-300 hover:shadow-md hover:border-[#00B207]/40 min-h-[220px]">
                  <div>
                    <Quote size={32} className="text-[#00B207]/30 fill-[#00B207]/20 mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic line-clamp-4">
                      "{item.review}"
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getAvatarUrl(item.avatar, item.name)}
                        alt={item.name}
                        className="h-11 w-11 rounded-full object-cover border-2 border-[#00B207]/20 shrink-0"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Customer")}&background=00B207&color=fff&size=150`;
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <span className="text-xs text-gray-400 truncate block">{item.role || "Customer"}</span>
                      </div>
                    </div>

                    <div className="flex text-[#FF8A00] shrink-0 ml-2">
                      {[...Array(Math.max(1, Math.min(5, Number(item.rating) || 5)))].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#FF8A00] stroke-none" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
