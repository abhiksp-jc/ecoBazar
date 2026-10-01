import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const defaultTeam = [
  {
    id: 1,
    name: "Jenny Wilson",
    position: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=450&q=80"
  },
  {
    id: 2,
    name: "Jane Cooper",
    position: "Worker",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=450&q=80"
  },
  {
    id: 3,
    name: "Cody Fisher",
    position: "Security Guard",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=450&q=80"
  },
  {
    id: 4,
    name: "Robert Fox",
    position: "Senior Farmer Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=450&q=80"
  }
];

const AboutTeamSection = () => {
  const [teamMembers, setTeamMembers] = useState(defaultTeam);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/admin/public/staff`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.staff && data.staff.length >= 4) {
            setTeamMembers(
              data.staff.slice(0, 4).map((s, idx) => ({
                id: s._id || idx,
                name: s.name,
                position: s.role === "ADMIN" ? "Managing Director" : "Team Member",
                image: s.profileImage
                  ? getImageUrl(s.profileImage, defaultTeam[idx % defaultTeam.length].image)
                  : defaultTeam[idx % defaultTeam.length].image
              }))
            );
          }
        }
      } catch (err) {}
    };

    fetchStaff();
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-gray-50/60 border-t border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#00B207] mb-1 inline-block">
            Leadership &amp; Passion
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Awesome Team
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque.
          </p>
        </div>

        {/* 4 Team Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl bg-white border border-gray-150 overflow-hidden shadow-xs hover:border-[#00B207] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative h-72 w-full overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x400?text=Team+Member";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Floating Social Icons */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition shadow-xs"
                  >
                    <FacebookIcon size={14} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition shadow-xs"
                  >
                    <TwitterIcon size={14} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:bg-[#00B207] hover:text-white flex items-center justify-center transition shadow-xs"
                  >
                    <InstagramIcon size={14} />
                  </a>
                </div>
              </div>

              {/* Name & Position */}
              <div className="p-5 text-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#00B207] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {member.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeamSection;
