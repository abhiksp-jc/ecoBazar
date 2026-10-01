import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PinterestIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.1-2.52.02-3.61l.73-3.1s-.19-.38-.19-.94c0-.88.51-1.54 1.15-1.54.54 0 .8.41.8.9 0 .55-.35 1.37-.53 2.13-.15.64.32 1.16.95 1.16 1.14 0 2.02-1.2 2.02-2.93 0-1.53-1.1-2.6-2.67-2.6-1.95 0-3.09 1.46-3.09 2.97 0 .59.23 1.22.51 1.57.06.07.06.13.05.2l-.19.78c-.03.13-.1.16-.23.1-1-.46-1.63-1.92-1.63-3.09 0-2.51 1.83-4.82 5.27-4.82 2.77 0 4.92 1.97 4.92 4.61 0 2.75-1.73 4.96-4.14 4.96-.81 0-1.57-.42-1.83-.92l-.5 1.9c-.18.7-.67 1.57-1 2.1A12 12 0 1 0 12 0z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const EcobazarNewsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <section className="bg-[#F7F7F7] border-t border-gray-200 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Heading & Short description */}
          <div className="max-w-md text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Subcribe our Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.
            </p>
          </div>

          {/* Center: Search / Subscribe Form */}
          <div className="w-full max-w-lg">
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#00B207] bg-green-50 border border-green-200 px-5 py-3 rounded-full">
                <CheckCircle2 size={18} />
                <span>Thank you for subscribing to Ecobazar!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center rounded-full bg-white border border-gray-200 shadow-2xs overflow-hidden p-1 focus-within:border-[#00B207] transition"
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
                  className="w-full px-3 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#00B207] hover:bg-[#009406] text-white font-semibold text-xs sm:text-sm px-6 sm:px-7 py-2.5 transition shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Right: Social Media Icons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-transparent hover:bg-[#00B207] text-gray-700 hover:text-white flex items-center justify-center transition border border-transparent hover:border-[#00B207]"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-transparent hover:bg-[#00B207] text-gray-700 hover:text-white flex items-center justify-center transition border border-transparent hover:border-[#00B207]"
            >
              <TwitterIcon size={18} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="w-10 h-10 rounded-full bg-transparent hover:bg-[#00B207] text-gray-700 hover:text-white flex items-center justify-center transition border border-transparent hover:border-[#00B207]"
            >
              <PinterestIcon size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-transparent hover:bg-[#00B207] text-gray-700 hover:text-white flex items-center justify-center transition border border-transparent hover:border-[#00B207]"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcobazarNewsletter;
