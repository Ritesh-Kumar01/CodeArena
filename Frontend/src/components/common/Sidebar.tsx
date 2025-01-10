import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <nav className="flex flex-col space-y-4">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            isActive ? 'text-blue-500' : 'text-white'
          } 
          end
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/contests" 
          className={({ isActive }) => 
            isActive ? 'text-blue-500' : 'text-white'
          }
        >
          Contests
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            isActive ? 'text-blue-500' : 'text-white'
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
