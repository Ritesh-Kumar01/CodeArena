
  
  import React from 'react';
  import ContestLayout from './ContestLayout';
  import ContestList from './ContestList';
  
  const OngoingContests: React.FC = () => {
    return (
      <ContestLayout>
        <ContestList status="ongoing" />
      </ContestLayout>
    );
  };
  
  export default OngoingContests;
  
