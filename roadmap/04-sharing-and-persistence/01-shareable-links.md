# Feature: Shareable Links

## 1. Description

The ability to share builds is arguably one of the most important features for a tool like this. This feature involves encoding the entire state of a build into a unique URL. When another user opens this URL, the calculator will load with the exact same build, allowing for seamless sharing and discussion.

## 2. Intended Functionality

*   **URL Generation:** As a user modifies their build, the application will automatically update the URL in the browser's address bar. This is typically done using URL parameters or the hash fragment.
*   **URL Loading:** When the application loads, it will check for the presence of build data in the URL. If found, it will parse this data and initialize the calculator's state with it.
*   **"Share" Button:** A dedicated "Share" or "Copy Link" button will be available, making it easy for users to copy the unique URL to their clipboard.

## 3. Requirements

*   **Encoding/Decoding Logic:** A set of functions to convert the build state (class, spent points) into a compact string representation, and vice-versa.
*   **URL-safe String:** The encoding must produce a string that is safe to include in a URL. Base64 or a similar encoding is a good candidate.
*   **Frontend Routing:** The application's routing system must be able to handle these custom URLs.

## 4. Example

A user creates a build for a Cleric. The generated URL might look something like this:

`https://camelot-builder.com/#class=cleric&build=A_COMPACT_ENCODED_STRING_REPRESENTING_THE_BUILD`

## 5. Limitations

*   **URL Length:** Very complex builds could potentially lead to very long URLs. The chosen encoding method should be as efficient as possible to keep the URL length reasonable. Browsers have limits on URL length, although they are typically very high.
*   **Backward Compatibility:** If the data structure or encoding scheme changes in the future, a mechanism may be needed to support old links, or they may become invalid.

## 6. Dependencies

*   **[RA Point Allocation](../01-core-functionality/02-ra-point-allocation.md):** The shareable link is a representation of the state managed by the point allocation system.
*   **[Data Structure](../02-data-management/02-data-structure.md):** The encoding scheme will be tightly coupled to the data structure. For example, it might use ability IDs or indices from the data files.
