// import React from 'react';
// import HeroSection from './HeroSection';
// import FeaturesSection from './FeaturesSection';
// import HowItWorksSection from './HowItWorksSection';
// import TestimonialsSection from './TestimonialsSection';
// import Footer from './Footer';
import Navbar from '../common/Navbar';

// const LandingPage: React.FC = () => {
//   return (
//     <div>
//       <Navbar />
//       <HeroSection />
//       <FeaturesSection />
//       <HowItWorksSection />
//       <TestimonialsSection />
//       <Footer />
//     </div>
//   );
// };

// export default LandingPage;
import { 
  FaCode, 
  FaTrophy, 
  FaUsers, 
  FaLaptopCode, 
  FaGithub, 
  FaTwitter, 
  FaDiscord,
  FaBrain,
  FaRocket,
  FaClock,
  FaChartLine,
  FaArrowRight,
  FaPlay
} from 'react-icons/fa';

// Enhanced Hero Section
const Hero = () => (
  <div className="relative min-h-screen pt-16 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-spin-slow"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
    </div>

    {/* Grid Pattern Overlay */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

    {/* Content */}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center space-y-8">
        {/* Logo Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 animate-ping-slow">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20"></div>
            </div>
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
              <FaCode className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white animate-gradient-x">
          Code<span className="text-indigo-500">Arena</span>
        </h1>

        {/* Animated Subheading */}
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-white">Compete, Code, and Learn with</span>
          <div className="inline-block">
            <span className="inline-block animate-float bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">  Real-time </span>
          </div>
          <span className="text-white"> Contests</span>
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of developers in epic coding battles. 
          Sharpen your skills, climb the rankings, and become a coding champion.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link to="/signin" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-3">
            <span className="text-lg font-semibold">Start Coding Now</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button className="group w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-3 border border-white/20">
            <FaPlay className="w-4 h-4" />
            <span className="text-lg font-semibold">Watch Demo</span>
          </button>
        </div>

        {/* Stats */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "500+", label: "Daily Contests" },
            { value: "1M+", label: "Problems Solved" },
            { value: "150+", label: "Countries" }
          ].map((stat, index) => (
            <div key={index} className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom Gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
  </div>
);

// Style additions for the animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes ping-slow {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-gradient-x {
    animation: gradient-x 15s linear infinite;
    background-size: 200% 200%;
  }
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
document.head.appendChild(styleSheet);




// Hero Section Component
// const Hero = () => (
//   <div className="min-h-screen pt-16 bg-gray-900">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
//       <div className="text-center">
//         <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
//           Compete, Code, and Learn with
//           <span className="text-indigo-500"> Real-time</span> Contests
//         </h1>
//         <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
//           Join thousands of developers in live coding competitions. 
//           Enhance your skills, climb the leaderboard, and build your coding portfolio.
//         </p>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
//             Start Coding Now
//             <FaArrowRight />
//           </button>
//           <button className="w-full sm:w-auto px-8 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
//             View Competitions
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// Features Section Component
const Features = () => {
  const features = [
    {
      icon: <FaLaptopCode className="w-6 h-6" />,
      title: "Real-time Coding",
      description: "Code and compete in real-time with developers from around the world."
    },
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: "Skill Development",
      description: "Practice problem-solving and improve your coding skills with challenging contests."
    },
    {
      icon: <FaTrophy className="w-6 h-6" />,
      title: "Global Leaderboard",
      description: "Compete for top positions and showcase your achievements globally."
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Learning Resources",
      description: "Access comprehensive learning materials and improve your knowledge."
    }
  ];

  return (
    <div id="features" className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose CodeArena?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of coding competitions with features designed 
            to help you grow as a developer.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:transform hover:-translate-y-1 transition-transform">
              <div className="text-indigo-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Create Account",
      description: "Join our thriving community of developers. Set up your profile and get ready to compete.",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "Join Contests",
      description: "Browse through various competitions. Pick the ones that match your skill level and interests.",
      color: "from-indigo-600 to-purple-600"
    },
    {
      icon: <FaLaptopCode className="w-8 h-8" />,
      title: "Code & Submit",
      description: "Write your solution in our feature-rich code editor. Test and submit your code in real-time.",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your performance, earn badges, and climb the global leaderboard rankings.",
      color: "from-pink-600 to-rose-600"
    }
  ];

  return (
    <div id="how-it-works" className="relative bg-gray-900 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-gray-900"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How CodeArena 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500"> Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started with CodeArena in four simple steps and begin your journey to becoming a coding champion
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block bg-indigo-500 absolute top-1/2 -right-4 w-8 h-0.5">
                  <div className="w-full h-full bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                </div>
              )}

              {/* Card */}
              <div className="relative h-full group">
                {/* Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-50 group-hover:opacity-100 blur transition-opacity"></div>
                
                {/* Content */}
                <div className="relative h-full backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 transition-transform group-hover:-translate-y-1">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${step.color} mb-6`}>
                    <div className="text-white">{step.icon}</div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 mb-6">{step.description}</p>

                  {/* Learn More Link */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="group-hover:text-indigo-400 text-gray-500 flex items-center gap-2 transition-colors">
                      <span className="text-sm">Learn more</span>
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Link to={"/signup"} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1">
            <span className="text-lg font-semibold">Start Your Journey</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};


import { FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-gray-400 text-sm md:text-base">
              © 2025 CodeArena. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs md:text-sm">
              Created with ❤️ by Ritu Raj,Ritesh Kumar,Yojesh kumar,Vishal Kumar
            </p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default LandingPage;