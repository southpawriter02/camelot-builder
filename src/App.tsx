import { useState, useMemo, useCallback } from 'react';
import type { IAbility, IClass } from './types';
import { Build } from './core/build';
import { ClassSelector } from './components/ClassSelector';
import { AbilityTree } from './components/AbilityTree';
import { BuildSummary } from './components/BuildSummary';
import './App.css';

// Import the raw JSON data (cast to proper types)
import classesData from './data/classes.json';
import abilitiesData from './data/abilities.json';

function App() {
  // Memoize the data so it's not re-processed on every render (cast to proper types)
  const allAbilities = useMemo(() => abilitiesData as unknown as Record<string, IAbility>, []);
  const allClasses = useMemo(() => classesData as unknown as IClass[], []);

  // The main state of the application: the character build
  const [build, setBuild] = useState<Build>(new Build());

  const handleClassSelect = useCallback((selectedClass: IClass) => {
    // Create a new Build instance when the class changes
    setBuild(new Build(selectedClass));
  }, []);

  const handlePurchaseAbility = useCallback((ability: IAbility) => {
    setBuild(prevBuild => prevBuild.purchaseAbility(ability));
  }, []);

  const handleRemoveAbility = useCallback((ability: IAbility) => {
    setBuild(prevBuild => prevBuild.removeAbilityRank(ability));
  }, []);

  const handleResetBuild = useCallback(() => {
    if (build.characterClass) {
      setBuild(new Build(build.characterClass));
    }
  }, [build.characterClass]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Camelot Builder</h1>
        <p className="app-subtitle">Dark Age of Camelot Realm Ability Calculator</p>
      </header>

      {/* Main Content */}
      <div className="app-content">
        {/* Main Panel */}
        <main className="main-panel">
          <ClassSelector
            classes={allClasses}
            selectedClass={build.characterClass}
            onClassSelect={handleClassSelect}
          />
          <AbilityTree
            allAbilities={allAbilities}
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
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
