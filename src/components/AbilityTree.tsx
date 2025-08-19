import React from 'react';
import { IAbility } from '../types';
import { Build } from '../core/build';
import { canPurchaseAbility } from '../core/validator';

interface AbilityTreeProps {
  allAbilities: Record<string, IAbility>;
  build: Build;
  onPurchaseAbility: (ability: IAbility) => void;
}

export const AbilityTree: React.FC<AbilityTreeProps> = ({
  allAbilities,
  build,
  onPurchaseAbility,
}) => {
  if (!build.characterClass) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h2>Ability Tree</h2>
        <p>Please select a class to see the available abilities.</p>
      </div>
    );
  }

  // A very simple grouping by tree
  const abilitiesByTree: Record<string, IAbility[]> = {};
  for (const ability of Object.values(allAbilities)) {
    if (build.characterClass.ra_trees.includes(ability.tree)) {
      if (!abilitiesByTree[ability.tree]) {
        abilitiesByTree[ability.tree] = [];
      }
      abilitiesByTree[ability.tree].push(ability);
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h2>Ability Tree</h2>
      {Object.entries(abilitiesByTree).map(([treeName, abilities]) => (
        <div key={treeName}>
          <h3>{treeName}</h3>
          {abilities.map(ability => {
            const currentRank = build.purchasedAbilities[ability.id] || 0;
            const nextRank = currentRank + 1;
            const rankData = ability.ranks.find(r => r.rank === nextRank);
            const isPurchasable = canPurchaseAbility(ability, nextRank, build);

            return (
              <div key={ability.id} style={{ marginLeft: '20px', borderLeft: '2px solid #eee', paddingLeft: '10px', marginBottom: '10px' }}>
                <strong>{ability.name}</strong> (Rank: {currentRank} / {ability.ranks.length})
                <button
                  onClick={() => onPurchaseAbility(ability)}
                  disabled={!isPurchasable}
                  style={{ marginLeft: '10px' }}
                >
                  {rankData ? `Purchase Rank ${nextRank} (Cost: ${rankData.cost})` : 'Max Rank'}
                </button>
                <p style={{ fontSize: '0.9em', color: '#555' }}>
                  <em>{ability.ranks[currentRank - 1]?.description || 'No rank purchased'}</em>
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
