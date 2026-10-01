import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Faqs = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

  // Fetch active FAQs added by admin from database
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/faqs/active");
        const data = await res.json();
        if (data.success && Array.isArray(data.faqs)) {
          setFaqs(data.faqs);
        }
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <TopHeader />
      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">FAQs</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Find answers to common questions about our store.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 text-gray-400">Loading FAQs...</div>
        )}

        {/* No FAQs */}
        {!loading && faqs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No FAQs added yet. Check back soon!</p>
          </div>
        )}

        {/* FAQ Accordion — shows exactly what admin added */}
        {!loading && faqs.length > 0 && (
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq._id}
                className={`border rounded-xl overflow-hidden transition-colors ${openIndex === idx ? "border-green-500 bg-green-50/30" : "border-gray-200 bg-white"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-gray-800 hover:text-green-600 cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${openIndex === idx ? "rotate-180 text-green-600" : "text-gray-400"
                      }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center">
          <HelpCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Still have questions?</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Our support team is happy to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-6 py-2.5 rounded-full transition"
          >
            Contact Us
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Faqs;
