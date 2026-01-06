import './Skeleton.css';

/**
 * Props for the base Skeleton component
 */
export interface SkeletonProps {
  /** Visual variant of the skeleton */
  variant?: 'text' | 'circle' | 'progress' | 'button';
  /** Width of the skeleton (number for px, string for any unit) */
  width?: string | number;
  /** Height of the skeleton (number for px, string for any unit) */
  height?: string | number;
  /** Number of skeleton elements to render */
  count?: number;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Base skeleton loading component with shimmer animation.
 * Use for creating custom loading states or combine with preset components.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width !== undefined) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height !== undefined) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant} ${className}`.trim()}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * Props for SkeletonCard preset
 */
export interface SkeletonCardProps {
  /** Show a header skeleton line */
  showHeader?: boolean;
  /** Number of content lines to show */
  lines?: number;
}

/**
 * Generic card skeleton with optional header and content lines.
 * Matches the section-card pattern used throughout the app.
 */
export function SkeletonCard({ showHeader = true, lines = 3 }: SkeletonCardProps) {
  return (
    <div className="skeleton-card-container" aria-hidden="true">
      {showHeader && <Skeleton variant="text" width="60%" height={24} />}
      <Skeleton variant="text" count={lines} />
    </div>
  );
}

/**
 * Ability card skeleton matching the ability-card layout.
 * Includes icon placeholder, title, subtitle, and action buttons.
 */
export function SkeletonAbilityCard() {
  return (
    <div className="skeleton-ability-card" aria-hidden="true">
      <Skeleton variant="circle" width={40} height={40} />
      <div className="skeleton-ability-content">
        <Skeleton variant="text" width="70%" height={18} />
        <Skeleton variant="text" width="40%" height={14} />
        <Skeleton variant="progress" width="100%" />
      </div>
      <div className="skeleton-ability-actions">
        <Skeleton variant="button" width={60} height={32} />
      </div>
    </div>
  );
}

/**
 * Class card skeleton matching the class-card layout.
 * Includes icon placeholder, class name, and realm name.
 */
export function SkeletonClassCard() {
  return (
    <div className="skeleton-class-card" aria-hidden="true">
      <Skeleton variant="circle" width={48} height={48} />
      <Skeleton variant="text" width="80%" height={18} />
      <Skeleton variant="text" width="50%" height={14} />
    </div>
  );
}

/**
 * Props for SkeletonAbilityTree preset
 */
export interface SkeletonAbilityTreeProps {
  /** Number of ability cards per tree group */
  cardsPerGroup?: number;
  /** Number of tree groups to show */
  groupCount?: number;
}

/**
 * Full ability tree section skeleton.
 * Includes tree group headers and multiple ability cards.
 */
export function SkeletonAbilityTree({
  cardsPerGroup = 3,
  groupCount = 2,
}: SkeletonAbilityTreeProps) {
  return (
    <div className="skeleton-section-card" aria-hidden="true">
      <div className="skeleton-section-header">
        <Skeleton variant="text" width={150} height={24} />
        <Skeleton variant="text" width={80} height={20} />
      </div>
      <div className="skeleton-section-body">
        {Array.from({ length: groupCount }).map((_, groupIndex) => (
          <div key={groupIndex} className="skeleton-tree-group">
            <div className="skeleton-tree-header">
              <Skeleton variant="circle" width={24} height={24} />
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={14} />
            </div>
            {Array.from({ length: cardsPerGroup }).map((_, cardIndex) => (
              <SkeletonAbilityCard key={cardIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Props for SkeletonClassSelector preset
 */
export interface SkeletonClassSelectorProps {
  /** Number of class cards to show */
  cardCount?: number;
}

/**
 * Class selector section skeleton.
 * Includes section header and grid of class card skeletons.
 */
export function SkeletonClassSelector({ cardCount = 6 }: SkeletonClassSelectorProps) {
  return (
    <div className="skeleton-section-card" aria-hidden="true">
      <div className="skeleton-section-header">
        <Skeleton variant="text" width={120} height={24} />
      </div>
      <div className="skeleton-section-body">
        <div className="skeleton-class-grid">
          {Array.from({ length: cardCount }).map((_, i) => (
            <SkeletonClassCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Build summary sidebar skeleton.
 * Matches the BuildSummary component layout with class info, budget, and stats.
 */
export function SkeletonBuildSummary() {
  return (
    <div className="skeleton-build-summary" aria-hidden="true">
      {/* Class Info Section */}
      <div className="skeleton-summary-header">
        <Skeleton variant="circle" width={56} height={56} />
        <div className="skeleton-summary-header-content">
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="40%" height={14} />
        </div>
      </div>

      {/* Budget Section */}
      <div className="skeleton-summary-section">
        <div className="skeleton-summary-section-title">
          <Skeleton variant="text" width={100} height={18} />
        </div>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="progress" width="100%" />
        <Skeleton variant="text" width="50%" height={14} />
      </div>

      {/* Stats Grid */}
      <div className="skeleton-summary-section">
        <div className="skeleton-summary-section-title">
          <Skeleton variant="text" width={80} height={18} />
        </div>
        <div className="skeleton-stats-grid">
          <div className="skeleton-stat-item">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="text" width="40%" height={20} />
          </div>
          <div className="skeleton-stat-item">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="text" width="40%" height={20} />
          </div>
        </div>
      </div>

      {/* Purchased Abilities Section */}
      <div className="skeleton-summary-section">
        <div className="skeleton-summary-section-title">
          <Skeleton variant="text" width={140} height={18} />
        </div>
        <Skeleton variant="text" count={3} />
      </div>
    </div>
  );
}
