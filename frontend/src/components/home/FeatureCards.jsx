import React from "react";
import { Truck, Headphones, ShieldCheck, Package } from "lucide-react";

const FeatureCards = () => {
  const features = [
    {
      id: "shipping",
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on all your order"
    },
    {
      id: "support",
      icon: Headphones,
      title: "Customer Support 24/7",
      description: "Instant access to Support"
    },
    {
      id: "payment",
      icon: ShieldCheck,
      title: "100% Secure Payment",
      description: "We ensure your money is safe"
    },
    {
      id: "guarantee",
      icon: Package,
      title: "Money-Back Guarantee",
      description: "30 Days Money-Back Guarantee"
    }
  ];

  return (
    <div className="my-8 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-[#00B207] group-hover:bg-[#00B207] group-hover:text-white transition-colors duration-300 shrink-0">
                <Icon size={28} className="stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCards;
