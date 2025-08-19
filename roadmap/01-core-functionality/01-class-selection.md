# Feature: Class Selection

## 1. Description

The first interaction a user has with the calculator is selecting their character's class. This choice is fundamental as it dictates which Realm Abilities are available to them. The class selection interface must be clear, intuitive, and comprehensive, covering all classes from all three realms.

## 2. Intended Functionality

*   The user should be presented with a list of all playable classes in Dark Age of Camelot.
*   Classes should be grouped by realm (Albion, Midgard, Hibernia) to aid in navigation.
*   Selecting a class will load the corresponding Realm Ability trees and point allocation interface.
*   The user should be able to easily switch between classes to compare different builds.

## 3. Requirements

*   **UI Element:** A dropdown menu, a set of tabs, or a grid of selectable cards to represent the classes.
*   **Data:** A structured list of all classes, organized by realm.
*   **State Management:** The application state must update to reflect the currently selected class. This will trigger a re-render of the RA ability trees.

## 4. Limitations

*   This feature is dependent on the `Data Sourcing` feature to have a complete and accurate list of classes.
*   Initially, this will only support the base classes. Race-specific or alternative starting classes (if any) will be considered a future enhancement.

## 5. Dependencies

*   **[Data Sourcing](../02-data-management/01-data-sourcing.md):** An accurate list of all DAoC classes is required.
*   **[RA Point Allocation](./02-ra-point-allocation.md):** The class selection must trigger the display of the correct RA trees.
