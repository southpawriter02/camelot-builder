# Feature: RA Point Allocation

## 1. Description

This is the core interactive component of the Camelot Builder. Users will spend their available Realm Points (RPs) on various abilities within the Realm Ability (RA) trees specific to their chosen class. The interface must be intuitive, providing immediate feedback on the user's choices.

## 2. Intended Functionality

*   Users can click on an ability to spend points in it.
*   The number of available RPs decreases as points are spent.
*   The UI should clearly indicate the rank of each purchased ability.
*   Users can remove points from an ability, refunding the RPs.
*   The system must respect the point costs of each ability rank.
*   Tooltips or a detail pane will show information about each ability, including its description, cost, and prerequisites.

## 3. Requirements

*   **UI:** A visual representation of the RA trees for the selected class.
*   **Interactivity:** Click or tap events to add/remove points from abilities.
*   **State Management:** The application must track:
    *   Total RPs available.
    *   Spent RPs.
    *   The rank of each purchased ability.
*   **Feedback:** The UI must update in real-time to reflect changes in spent points and ability ranks.

## 4. Limitations

*   The initial version may not include a "RA training planner" that suggests what order to train abilities. It will be a pure sandbox calculator.
*   Complex, multi-faceted abilities (e.g., those with scaling effects) will need careful data modeling to be displayed correctly.

## 5. Dependencies

*   **[Class Selection](./01-class-selection.md):** A class must be selected to display the correct RA trees.
*   **[Build Validation](./03-build-validation.md):** The point allocation system must work in tandem with the validation engine to prevent illegal builds.
*   **[Data Structure](../02-data-management/02-data-structure.md):** The functionality is highly dependent on a well-structured data model for abilities, costs, and prerequisites.
