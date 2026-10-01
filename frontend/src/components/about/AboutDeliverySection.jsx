import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, MapPin } from "lucide-react";

const AboutDeliverySection = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading, description, CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00B207] mb-2 inline-block">
              Express Doorstep Delivery
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.18] tracking-tight">
              We Delivered, You
              <br />
              <span className="text-[#00B207]">Enjoy Your Order.</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
              Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam eu mi cursus, posuere erat eu, euismod nulla. Our dedicated logistics network ensures temperature-controlled, sanitized fresh food delivery right when you need it.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-150">
                <Clock size={16} className="text-[#00B207]" />
                <span className="font-semibold">Same Day Dispatch</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-150">
                <ShieldCheck size={16} className="text-[#00B207]" />
                <span className="font-semibold">Contactless Delivery</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#00B207] hover:bg-[#009406] text-white px-8 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all group"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Delivery Person Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
              <img
                src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=900&q=80"
                alt="Eco-Bazar Grocery Delivery Person"
                className="w-full h-[360px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/Bannar Big.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Quick stats floating tag */}
            <div className="absolute -bottom-4 right-4 sm:right-8 bg-white/95 backdrop-blur-xs px-5 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-[#00B207] flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">50,000+ Orders</div>
                <div className="text-[11px] text-gray-500">Delivered on time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDeliverySection;
