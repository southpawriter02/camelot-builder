# Feature: Build Summary

## 1. Description

While the interactive RA trees are for building, the Build Summary is for reviewing. It's a dedicated section of the UI that provides a clean, organized, and at-a-glance overview of the user's current build. This is essential for understanding the total impact of the chosen abilities.

## 2. Intended Functionality

*   **Persistent View:** The summary should be persistently visible on the screen, likely in a sidebar, updating in real-time as the user allocates points.
*   **Key Metrics:** It should display the most important numbers:
    *   Total Realm Points available.
    *   Realm Points spent.
    *   Remaining Realm Points.
    *   Character level (if this becomes a configurable option).
*   **Purchased Abilities List:** A simple, readable list of all abilities the user has purchased, along with their current rank.
*   **Aggregated Bonuses:** (Stretch Goal for this feature) A section that sums up all passive bonuses from the purchased abilities. For example:
    *   Total Strength: +35
    *   Total Parry: +10%
    *   Total Power Pool: +15%
*   **Copy/Export:** A button to copy the summary to the clipboard as plain text, making it easy to share on forums or Discord.

## 3. Requirements

*   **UI Component:** A dedicated `BuildSummary` component in the frontend codebase.
*   **State Subscription:** This component must be subscribed to the application's state and re-render whenever the build changes.
*   **Clear Formatting:** The layout and typography must be exceptionally clear and easy to read.

## 4. Limitations

*   **Complexity of Bonuses:** Aggregating bonuses can be complex. Some bonuses are simple stat increases, while others are situational or grant new capabilities. The initial version may stick to a simple list of purchased abilities, with bonus aggregation as a follow-up enhancement.

## 5. Dependencies

*   **[RA Point Allocation](../01-core-functionality/02-ra-point-allocation.md):** The summary is a direct reflection of the point allocation state.
*   **[Data Structure](../02-data-management/02-data-structure.md):** The summary relies on the data being structured in a way that makes it easy to list abilities and their effects.
