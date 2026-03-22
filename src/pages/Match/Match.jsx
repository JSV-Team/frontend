import React from 'react';
import { MatchProvider } from '../../contexts/MatchContext';
import MatchContainer from './MatchContainer';

function Match() {
  return (
    <MatchProvider>
      <MatchContainer />
    </MatchProvider>
  );
}

export default Match;
