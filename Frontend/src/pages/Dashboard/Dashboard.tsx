import React from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-full rounded-lg shadow-lg bg-gray-900 p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Hello</h2>
            <hr className="border-gray-700 mb-4" />
            <div className="p-2">
              <p className="text-sm text-gray-300">get</p>
            </div>
       </div>
    </DashboardLayout>
  );
};

export default Dashboard;
