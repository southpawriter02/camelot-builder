import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Skeleton,
  SkeletonCard,
  SkeletonAbilityCard,
  SkeletonClassCard,
  SkeletonAbilityTree,
  SkeletonClassSelector,
  SkeletonBuildSummary,
} from './Skeleton';

describe('Skeleton base component', () => {
  describe('rendering', () => {
    it('renders with default text variant', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toBeDefined();
      expect(skeleton?.classList.contains('skeleton-text')).toBe(true);
    });

    it('renders with specified variant class', () => {
      const { container } = render(<Skeleton variant="circle" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.classList.contains('skeleton-circle')).toBe(true);
    });

    it('renders with progress variant', () => {
      const { container } = render(<Skeleton variant="progress" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.classList.contains('skeleton-progress')).toBe(true);
    });

    it('renders with button variant', () => {
      const { container } = render(<Skeleton variant="button" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.classList.contains('skeleton-button')).toBe(true);
    });
  });

  describe('dimensions', () => {
    it('applies custom width as number (px)', () => {
      const { container } = render(<Skeleton width={200} />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.getAttribute('style')).toContain('width: 200px');
    });

    it('applies custom width as string', () => {
      const { container } = render(<Skeleton width="50%" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.getAttribute('style')).toContain('width: 50%');
    });

    it('applies custom height as number (px)', () => {
      const { container } = render(<Skeleton height={100} />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.getAttribute('style')).toContain('height: 100px');
    });

    it('applies custom height as string', () => {
      const { container } = render(<Skeleton height="2rem" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.getAttribute('style')).toContain('height: 2rem');
    });

    it('applies both width and height', () => {
      const { container } = render(<Skeleton width={100} height={50} />);
      const skeleton = container.querySelector('.skeleton');
      const style = skeleton?.getAttribute('style');
      expect(style).toContain('width: 100px');
      expect(style).toContain('height: 50px');
    });
  });

  describe('count', () => {
    it('renders single skeleton by default', () => {
      const { container } = render(<Skeleton />);
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBe(1);
    });

    it('renders multiple skeletons with count prop', () => {
      const { container } = render(<Skeleton count={5} />);
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBe(5);
    });

    it('renders correct count with other props', () => {
      const { container } = render(
        <Skeleton variant="text" count={3} width="80%" />
      );
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBe(3);
      skeletons.forEach(skeleton => {
        expect(skeleton.classList.contains('skeleton-text')).toBe(true);
        expect(skeleton.getAttribute('style')).toContain('width: 80%');
      });
    });
  });

  describe('className', () => {
    it('applies additional className', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.classList.contains('custom-class')).toBe(true);
    });

    it('combines variant and custom className', () => {
      const { container } = render(
        <Skeleton variant="circle" className="my-avatar" />
      );
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.classList.contains('skeleton-circle')).toBe(true);
      expect(skeleton?.classList.contains('my-avatar')).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('has aria-hidden attribute', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton?.getAttribute('aria-hidden')).toBe('true');
    });

    it('all elements have aria-hidden when count > 1', () => {
      const { container } = render(<Skeleton count={3} />);
      const skeletons = container.querySelectorAll('.skeleton');
      skeletons.forEach(skeleton => {
        expect(skeleton.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });
});

describe('SkeletonCard', () => {
  it('renders container with correct class', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.skeleton-card-container')).toBeDefined();
  });

  it('renders header by default', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('.skeleton');
    // 1 header + 3 default lines = 4
    expect(skeletons.length).toBe(4);
  });

  it('hides header when showHeader is false', () => {
    const { container } = render(<SkeletonCard showHeader={false} />);
    const skeletons = container.querySelectorAll('.skeleton');
    // 3 default lines only
    expect(skeletons.length).toBe(3);
  });

  it('renders specified number of lines', () => {
    const { container } = render(<SkeletonCard lines={5} />);
    const skeletons = container.querySelectorAll('.skeleton');
    // 1 header + 5 lines = 6
    expect(skeletons.length).toBe(6);
  });

  it('renders custom lines without header', () => {
    const { container } = render(<SkeletonCard showHeader={false} lines={2} />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(2);
  });

  it('has aria-hidden on container', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.querySelector('.skeleton-card-container');
    expect(card?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SkeletonAbilityCard', () => {
  it('renders with correct container class', () => {
    const { container } = render(<SkeletonAbilityCard />);
    expect(container.querySelector('.skeleton-ability-card')).toBeDefined();
  });

  it('renders circle skeleton for icon', () => {
    const { container } = render(<SkeletonAbilityCard />);
    expect(container.querySelector('.skeleton-circle')).toBeDefined();
  });

  it('renders content area with text skeletons', () => {
    const { container } = render(<SkeletonAbilityCard />);
    expect(container.querySelector('.skeleton-ability-content')).toBeDefined();
    const textSkeletons = container.querySelectorAll('.skeleton-text');
    expect(textSkeletons.length).toBeGreaterThan(0);
  });

  it('renders progress skeleton', () => {
    const { container } = render(<SkeletonAbilityCard />);
    expect(container.querySelector('.skeleton-progress')).toBeDefined();
  });

  it('renders action button skeleton', () => {
    const { container } = render(<SkeletonAbilityCard />);
    expect(container.querySelector('.skeleton-button')).toBeDefined();
  });

  it('has aria-hidden on container', () => {
    const { container } = render(<SkeletonAbilityCard />);
    const card = container.querySelector('.skeleton-ability-card');
    expect(card?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SkeletonClassCard', () => {
  it('renders with correct container class', () => {
    const { container } = render(<SkeletonClassCard />);
    expect(container.querySelector('.skeleton-class-card')).toBeDefined();
  });

  it('renders circle skeleton for icon', () => {
    const { container } = render(<SkeletonClassCard />);
    expect(container.querySelector('.skeleton-circle')).toBeDefined();
  });

  it('renders text skeletons for name and realm', () => {
    const { container } = render(<SkeletonClassCard />);
    const textSkeletons = container.querySelectorAll('.skeleton-text');
    expect(textSkeletons.length).toBe(2);
  });

  it('has aria-hidden on container', () => {
    const { container } = render(<SkeletonClassCard />);
    const card = container.querySelector('.skeleton-class-card');
    expect(card?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SkeletonAbilityTree', () => {
  it('renders section card container', () => {
    const { container } = render(<SkeletonAbilityTree />);
    expect(container.querySelector('.skeleton-section-card')).toBeDefined();
  });

  it('renders section header', () => {
    const { container } = render(<SkeletonAbilityTree />);
    expect(container.querySelector('.skeleton-section-header')).toBeDefined();
  });

  it('renders default 2 tree groups', () => {
    const { container } = render(<SkeletonAbilityTree />);
    const groups = container.querySelectorAll('.skeleton-tree-group');
    expect(groups.length).toBe(2);
  });

  it('renders custom number of groups', () => {
    const { container } = render(<SkeletonAbilityTree groupCount={4} />);
    const groups = container.querySelectorAll('.skeleton-tree-group');
    expect(groups.length).toBe(4);
  });

  it('renders default 3 ability cards per group', () => {
    const { container } = render(<SkeletonAbilityTree groupCount={1} />);
    const cards = container.querySelectorAll('.skeleton-ability-card');
    expect(cards.length).toBe(3);
  });

  it('renders custom cards per group', () => {
    const { container } = render(
      <SkeletonAbilityTree groupCount={1} cardsPerGroup={5} />
    );
    const cards = container.querySelectorAll('.skeleton-ability-card');
    expect(cards.length).toBe(5);
  });

  it('renders tree headers with icon and text', () => {
    const { container } = render(<SkeletonAbilityTree groupCount={1} />);
    const header = container.querySelector('.skeleton-tree-header');
    expect(header?.querySelector('.skeleton-circle')).toBeDefined();
    expect(header?.querySelectorAll('.skeleton-text').length).toBeGreaterThan(0);
  });

  it('has aria-hidden on container', () => {
    const { container } = render(<SkeletonAbilityTree />);
    const section = container.querySelector('.skeleton-section-card');
    expect(section?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SkeletonClassSelector', () => {
  it('renders section card container', () => {
    const { container } = render(<SkeletonClassSelector />);
    expect(container.querySelector('.skeleton-section-card')).toBeDefined();
  });

  it('renders section header', () => {
    const { container } = render(<SkeletonClassSelector />);
    expect(container.querySelector('.skeleton-section-header')).toBeDefined();
  });

  it('renders class grid', () => {
    const { container } = render(<SkeletonClassSelector />);
    expect(container.querySelector('.skeleton-class-grid')).toBeDefined();
  });

  it('renders default 6 class cards', () => {
    const { container } = render(<SkeletonClassSelector />);
    const cards = container.querySelectorAll('.skeleton-class-card');
    expect(cards.length).toBe(6);
  });

  it('renders custom number of class cards', () => {
    const { container } = render(<SkeletonClassSelector cardCount={9} />);
    const cards = container.querySelectorAll('.skeleton-class-card');
    expect(cards.length).toBe(9);
  });

  it('has aria-hidden on container', () => {
    const { container } = render(<SkeletonClassSelector />);
    const section = container.querySelector('.skeleton-section-card');
    expect(section?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SkeletonBuildSummary', () => {
  it('renders summary container', () => {
    const { container } = render(<SkeletonBuildSummary />);
    expect(container.querySelector('.skeleton-build-summary')).toBeDefined();
  });

  it('renders header with class info', () => {
    const { container } = render(<SkeletonBuildSummary />);
    const header = container.querySelector('.skeleton-summary-header');
    expect(header).toBeDefined();
    expect(header?.querySelector('.skeleton-circle')).toBeDefined();
  });

  it('renders multiple sections', () => {
    const { container } = render(<SkeletonBuildSummary />);
    const sections = container.querySelectorAll('.skeleton-summary-section');
    expect(sections.length).toBeGreaterThan(1);
  });

  it('renders stats grid', () => {
    const { container } = render(<SkeletonBuildSummary />);
    expect(container.querySelector('.skeleton-stats-grid')).toBeDefined();
  });

  it('renders stat items', () => {
    const { container } = render(<SkeletonBuildSummary />);
    const statItems = container.querySelectorAll('.skeleton-stat-item');
    expect(statItems.length).toBe(2);
  });

  it('renders progress skeleton for budget bar', () => {
    const { container } = render(<SkeletonBuildSummary />);
    expect(container.querySelector('.skeleton-progress')).toBeDefined();
  });

  it('has aria-hidden on container', () => {
    const { container } = render(<SkeletonBuildSummary />);
    const summary = container.querySelector('.skeleton-build-summary');
    expect(summary?.getAttribute('aria-hidden')).toBe('true');
  });
});
