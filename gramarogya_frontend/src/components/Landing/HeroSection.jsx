import { Link } from "react-router-dom";
import Container from "./Container";
import { ArrowRight, ShieldCheck, Users, HeartPulse, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Dark Overlay - Improved for better readability */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-black/80 via-black/60 to-black/40"></div>
      
      {/* Bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 z-0 h-2 bg-linear-to-t from-white via-white/50 to-transparent"></div>

      <Container className="relative z-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-emerald-100 border border-emerald-400/30 transition-all duration-300 hover:bg-emerald-500/30 hover:scale-105">
            <Sparkles className="h-4 w-4" />
            EXCLUSIVE HEALTHCARE PLATFORM
          </div>
          
          {/* Heading */}
          <h1 className="mt-8 text-4xl font-extrabold text-white lg:text-6xl xl:text-7xl leading-tight">
            Master the art of
            <br />
            <span className="bg-linear-to-r from-emerald-300 via-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Rural Healthcare
            </span>
          </h1>
          
          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Elevate your perspective. Learn proven strategies from industry experts
            to inspire teams and drive meaningful change in rural healthcare.
          </p>
          
          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link 
              to="/register" 
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 hover:-translate-y-0.5"
            >
              Get Started 
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/login" 
              className="group inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105"
            >
              Staff Login
            </Link>
          </div>

          {/* Feature Cards - Centered and improved */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            <div className="group rounded-xl bg-white/10 backdrop-blur-md p-5 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5">
              <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <h4 className="mt-3 font-semibold text-white text-sm">Secure Access</h4>
              <p className="text-white/50 text-xs mt-1">Role-based authentication</p>
            </div>
            <div className="group rounded-xl bg-white/10 backdrop-blur-md p-5 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5">
              <HeartPulse className="h-8 w-8 text-red-400 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <h4 className="mt-3 font-semibold text-white text-sm">Patient Care</h4>
              <p className="text-white/50 text-xs mt-1">Digital health records</p>
            </div>
            <div className="group rounded-xl bg-white/10 backdrop-blur-md p-5 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/5">
              <Users className="h-8 w-8 text-blue-400 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <h4 className="mt-3 font-semibold text-white text-sm">Digital Records</h4>
              <p className="text-white/50 text-xs mt-1">Paperless management</p>
            </div>
          </div>

          {/* Scroll indicator */}
          {/* <div className="mt-16 flex justify-center animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 rounded-full bg-white/50"></div>
            </div>
          </div> */}
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;