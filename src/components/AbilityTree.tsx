import type { IAbility } from '../types';
import { Build } from '../core/build';
import { canPurchaseAbility } from '../core/validator';

interface AbilityTreeProps {
  allAbilities: Record<string, IAbility>;
  build: Build;
  onPurchaseAbility: (ability: IAbility) => void;
  onRemoveAbility: (ability: IAbility) => void;
}

// Tree icons for visual flair
const TREE_ICONS: Record<string, string> = {
  enhancements: '✨',
  healing: '💚',
  smiting: '⚡',
  subterranean: '🌑',
  spirit: '👻',
  nature: '🌿',
  nurture: '🌸',
  default: '📜',
};

const getTreeIcon = (treeName: string): string => {
  return TREE_ICONS[treeName.toLowerCase()] || TREE_ICONS.default;
};

export const AbilityTree: React.FC<AbilityTreeProps> = ({
  allAbilities,
  build,
  onPurchaseAbility,
  onRemoveAbility,
}) => {
  if (!build.characterClass) {
    return (
      <section className="section-card ability-tree">
        <div className="section-card-header">
          <h2>
            <span className="icon">📖</span>
            Realm Abilities
          </h2>
        </div>
        <div className="section-card-body">
          <div className="ability-tree-empty">
            <div className="ability-tree-empty-icon">🎭</div>
            <p>Select a class above to view available realm abilities.</p>
          </div>
        </div>
      </section>
    );
  }

  // Group abilities by tree
  const abilitiesByTree: Record<string, IAbility[]> = {};
  for (const ability of Object.values(allAbilities)) {
    if (build.characterClass.ra_trees.includes(ability.tree)) {
      if (!abilitiesByTree[ability.tree]) {
        abilitiesByTree[ability.tree] = [];
      }
      abilitiesByTree[ability.tree].push(ability);
    }
  }

  // Handle right-click to remove ability rank
  const handleContextMenu = (e: React.MouseEvent, ability: IAbility) => {
    e.preventDefault();
    const currentRank = build.purchasedAbilities[ability.id] || 0;
    if (currentRank > 0) {
      onRemoveAbility(ability);
    }
  };

  return (
    <section className="section-card ability-tree">
      <div className="section-card-header">
        <h2>
          <span className="icon">📖</span>
          Realm Abilities
        </h2>
        <span className="badge badge-gold">
          {build.characterClass.name}
        </span>
      </div>
      <div className="section-card-body">
        {Object.entries(abilitiesByTree).map(([treeName, abilities]) => (
          <div key={treeName} className="tree-group">
            <div className="tree-group-header">
              <span className="icon">{getTreeIcon(treeName)}</span>
              <h3 className="tree-group-name">{treeName}</h3>
              <span className="tree-group-count">{abilities.length} abilities</span>
            </div>

            {abilities.map(ability => {
              const currentRank = build.purchasedAbilities[ability.id] || 0;
              const maxRank = ability.ranks.length;
              const nextRank = currentRank + 1;
              const rankData = ability.ranks.find(r => r.rank === nextRank);
              const currentRankData = ability.ranks.find(r => r.rank === currentRank);
              const isPurchasable = canPurchaseAbility(ability, nextRank, build);
              const isMaxed = currentRank >= maxRank;
              const hasRanks = currentRank > 0;
              const progressPercent = (currentRank / maxRank) * 100;

              // Determine card state class
              let cardStateClass = '';
              if (isMaxed) {
                cardStateClass = 'ability-maxed';
              } else if (isPurchasable) {
                cardStateClass = 'ability-purchasable';
              } else if (!isPurchasable && !hasRanks) {
                cardStateClass = 'ability-locked';
              }

              return (
                <div
                  key={ability.id}
                  className={`ability-card ${cardStateClass}`}
                  onContextMenu={(e) => handleContextMenu(e, ability)}
                  title={hasRanks ? 'Right-click to remove a rank' : ''}
                >
                  <div className="ability-header">
                    <div className="ability-info">
                      <h4 className="ability-name">
                        {ability.name}
                        {isMaxed && <span className="badge badge-success" style={{ marginLeft: '8px' }}>MAX</span>}
                      </h4>
                      <div className="ability-rank-info">
                        <span className="ability-rank-text">
                          Rank {currentRank} / {maxRank}
                        </span>
                        <div className="ability-rank-progress">
                          <div
                            className={`ability-rank-progress-fill ${isMaxed ? 'maxed' : ''}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ability-actions">
                      {hasRanks && (
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => onRemoveAbility(ability)}
                          title={`Remove rank (refund ${currentRankData?.cost || 0} points)`}
                        >
                          −
                        </button>
                      )}
                      <button
                        className={isPurchasable ? 'btn-success' : ''}
                        onClick={() => onPurchaseAbility(ability)}
                        disabled={!isPurchasable}
                      >
                        {isMaxed ? (
                          'Maxed'
                        ) : rankData ? (
                          <>
                            <span>+</span>
                            <span className="ability-cost">{rankData.cost} pts</span>
                          </>
                        ) : (
                          'Locked'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Show description of current rank or next rank */}
                  <p className="ability-description">
                    {currentRankData?.description ||
                     (rankData?.description ? `Next: ${rankData.description}` : 'No description available')}
                  </p>

                  {/* Show prerequisites if any and not yet met */}
                  {ability.prerequisites.length > 0 && !hasRanks && (
                    <div className="ability-prerequisites">
                      <span>⚠️</span>
                      <span>
                        Requires: {ability.prerequisites.map(p =>
                          p.type === 'ability'
                            ? `${allAbilities[p.ability]?.name || p.ability} Rank ${p.rank}`
                            : `${p.type}`
                        ).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {Object.keys(abilitiesByTree).length === 0 && (
          <div className="ability-tree-empty">
            <div className="ability-tree-empty-icon">📭</div>
            <p>No abilities available for this class yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
