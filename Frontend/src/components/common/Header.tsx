import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">CodeArena</h1>
      <div className="flex items-center space-x-4">
        <span>User</span>
        <img
          src="/public/assets/images/profile-icon.png"
          alt="User"
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </div>
    </header>
  );
};

export default Header;
