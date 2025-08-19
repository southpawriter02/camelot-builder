# Feature: Popular Builds

## 1. Description

To make the Camelot Builder a true community hub, this feature would introduce a system for showcasing popular, effective, or interesting builds for each class. This helps new players get started and provides a platform for veteran players to share their knowledge.

## 2. Intended Functionality

*   **Public Builds:** Users with accounts can choose to make one of their saved builds "public."
*   **Voting System:** The community can upvote public builds they find effective or well-designed.
*   **"Popular Builds" Page:** A dedicated section of the site where users can browse the top-voted public builds, filterable by class.
*   **Build Descriptions:** When making a build public, the author can add a description to explain the build's purpose, strengths, and weaknesses.
*   **Comments/Discussion:** (Very advanced) A comment system could be added to each public build, allowing for community discussion.

## 3. Requirements

*   **User Accounts:** This feature is entirely dependent on the User Accounts system.
*   **Backend Logic:** The backend needs to handle:
    *   Marking builds as public.
    *   Storing votes and associating them with builds.
    *   Calculating and ranking builds by popularity.
*   **New UI:** A new section of the frontend application for browsing and viewing these public builds.

## 4. Limitations

*   **Moderation:** A popular builds section could be subject to "troll" builds or low-quality submissions. Some level of moderation or community reporting might be necessary.
*   **"Meta" Stagnation:** This feature could inadvertently promote a single "meta" build for each class, discouraging experimentation. The design should consider how to showcase a variety of builds, not just the single most popular one.
*   **Patch Invalidation:** Builds may become outdated or obsolete when the game is patched. The system should show which patch version a build was created for.

## 5. Dependencies

*   **[User Accounts](./01-user-accounts.md):** A hard dependency. Users must have an account to create a public build.
