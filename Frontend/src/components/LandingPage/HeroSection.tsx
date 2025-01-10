import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to CodeArena</h1>
        <p className="text-lg mb-8">
          Compete, Code, and Learn with real-time coding contests.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Join a Contest Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
