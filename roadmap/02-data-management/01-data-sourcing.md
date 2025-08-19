# Feature: Data Sourcing

## 1. Description

The foundation of the Camelot Builder is its data. This feature covers the crucial task of gathering all necessary information about classes, Realm Abilities, and game mechanics. The accuracy and completeness of this data will directly impact the tool's quality and usefulness.

## 2. Intended Functionality

*   To create a comprehensive and accurate database of all information required by the calculator.
*   This is a preparatory, non-functional task that enables the core features of the application.

## 3. Requirements

*   **Data to be Sourced:**
    *   A complete list of all playable classes, grouped by realm.
    *   For each class, a complete list of all available Realm Abilities.
    *   For each ability, the following information is needed:
        *   Name and description.
        *   The RA tree it belongs to (e.g., "Augment Dexterity").
        *   The cost in Realm Points for each rank.
        *   Any prerequisites (e.g., other abilities, character level).
        *   Any class-specific restrictions.
*   **Potential Data Sources:**
    *   **Official Game Documentation:** The most reliable source, if available and up-to-date.
    *   **Community Wikis:** Resources like the "DAoC Wiki" are often well-maintained by players.
    *   **Third-Party Tools:** Existing (but perhaps outdated) calculators or databases may provide a starting point.
    *   **Manual In-Game Verification:** The ultimate source of truth. This will be time-consuming but necessary for verification.

## 4. Limitations

*   **Data Accuracy:** Community-sourced data may contain errors or be outdated. All data must be cross-referenced and, if possible, verified in-game.
*   **Game Patches:** The game data is not static. A plan must be in place to update the data as Dark Age of Camelot is patched. For the initial version, we will target a specific patch version.

## 5. Dependencies

*   This is a foundational task and does not have dependencies, but nearly all other features depend on its completion.
*   **[Data Structure](./02-data-structure.md):** The sourced data will need to be formatted to fit the defined data structure.
