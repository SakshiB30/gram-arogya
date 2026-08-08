import Navbar from "../components/Landing/Navbar";
import HeroSection from "../components/Landing/HeroSection";
import AboutSection from "../components/Landing/AboutSection";
import FeatureSection from "../components/Landing/FeatureSection";
import WorkflowSection from "../components/Landing/WorkflowSection";
import ContactSection from "../components/Landing/ContactSection";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <WorkflowSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;