import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const AboutFirstSection = () => {
  const [dynamicContent, setDynamicContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/content-management/public/about`);
        if (res.ok) {
          const data = await res.json();
          if (data?.content?.content) {
            setDynamicContent(data.content.content);
          }
        }
      } catch (err) {}
    };

    fetchContent();
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Large Organic Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                alt="Fresh Organic Food Market"
                className="w-full h-[360px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/maingreen.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Badge overlay */}
            <div className="absolute -bottom-5 -right-3 sm:right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[#00B207]">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="text-xl font-extrabold text-gray-900 leading-tight">100%</div>
                <div className="text-xs font-semibold text-gray-500">Organic Certified</div>
              </div>
            </div>
          </div>

          {/* Right Column: Text & CTA */}
          <div className="lg:col-span-6 mt-6 lg:mt-0 flex flex-col justify-center">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00B207] mb-2 inline-block">
              Welcome to Eco-Bazar
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.18] tracking-tight">
              100% Trusted
              <br />
              <span className="text-[#00B207]">Organic Food Store</span>
            </h2>

            {dynamicContent ? (
              <div
                className="mt-6 text-sm sm:text-base text-gray-600 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: dynamicContent }}
              />
            ) : (
              <div className="mt-6 text-sm sm:text-base text-gray-600 leading-relaxed space-y-4">
                <p>
                  Morbi porttitor ligula id varius consectetur. Integer ipsum justo, lacinia pellentesque lorem nec, egestas dictum urna. Integer ac ultricies nibh. Cras pellentesque egestas tincidunt. In hac habitasse platea dictumst. Curabitur laoreet velit at nisl tempus egestas.
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Sed vulputate elit eu diam pharetra, sed feugiat lacus aliquet. Donec eget velit facilisis, molestie erat a, egestas risus. Sed tristique velit lorem, ac efficitur turpis luctus ut.
                </p>
              </div>
            )}

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
        </div>
      </div>
    </section>
  );
};

export default AboutFirstSection;
