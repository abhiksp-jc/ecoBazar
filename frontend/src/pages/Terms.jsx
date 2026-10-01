import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Terms = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Terms & Condition added by admin from public API
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content-management/public/terms");
        const data = await res.json();
        if (data.success && data.content && data.content.content) {
          setContent(data.content.content);
        }
      } catch (err) {
        console.error("Failed to load Terms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
    window.scrollTo(0, 0);
  }, []);

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
          <span className="text-gray-900 font-medium">Terms &amp; Condition</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
          <FileText className="w-7 h-7 text-green-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Terms &amp; Conditions
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        )}

        {/* Not added yet */}
        {!loading && !content && (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Terms &amp; Conditions have not been added yet.</p>
          </div>
        )}

        {/* Admin-written Terms content */}
        {!loading && content && (
          <div
            className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
