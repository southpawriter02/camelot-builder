# Feature: Build Validation

## 1. Description

The build validation engine is the "rules lawyer" of the Camelot Builder. It works in the background to ensure that any build a user creates is valid according to the game's mechanics. This prevents users from creating impossible or illegal character specializations.

## 2. Intended Functionality

*   The system should prevent users from spending more Realm Points than they have available.
*   It must enforce all prerequisite rules (e.g., requiring Rank 2 of "Ability A" before allowing points in "Ability B").
*   It must respect any class-specific restrictions on abilities.
*   The UI should provide clear, non-intrusive feedback when a user attempts an invalid action. For example, disabling or graying out abilities that are not yet available.
*   The validation should happen in real-time as the user interacts with the calculator.

## 3. Requirements

*   **Logic Engine:** A set of functions that can evaluate the current build against the game's rules.
*   **Data-Driven:** The validation logic should be driven by the data model (e.g., the `prerequisites` field in the ability data). This avoids hard-coding rules.
*   **UI Feedback:** The UI must be able to visually represent the validation status (e.g., enabled/disabled buttons, warning messages).

## 4. Limitations

*   The accuracy of the validation is entirely dependent on the accuracy of the sourced data. Any errors in the data will lead to incorrect validation.
*   Some obscure or complex rules may be difficult to model and might be implemented in a later iteration. The focus for the MVP is on the most common and critical rules.

## 5. Dependencies

*   **[RA Point Allocation](./02-ra-point-allocation.md):** The validation engine is directly tied to the process of spending points.
*   **[Data Structure](../02-data-management/02-data-structure.md):** The validation rules must be encoded into the data structure for abilities. For example, an ability might have a `prerequisites` array.
