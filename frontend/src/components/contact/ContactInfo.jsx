import React from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: MapPin,
      title: "Our Address",
      lines: ["Mohali,punjab India"],
      action: "https://maps.google.com/?q=Mohali,+Punjab,+India",
      actionText: "Get directions"
    },
    {
      icon: Mail,
      title: "Email Address",
      lines: ["abhikashyap252525@gmail.com"],
      action: "mailto:abhikashyap252525@gmail.com",
      actionText: "Send an email"
    },
    {
      icon: Phone,
      title: "Phone Number",
      lines: ["+91 9541126687"],
      action: "tel:9541126687",
      actionText: "Call us now"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      lines: ["Monday - Saturday: 8:00 AM - 8:00 PM", "Sunday: Closed (Online Orders 24/7)"],
      action: null,
      actionText: null
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-150 flex flex-col justify-between h-full">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B207] mb-1 inline-block">
          Get In Touch
        </span>
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Contact Information
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
          Have a question about our organic products, shipping, or need bulk supplies? We are here to help you every step of the way.
        </p>

        <div className="space-y-6">
          {contactDetails.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-[#00B207] flex items-center justify-center shrink-0 border border-green-100 group-hover:bg-[#00B207] group-hover:text-white transition-colors duration-300">
                  <Icon size={22} className="stroke-[1.8]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    {item.title}
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                    {item.lines.map((line, lIdx) => (
                      <div key={lIdx}>{line}</div>
                    ))}
                  </div>
                  {item.action && (
                    <a
                      href={item.action}
                      target={item.action.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-block text-xs font-semibold text-[#00B207] hover:underline mt-1.5"
                    >
                      {item.actionText} →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Quote / Helper Note */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 italic leading-relaxed">
          "Our customer care team typically responds within 2-4 business hours. We guarantee 100% satisfaction."
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
