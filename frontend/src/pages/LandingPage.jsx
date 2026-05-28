// frontend/src/pages/LandingPage.jsx
// 🏠 Main Landing Page

import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

// Landing sections
import HeroSection         from '@components/landing/HeroSection';
import TrustBar            from '@components/landing/TrustBar';
import FeaturesSection     from '@components/landing/FeaturesSection';
import HowItWorksSection   from '@components/landing/HowItWorksSection';
import StatsSection        from '@components/landing/StatsSection';
import TestimonialsSection from '@components/landing/TestimonialsSection';
import PricingSection      from '@components/landing/PricingSection';
import CTASection          from '@components/landing/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* 🧭 Navigation */}
      <Navbar />

      {/* 📄 Page Sections */}
      <main>
        <HeroSection />
        <TrustBar />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>

      {/* 🦶 Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;