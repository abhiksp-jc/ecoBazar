import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  CheckCircle,
  Sparkles
} from "lucide-react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FeedbackSubmissionForm from "../components/feedback/FeedbackSubmissionForm";
import testimonialService from "../services/testimonialService";
import { showSuccessAlert, showErrorAlert } from "../utils/sweetalert";

const RATING_LABELS = {
  1: "Poor - Needs improvement",
  2: "Fair - Could be better",
  3: "Good - Satisfied",
  4: "Very Good - Impressed!",
  5: "Excellent - Highly recommended!"
};

const Feedback = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecobazar_user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!review.trim()) {
      setError("Please write your review feedback");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("role", "Customer");
      formData.append("rating", rating);
      formData.append("review", review.trim());

      await testimonialService.submitFeedback(formData);

      setSubmitted(true);
      showSuccessAlert(
        "Thank You!",
        "Your feedback has been submitted successfully and is awaiting review."
      );
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit feedback. Please try again.";
      setError(msg);
      showErrorAlert("Submission Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F9] text-gray-800 flex flex-col justify-between font-sans">
      <div>
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

        {/* Breadcrumb Banner */}
        <div className="relative overflow-hidden py-8 sm:py-10 bg-[#1A1A1A]">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <img
              src="/Hero.png"
              alt="Header Texture"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-400">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition">
                <Home size={15} />
              </Link>
              <ChevronRight size={13} className="text-gray-500 shrink-0" />
              <span className="text-[#00B207] font-medium">Customer Feedback</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Customer Feedback &amp; Reviews
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              We value your experience! Tell us what you loved about our fresh groceries and service.
            </p>
          </div>
        </div>

        {/* Main Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {submitted ? (
            /* Success State */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-150 shadow-sm animate-fade-in">
              <div className="w-20 h-20 bg-green-100 text-[#00B207] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle size={44} />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-[#00B207] mb-3">
                <Sparkles size={14} /> Submission Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Thank You for Your Feedback!
              </h2>
              <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Your review has been submitted successfully. Once approved, it will appear on our homepage!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setReview("");
                    setRating(5);
                  }}
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Submit Another Review
                </button>
                <Link
                  to="/"
                  className="px-7 py-3 rounded-full bg-[#00B207] text-white text-xs sm:text-sm font-bold hover:bg-[#009406] transition shadow-md shadow-[#00B207]/20"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <FeedbackSubmissionForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              rating={rating}
              setRating={setRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
              review={review}
              setReview={setReview}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              RATING_LABELS={RATING_LABELS}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Feedback;
