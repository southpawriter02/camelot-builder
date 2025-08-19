import React, { useState, useMemo } from 'react';
import { IAbility, IClass } from './types';
import { Build } from './core/build';
import { ClassSelector } from './components/ClassSelector';
import { AbilityTree } from './components/AbilityTree';
import { BuildSummary } from './components/BuildSummary';

// Import the raw JSON data
import ALL_CLASSES from './data/classes.json';
import ALL_ABILITIES from './data/abilities.json';

function App() {
  // Memoize the data so it's not re-processed on every render
  const allAbilities: Record<string, IAbility> = useMemo(() => ALL_ABILITIES, []);
  const allClasses: IClass[] = useMemo(() => ALL_CLASSES, []);

  // The main state of the application: the character build
  const [build, setBuild] = useState<Build>(new Build());

  const handleClassSelect = (selectedClass: IClass) => {
    // Create a new Build instance when the class changes
    setBuild(new Build(selectedClass));
  };

  const handlePurchaseAbility = (ability: IAbility) => {
    const newBuild = build.purchaseAbility(ability);
    // The purchaseAbility method returns a new instance only on success.
    // So we can just set the new build state.
    setBuild(newBuild);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Camelot Builder</h1>
      <ClassSelector
        classes={allClasses}
        selectedClass={build.characterClass}
        onClassSelect={handleClassSelect}
      />
      <AbilityTree
        allAbilities={allAbilities}
        build={build}
        onPurchaseAbility={handlePurchaseAbility}
      />
      <BuildSummary build={build} />
    </div>
  );
}

export default App;
