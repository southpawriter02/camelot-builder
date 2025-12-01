import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { IAbility, IClass } from './types';
import { Build } from './core/build';
import { BuildHistory } from './core/history';
import { saveBuild, loadBuild } from './core/storage';
import { getBuildShareUrl, getBuildFromUrl, decodeBuild, clearBuildFromUrl } from './core/sharing';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ClassSelector } from './components/ClassSelector';
import { AbilityTree } from './components/AbilityTree';
import { BuildSummary } from './components/BuildSummary';
import { ActionBar } from './components/ActionBar';
import { Toast, useToast } from './components/Toast';
import { SearchFilter } from './components/SearchFilter';
import type { SearchFilterRef } from './components/SearchFilter';
import './App.css';

// Import the raw JSON data (cast to proper types)
import classesData from './data/classes.json';
import abilitiesData from './data/abilities.json';

// Default point budget for builds
const DEFAULT_POINT_BUDGET = 100;

function App() {
  // Memoize the data so it's not re-processed on every render (cast to proper types)
  const allAbilities = useMemo(() => abilitiesData as unknown as Record<string, IAbility>, []);
  const allClasses = useMemo(() => classesData as unknown as IClass[], []);

  // Build history for undo/redo
  const [history, setHistory] = useState<BuildHistory>(() => {
    // Try to load from URL first, then localStorage
    const urlCode = getBuildFromUrl();
    if (urlCode) {
      const urlBuild = decodeBuild(urlCode, allClasses);
      if (urlBuild) {
        // Recalculate spent points from abilities
        const recalculatedBuild = recalculatePoints(urlBuild, allAbilities);
        clearBuildFromUrl();
        return new BuildHistory(recalculatedBuild);
      }
    }

    const savedBuild = loadBuild(allClasses);
    if (savedBuild) {
      return new BuildHistory(savedBuild);
    }

    return new BuildHistory(new Build());
  });

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<SearchFilterRef>(null);

  // Toast notifications
  const toast = useToast();

  // Get current build from history
  const build = history.getCurrent();

  // Save build to localStorage whenever it changes
  useEffect(() => {
    saveBuild(build);
  }, [build]);

  // Helper to recalculate points from purchased abilities
  function recalculatePoints(build: Build, abilities: Record<string, IAbility>): Build {
    let totalPoints = 0;
    for (const [abilityId, rank] of Object.entries(build.purchasedAbilities)) {
      const ability = abilities[abilityId];
      if (ability) {
        for (let r = 1; r <= rank; r++) {
          const rankData = ability.ranks.find(rd => rd.rank === r);
          if (rankData) {
            totalPoints += rankData.cost;
          }
        }
      }
    }
    return new Build(build.characterClass, totalPoints, build.purchasedAbilities);
  }

  const handleClassSelect = useCallback((selectedClass: IClass) => {
    // Create a new Build instance when the class changes (reset history)
    const newBuild = new Build(selectedClass);
    setHistory(history.reset(newBuild));
    setSearchQuery(''); // Clear search when class changes
  }, [history]);

  const handlePurchaseAbility = useCallback((ability: IAbility) => {
    const newBuild = build.purchaseAbility(ability);
    if (newBuild !== build) {
      setHistory(history.push(newBuild));
    }
  }, [build, history]);

  const handleRemoveAbility = useCallback((ability: IAbility) => {
    const newBuild = build.removeAbilityRank(ability);
    if (newBuild !== build) {
      setHistory(history.push(newBuild));
    }
  }, [build, history]);

  const handleResetBuild = useCallback(() => {
    if (build.characterClass && build.abilityCount > 0) {
      const newBuild = new Build(build.characterClass);
      setHistory(history.push(newBuild));
      toast.info('Build reset');
    }
  }, [build.characterClass, build.abilityCount, history, toast]);

  const handleUndo = useCallback(() => {
    if (history.canUndo()) {
      setHistory(history.undo());
      toast.info('Undid last change');
    }
  }, [history, toast]);

  const handleRedo = useCallback(() => {
    if (history.canRedo()) {
      setHistory(history.redo());
      toast.info('Redid last change');
    }
  }, [history, toast]);

  const handleShare = useCallback(async () => {
    if (!build.characterClass) {
      toast.error('Select a class first to share');
      return;
    }

    const url = getBuildShareUrl(build);
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Build link copied to clipboard!');
    } catch {
      // Fallback for browsers that don't support clipboard API
      toast.info('Share URL: ' + url);
    }
  }, [build, toast]);

  const handleFocusSearch = useCallback(() => {
    searchRef.current?.focus();
  }, []);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onReset: handleResetBuild,
    onShare: handleShare,
    onSearch: handleFocusSearch,
  });

  // Calculate remaining points
  const remainingPoints = DEFAULT_POINT_BUDGET - build.spentPoints;

  // Filter abilities based on search query
  const filteredAbilities = useMemo(() => {
    if (!searchQuery.trim()) {
      return allAbilities;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, IAbility> = {};

    for (const [id, ability] of Object.entries(allAbilities)) {
      if (
        ability.name.toLowerCase().includes(query) ||
        ability.tree.toLowerCase().includes(query)
      ) {
        filtered[id] = ability;
      }
    }

    return filtered;
  }, [allAbilities, searchQuery]);

  // Count available abilities for current class
  const availableAbilityCount = useMemo(() => {
    if (!build.characterClass) return { filtered: 0, total: 0 };

    let filtered = 0;
    let total = 0;

    for (const ability of Object.values(allAbilities)) {
      if (build.characterClass.ra_trees.includes(ability.tree)) {
        total++;
        if (filteredAbilities[ability.id]) {
          filtered++;
        }
      }
    }

    return { filtered, total };
  }, [build.characterClass, allAbilities, filteredAbilities]);

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <Toast toasts={toast.toasts} onDismiss={toast.dismissToast} />

      {/* Header */}
      <header className="app-header">
        <h1>Camelot Builder</h1>
        <p className="app-subtitle">Dark Age of Camelot Realm Ability Calculator</p>
      </header>

      {/* Action Bar */}
      <div className="app-action-bar">
        <ActionBar
          canUndo={history.canUndo()}
          canRedo={history.canRedo()}
          canReset={build.abilityCount > 0}
          canShare={build.characterClass !== null}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={handleResetBuild}
          onShare={handleShare}
          undoCount={history.undoCount()}
          redoCount={history.redoCount()}
        />
      </div>

      {/* Main Content */}
      <div className="app-content">
        {/* Main Panel */}
        <main className="main-panel">
          <ClassSelector
            classes={allClasses}
            selectedClass={build.characterClass}
            onClassSelect={handleClassSelect}
          />

          {/* Search Filter - only show when class is selected */}
          {build.characterClass && (
            <SearchFilter
              ref={searchRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search abilities by name or tree..."
              resultCount={availableAbilityCount.filtered}
              totalCount={availableAbilityCount.total}
            />
          )}

          <AbilityTree
            allAbilities={filteredAbilities}
            build={build}
            onPurchaseAbility={handlePurchaseAbility}
            onRemoveAbility={handleRemoveAbility}
          />
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <BuildSummary
            build={build}
            allAbilities={allAbilities}
            onResetBuild={handleResetBuild}
            pointBudget={DEFAULT_POINT_BUDGET}
            remainingPoints={remainingPoints}
          />
        </aside>
      </div>

      {/* Keyboard Shortcuts Help */}
      <footer className="app-footer">
        <div className="keyboard-hints">
          <span><kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo</span>
          <span><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> Redo</span>
          <span><kbd>/</kbd> Search</span>
          <span><kbd>S</kbd> Share</span>
          <span><kbd>R</kbd> Reset</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
