import React from 'react';

const features = [
  { title: 'Real-time Contests', description: 'Compete with coders globally in real-time.' },
  { title: 'Multi-language Support', description: 'Code in your favorite programming language.' },
  { title: 'Live Leaderboard', description: 'Track your performance instantly.' },
  { title: 'Secure Environment', description: 'Run code securely with isolated execution.' },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Why CodeArena?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
