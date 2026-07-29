import Navbar from "../components/Landing/Navbar";
import HeroSection from "../components/Landing/HeroSection";
import TrustBar from "../components/Landing/TrustBar";
import StatsRow from "../components/Landing/StatsRow";
import FeatureSection from "../components/Landing/FeatureSection";
import WorkflowSection from "../components/Landing/WorkflowSection";
import AboutSection from "../components/Landing/AboutSection";
import ContactSection from "../components/Landing/ContactSection";
import MapSection from "../components/Landing/MapSection";
import BottomCTA from "../components/Landing/BottomCTA";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      {/* Hero */}
      <section id="home">
        <HeroSection />
      </section>

      <TrustBar />

      <StatsRow />

      {/* Features */}
      <section id="features">
        <FeatureSection />
      </section>

      {/* Workflow */}
      <section id="workflow">
        <WorkflowSection />
      </section>

      {/* About */}
      <section id="about">
        <AboutSection />
      </section>

      {/* Coverage */}
      <MapSection />

      {/* Contact */}
      <section id="contact">
        <ContactSection />
      </section>

      {/* <BottomCTA /> */}

      <Footer />

    </div>
  );
};

export default LandingPage;