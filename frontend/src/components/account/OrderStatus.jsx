import React from "react";
import { Check } from "lucide-react";

const STEPS = [
  { step: "01", label: "Order received" },
  { step: "02", label: "Processing" },
  { step: "03", label: "On the way" },
  { step: "04", label: "Delivered" }
];

const OrderStatus = ({ status = "Processing" }) => {
  // Determine active step index (0 to 3) based on status string
  const normalized = (status || "").toLowerCase();

  let activeIndex = 1; // Default to Processing (step 2) matching reference screenshot
  if (normalized.includes("pend") || normalized.includes("received")) {
    activeIndex = 0;
  } else if (normalized.includes("process")) {
    activeIndex = 1;
  } else if (normalized.includes("ship") || normalized.includes("way") || normalized.includes("transit")) {
    activeIndex = 2;
  } else if (normalized.includes("deliver") || normalized.includes("complet")) {
    activeIndex = 3;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 my-6 shadow-2xs">
      <div className="relative">
        {/* Progress Background Track */}
        <div className="absolute top-5 left-8 right-8 h-[3px] bg-gray-200 -z-0 hidden sm:block" />

        {/* Progress Active Green Line */}
        <div
          className="absolute top-5 left-8 h-[3px] bg-[#00B207] transition-all duration-500 -z-0 hidden sm:block"
          style={{
            width: `${(activeIndex / (STEPS.length - 1)) * (100 - 16)}%`
          }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 relative z-10">
          {STEPS.map((item, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            const isFuture = index > activeIndex;

            return (
              <div
                key={item.step}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                    isCompleted
                      ? "bg-[#00B207] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#00B207] text-white ring-4 ring-green-100 shadow-sm"
                      : "bg-white text-gray-400 border-2 border-dashed border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={2.5} />
                  ) : (
                    <span>{item.step}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2.5 text-xs sm:text-sm transition-colors ${
                    isCurrent || isCompleted
                      ? "text-[#00B207] font-semibold"
                      : "text-gray-400 font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
