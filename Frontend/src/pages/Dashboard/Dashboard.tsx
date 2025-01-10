import React from 'react';
import Layout from '../../components/common/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <h2 className="text-2xl font-semibold">Welcome to CodeArena!</h2>
      <p>This is your dashboard. Stay tuned for upcoming contests and updates.</p>
    </Layout>
  );
};

export default Dashboard;
