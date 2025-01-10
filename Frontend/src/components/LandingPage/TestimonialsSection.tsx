import React from 'react';

const testimonials = [
  { name: 'Alice', feedback: 'CodeArena helped me level up my coding skills!' },
  { name: 'Bob', feedback: 'Great platform to compete and learn from peers.' },
  { name: 'Charlie', feedback: 'Loved the real-time leaderboard feature!' },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <p className="italic mb-4">"{testimonial.feedback}"</p>
              <h3 className="font-semibold">- {testimonial.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
