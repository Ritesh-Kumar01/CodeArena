import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 bg-gray-800 text-white text-center">
      <p>&copy; {new Date().getFullYear()} CodeArena. All rights reserved.</p>
      <div className="mt-4">
        <a href="#" className="mx-2 hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="mx-2 hover:underline">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
