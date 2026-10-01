import React, { useState } from "react";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AboutBanner from "../components/about/AboutBanner";
import AboutFirstSection from "../components/about/AboutFirstSection";
import AboutSecondSection from "../components/about/AboutSecondSection";
import AboutDeliverySection from "../components/about/AboutDeliverySection";
import AboutTeamSection from "../components/about/AboutTeamSection";
import AboutTestimonials from "../components/about/AboutTestimonials";
import FeatureCards from "../components/home/FeatureCards";
import Newsletter from "../components/home/Newsletter";

const About = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col justify-between">
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

        {/* 2. Green About Banner */}
        <AboutBanner />

        <main className="overflow-hidden">
          {/* 3. First About Section: 100% Trusted Organic Food Store (Left Image, Right Content) */}
          <AboutFirstSection />

          {/* 4. Second About Section: 100% Trusted Organic Food Store + Features (Left Features, Right Farmer) */}
          <AboutSecondSection />

          {/* 5. Delivery Section: We Delivered, You Enjoy Your Order */}
          <AboutDeliverySection />

          {/* 6. Our Awesome Team */}
          <AboutTeamSection />

          {/* 7. Client Testimonials */}
          <AboutTestimonials />

          {/* 8. Feature / Service Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <FeatureCards />
          </div>

          {/* 9. Newsletter */}
          <Newsletter />
        </main>
      </div>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
};

export default About;
