import React from 'react';
import { Build } from '../core/build';

interface BuildSummaryProps {
  build: Build;
}

export const BuildSummary: React.FC<BuildSummaryProps> = ({ build }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h2>Build Summary</h2>
      <p><strong>Class:</strong> {build.characterClass?.name || 'None'}</p>
      <p><strong>Spent Points:</strong> {build.spentPoints}</p>
      <h3>Purchased Abilities:</h3>
      {Object.keys(build.purchasedAbilities).length === 0 ? (
        <p>None</p>
      ) : (
        <ul>
          {Object.entries(build.purchasedAbilities).map(([id, rank]) => (
            <li key={id}>{id} (Rank {rank})</li>
          ))}
        </ul>
      )}
    </div>
  );
};
