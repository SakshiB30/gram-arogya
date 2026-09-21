import Navbar from "../components/Landing/Navbar";
import HeroSection from "../components/Landing/HeroSection";
import AboutSection from "../components/Landing/AboutSection";
import FeatureSection from "../components/Landing/FeatureSection";
import WorkFlowSection from "../components/Landing/WorkFlowSection";
import ContactSection from "../components/Landing/ContactSection";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <WorkFlowSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;