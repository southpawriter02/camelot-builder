# Feature: Local Storage Persistence

## 1. Description

To enhance user convenience, the Camelot Builder will automatically save the user's current work-in-progress build to their browser's local storage. When the user returns to the site later, their previous build will be automatically reloaded, allowing them to pick up right where they left off.

## 2. Intended Functionality

*   **Automatic Saving:** The application will automatically save the current build state to local storage whenever a change is made. This should be a lightweight operation.
*   **Automatic Loading:** When the application starts, it will check local storage for a saved build. If one exists, it will load it.
*   **Clear/Reset Button:** A user interface element (e.g., a "Start New Build" button) will allow the user to clear the saved state and start fresh.
*   **URL Priority:** If the application is loaded with a shareable link, the build from the URL should take precedence over the build saved in local storage.

## 3. Requirements

*   **Local Storage API:** Use of the standard web `localStorage` API.
*   **State Serialization:** The application's state needs to be serialized into a string (likely JSON) before being saved to local storage.
*   **Throttling/Debouncing:** To avoid performance issues from saving on every single click, the save operation should be throttled or debounced so it only runs, for example, once every few seconds.

## 4. Limitations

*   **Browser-Specific:** Local storage is specific to the browser and device. A user's build will not be synced across their laptop and phone.
*   **Data Loss:** Users can manually clear their browser data, which would delete their saved build. This feature is for convenience, not for permanent, guaranteed storage. This should be communicated to the user.
*   **Storage Limits:** Local storage has a size limit (usually around 5-10 MB), but this is more than enough for storing a build state.

## 5. Dependencies

*   **[RA Point Allocation](../01-core-functionality/02-ra-point-allocation.md):** The state being saved is the same state managed by the point allocation system.
*   **[Shareable Links](./01-shareable-links.md):** The logic needs to correctly prioritize loading from a URL over loading from local storage.
