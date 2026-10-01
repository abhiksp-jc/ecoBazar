import React from "react";
import { MapPin, Navigation } from "lucide-react";

const ContactMap = () => {
  return (
    <section className="my-14 sm:my-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00B207] mb-1 inline-block">
              Store Locator
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Location
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Visit our flagship organic store or distribution center
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=4140+Parker+Rd+Allentown+New+Mexico"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00B207] hover:text-[#008f05] transition group self-start sm:self-auto"
          >
            <Navigation size={15} />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[360px] sm:h-[460px] rounded-3xl overflow-hidden shadow-md border border-gray-200 bg-gray-100">
          <iframe
            title="Eco-Bazar Store Location"
            src="https://maps.google.com/maps?q=4140%20Parker%20Rd,%20Allentown,%20New%20Mexico%2031134&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating Location Card */}
          <div className="absolute top-4 left-4 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-lg border border-gray-150 max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#00B207] flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Eco-Bazar Organic Hub</div>
              <div className="text-[11px] text-gray-500 leading-tight mt-0.5">
                4140 Parker Rd. Allentown, NM
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
