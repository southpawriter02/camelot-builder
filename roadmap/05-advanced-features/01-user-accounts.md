# Feature: User Accounts

## 1. Description

To move beyond the limitations of local storage and shareable links, user accounts provide a persistent, centralized way for users to manage their builds. Users can sign up, log in, and save multiple builds to their profile, giving them a permanent library of their theorycrafting creations.

## 2. Intended Functionality

*   **Authentication:** Users can sign up and log in, likely using a third-party provider like Google, Discord, or GitHub to simplify the process (OAuth).
*   **Saved Builds:** An authenticated user will have a dashboard or profile page where they can see a list of their saved builds.
*   **Named Builds:** Users can give their builds custom names (e.g., "My Solo Leveling Spec," "RVR Group Template") for easy identification.
*   **CRUD Operations:** Users can Create, Read, Update, and Delete their saved builds.
*   **Cross-Device Access:** Since builds are saved to a central database, users can access their builds from any device.

## 3. Requirements

*   **Backend Server:** This is the first feature that requires a dedicated backend server and database.
*   **Database:** A database (e.g., PostgreSQL, MongoDB) to store user information and their saved builds.
*   **Authentication Service:** Integration with an authentication service (e.g., Auth0, Firebase Auth, or a custom implementation with Passport.js).
*   **API:** A secure API for the frontend to communicate with the backend (e.g., to save or load builds).

## 4. Limitations

*   **Complexity:** This feature represents a significant increase in complexity for the project, introducing a backend, a database, and authentication.
*   **Cost:** Running a server and database incurs hosting costs, whereas the core calculator can be a purely static site hosted for free.
*   **Privacy:** Handling user data requires a privacy policy and adherence to data protection regulations.

## 5. Dependencies

*   This feature is largely self-contained but would enhance almost every other part of the application. It would replace **[Local Storage Persistence](../04-sharing-and-persistence/02-local-storage-persistence.md)** for authenticated users.
