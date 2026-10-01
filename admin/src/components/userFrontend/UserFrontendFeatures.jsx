import React from "react";
import { Truck, Headphones, ShieldCheck, Package } from "lucide-react";

const UserFrontendFeatures = () => {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.05)] p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* 1. Free Shipping */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-green-600 shrink-0">
            <Truck size={32} className="stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Free Shipping</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Free shipping on all your order
            </p>
          </div>
        </div>

        {/* 2. Customer Support 24/7 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-green-600 shrink-0">
            <Headphones size={32} className="stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Customer Support 24/7
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant access to Support
            </p>
          </div>
        </div>

        {/* 3. 100% Secure Payment */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-green-600 shrink-0">
            <ShieldCheck size={32} className="stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              100% Secure Payment
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              We ensure your money is save
            </p>
          </div>
        </div>

        {/* 4. Money-Back Guarantee */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-green-600 shrink-0">
            <Package size={32} className="stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Money-Back Guarantee
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              30 Days Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFrontendFeatures;
