  
  import React from 'react';
  import ContestLayout from './ContestLayout';
  import ContestList from './ContestList';
  
  const PastContests: React.FC = () => {
    return (
      <ContestLayout>
        <ContestList status="completed" />
      </ContestLayout>
    );
  };
  
  export default PastContests;