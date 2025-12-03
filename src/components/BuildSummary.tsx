import { Build } from '../core/build';
import type { IAbility, RealmType } from '../types';

interface BuildSummaryProps {
  build: Build;
  allAbilities: Record<string, IAbility>;
  onResetBuild?: () => void;
  pointBudget?: number;
  remainingPoints?: number;
}

// Realm icons
const REALM_ICONS: Record<RealmType, string> = {
  Albion: '🏰',
  Midgard: '⚔️',
  Hibernia: '🍀',
};

// Get the CSS class for realm-specific styling
const getRealmClass = (realm: RealmType): string => {
  return `realm-${realm.toLowerCase()}`;
};

export const BuildSummary: React.FC<BuildSummaryProps> = ({
  build,
  allAbilities,
  pointBudget = 100,
  remainingPoints,
}) => {
  const hasClass = build.characterClass !== null;
  const hasPurchases = Object.keys(build.purchasedAbilities).length > 0;
  const remaining = remainingPoints ?? (pointBudget - build.spentPoints);
  const isOverBudget = remaining < 0;
  const budgetPercentUsed = Math.min((build.spentPoints / pointBudget) * 100, 100);

  return (
    <section className="section-card build-summary">
      <div className="section-card-header">
        <h2>
          <span className="icon">📋</span>
          Build Summary
        </h2>
      </div>
      <div className="section-card-body">
        {/* Class Info */}
        {hasClass ? (
          <div className={`build-summary-class ${getRealmClass(build.characterClass!.realm)}`}>
            <div className="build-summary-class-icon">
              {REALM_ICONS[build.characterClass!.realm]}
            </div>
            <div className="build-summary-class-info">
              <h3 className="build-summary-class-name">
                {build.characterClass!.name}
              </h3>
              <span className="build-summary-class-realm">
                {build.characterClass!.realm}
              </span>
            </div>
          </div>
        ) : (
          <div className="build-summary-no-class">
            <p>No class selected</p>
            <p style={{ fontSize: '0.85em', opacity: 0.7 }}>
              Choose a class to start building
            </p>
          </div>
        )}

        {/* Point Budget Progress */}
        {hasClass && (
          <div className="budget-progress">
            <div className="budget-progress-header">
              <span className="budget-progress-label">Point Budget</span>
              <span className={`budget-progress-value ${isOverBudget ? 'over-budget' : ''}`}>
                {build.spentPoints} / {pointBudget}
              </span>
            </div>
            <div className="budget-progress-bar">
              <div
                className={`budget-progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                style={{ width: `${budgetPercentUsed}%` }}
              />
            </div>
            <div className={`budget-remaining ${isOverBudget ? 'over-budget' : ''}`}>
              {isOverBudget ? (
                <>⚠️ {Math.abs(remaining)} points over budget</>
              ) : (
                <>{remaining} points remaining</>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="build-stats">
          <div className="build-stat">
            <div className="build-stat-value">{build.spentPoints}</div>
            <div className="build-stat-label">Points Spent</div>
          </div>
          <div className="build-stat">
            <div className="build-stat-value">{build.abilityCount}</div>
            <div className="build-stat-label">Abilities</div>
          </div>
        </div>

        {/* Purchased Abilities */}
        <div className="purchased-abilities">
          <div className="purchased-abilities-header">
            Purchased Abilities
          </div>

          {hasPurchases ? (
            <div className="purchased-abilities-list">
              {Object.entries(build.purchasedAbilities).map(([abilityId, rank]) => {
                const ability = allAbilities[abilityId];
                const abilityName = ability?.name || abilityId;
                const maxRank = ability?.ranks.length || rank;
                const isMaxed = rank >= maxRank;

                // Calculate total cost for this ability
                let totalCost = 0;
                if (ability) {
                  for (let r = 1; r <= rank; r++) {
                    const rankData = ability.ranks.find(rd => rd.rank === r);
                    if (rankData) totalCost += rankData.cost;
                  }
                }

                return (
                  <div key={abilityId} className="purchased-ability-item">
                    <span className="purchased-ability-name">
                      {abilityName}
                    </span>
                    <div className="purchased-ability-meta">
                      <span className="purchased-ability-cost">{totalCost} pts</span>
                      <span className={`purchased-ability-rank ${isMaxed ? 'maxed' : ''}`}>
                        {isMaxed ? 'MAX' : `${rank}/${maxRank}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="purchased-abilities-empty">
              {hasClass
                ? 'No abilities purchased yet. Click + to add abilities.'
                : 'Select a class to begin.'}
            </div>
          )}
        </div>

        {/* Tips */}
        {hasClass && !hasPurchases && (
          <div className="build-tips">
            <p style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', marginTop: '1rem', textAlign: 'center' }}>
              💡 Tip: Right-click an ability to remove a rank
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
