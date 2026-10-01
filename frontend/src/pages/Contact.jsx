import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";
import ContactMap from "../components/contact/ContactMap";

const Contact = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
      <div>
        {/* 1. Header */}
        <TopHeader />

        <div className="sticky top-0 z-40 bg-white shadow-xs">
          <MainHeader
            isMobileNavOpen={mobileNavOpen}
            onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          />

          <Navbar
            isMobileNavOpen={mobileNavOpen}
            onCloseMobileNav={() => setMobileNavOpen(false)}
          />
        </div>

        {/* 2. Top Banner / Breadcrumb */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#009406] via-[#00B207] to-[#165032] py-10 sm:py-14 text-white">
          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
            <img
              src="/leaves.jpg"
              alt="Leaves texture"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Contact Us
              </h1>
              <p className="text-xs sm:text-sm text-green-100 mt-1">
                We'd love to hear from you. Send us a message or visit our store.
              </p>
            </div>

            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm bg-black/20 backdrop-blur-xs px-4 py-2 rounded-full border border-white/10">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-gray-200 hover:text-white transition"
              >
                <Home size={15} />
                <span>Home</span>
              </Link>
              <ChevronRight size={14} className="text-green-300" />
              <span className="text-white font-semibold">Contact Us</span>
            </nav>
          </div>
        </div>

        <main className="overflow-hidden">
          {/* 3. Main Contact Section (Left Info Cards, Right Form) */}
          <section className="py-12 sm:py-16 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column (5 Cols) */}
                <div className="lg:col-span-5 flex">
                  <div className="w-full">
                    <ContactInfo />
                  </div>
                </div>

                {/* Right Column (7 Cols) */}
                <div className="lg:col-span-7 flex">
                  <div className="w-full">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Google Map / Location Section */}
          <ContactMap />
        </main>
      </div>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
