import React from "react";
import { CheckCircle2, ShieldCheck, Truck, Sparkles, HeartPulse, Award } from "lucide-react";

const features = [
  {
    title: "100% Organic Products",
    desc: "Strictly chemical-free, natural produce",
    icon: Sparkles
  },
  {
    title: "Fresh & Natural",
    desc: "Harvested and delivered within 24 hours",
    icon: Award
  },
  {
    title: "Healthy & Nutritious",
    desc: "Packed with essential vitamins and fiber",
    icon: HeartPulse
  },
  {
    title: "Fast Delivery",
    desc: "Reliable and fast delivery to your door",
    icon: Truck
  },
  {
    title: "Secure Payment",
    desc: "100% encrypted & secure payment gateway",
    icon: ShieldCheck
  },
  {
    title: "Quality Guaranteed",
    desc: "Full money-back satisfaction guarantee",
    icon: CheckCircle2
  }
];

const AboutSecondSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gray-50/70 border-y border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Text & Features List */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00B207] mb-2 inline-block">
              Why Choose Eco-Bazar
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.18] tracking-tight">
              100% Trusted
              <br />
              <span className="text-[#00B207]">Organic Food Store</span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
              Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi. Cras eget libero ac turpis hendrerit tempor eget non nunc.
            </p>

            {/* Feature List with Green Icons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-gray-100 shadow-2xs hover:border-[#00B207] transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#00B207]">
                      <Icon size={20} className="stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 leading-tight">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Large Farmer Photo */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=900&q=80"
                alt="Organic Farmer Harvesting Produce"
                className="w-full h-[360px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/saleimg.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Experience overlay card */}
            <div className="absolute -bottom-5 -left-3 sm:left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-[#00B207] flex items-center justify-center font-black text-xl">
                37+
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 leading-tight">Years of Experience</div>
                <div className="text-xs text-gray-500">In Pure Organic Farming</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSecondSection;
