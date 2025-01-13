export interface Contest {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    participants: any[];
    problems: any[];
    createdBy: {
      _id: string;
    };
  }
  
  // components/contests/ContestLayout.tsx
  import React from 'react';
  import { Link, useLocation } from 'react-router-dom';
  import DashboardLayout from "./../../../components/common/DashboardLayout";
  
  interface ContestLayoutProps {
    children: React.ReactNode;
  }
  
  const ContestLayout: React.FC<ContestLayoutProps> = ({ children }) => {
    const location = useLocation();
    
    const tabs = [
      { path: '/contests/upcoming', label: 'Upcoming' },
      { path: '/contests/ongoing', label: 'Ongoing' },
      { path: '/contests/past', label: 'Past' }
    ];
  
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-900">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Contests</h1>
                <Link
                  to="/create-contest"
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  Create Contest
                </Link>
              </div>
              
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                        location.pathname === tab.path
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </nav>
              </div>
  
              {children}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  };
  
  export default ContestLayout;