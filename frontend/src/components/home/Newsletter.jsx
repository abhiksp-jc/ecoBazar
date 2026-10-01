import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { showToast } from "../../utils/sweetalert";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      showToast("Thank you for subscribing to Ecobazar newsletter! 📬", "success");
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <div className="bg-[#F7F7F7] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 mt-16 border-t border-gray-150">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Content */}
        <div className="max-w-md text-center lg:text-left">
          <h3 className="text-2xl font-bold text-gray-900">
            Subcribe our Newsletter
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.
          </p>
        </div>

        {/* Right Form */}
        <div className="w-full lg:max-w-xl">
          {subscribed ? (
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-[#00B207] bg-green-50 border border-green-200 px-5 py-3 rounded-full">
              <CheckCircle2 size={18} />
              <span>Thank you for subscribing to Eco-Bazar!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center rounded-full bg-white border border-gray-200 shadow-xs overflow-hidden p-1 focus-within:border-[#00B207] transition"
            >
              <div className="pl-4 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-3 py-2.5 text-sm text-gray-800 focus:outline-none placeholder-gray-400"
              />
              <button
                type="submit"
                className="rounded-full bg-[#00B207] hover:bg-[#009406] text-white font-semibold text-xs sm:text-sm px-6 sm:px-8 py-3 transition shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
