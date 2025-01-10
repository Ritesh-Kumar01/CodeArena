import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p className="text-gray-600">Create an account to get started.</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Join a Contest</h3>
            <p className="text-gray-600">Pick a contest and start coding.</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Compete & Win</h3>
            <p className="text-gray-600">Solve problems, earn points, and top the leaderboard!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
