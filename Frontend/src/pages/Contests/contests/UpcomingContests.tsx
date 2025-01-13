
import React from 'react';
import ContestLayout from './ContestLayout';
import ContestList from './ContestList';

const UpcomingContests: React.FC = () => {
  return (
    <ContestLayout>
      <ContestList status="upcoming" />
    </ContestLayout>
  );
};

export default UpcomingContests;

