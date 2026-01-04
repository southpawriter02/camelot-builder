import type { AggregatedStats, StatType } from '../types';
import { getStatLabel, groupStatsByCategory } from '../core/stats';

interface StatsDisplayProps {
  stats: AggregatedStats;
  compact?: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  compact = false,
}) => {
  const hasStats = Object.keys(stats).length > 0;

  if (!hasStats) {
    return (
      <div className="stats-display stats-display--empty">
        <p className="stats-display-empty-message">
          No stat bonuses yet. Purchase abilities to see your stats.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="stats-display stats-display--compact">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="stat-chip">
            <span className="stat-chip-label">{getStatLabel(stat as StatType)}</span>
            <span className="stat-chip-value">+{value}</span>
          </div>
        ))}
      </div>
    );
  }

  const grouped = groupStatsByCategory(stats);

  return (
    <div className="stats-display">
      {Object.entries(grouped).map(([category, categoryStats]) => (
        <div key={category} className="stats-category">
          <h4 className="stats-category-title">{category}</h4>
          <div className="stats-category-grid">
            {Object.entries(categoryStats).map(([stat, value]) => (
              <div key={stat} className="stat-item">
                <span className="stat-item-label">
                  {getStatLabel(stat as StatType)}
                </span>
                <span className="stat-item-value">+{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
