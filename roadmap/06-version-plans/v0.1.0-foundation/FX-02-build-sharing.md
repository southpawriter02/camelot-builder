# FX-02: Build Sharing

**Feature ID:** FX-02
**Status:** Complete
**Priority:** High
**Category:** Functional UX

---

## Overview

Build Sharing enables users to generate shareable URLs that encode their complete build configuration, allowing them to share builds with others or save links for later reference.

### User Story

> As a player, I want to share my build with friends by sending them a URL that loads my exact configuration.

---

## Implementation Details

### Primary File
`src/core/sharing.ts`

### Exported Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `encodeBuild(build)` | Encodes build to base64 string | `string` |
| `decodeBuild(encoded, allClasses)` | Decodes string back to Build | `Build \| null` |
| `getBuildShareUrl(build)` | Gets full URL with encoded build | `string` |
| `getBuildFromUrl()` | Extracts build code from current URL | `string \| null` |
| `clearBuildFromUrl()` | Removes build hash from URL | `void` |

### URL Format

```
https://example.com/#build=<base64-encoded-json>
```

### Encoded Data Structure

```typescript
{
  c: string | null,  // Compressed class: "A:Cleric" or "M:Shaman" or "H:Druid"
  a: PurchasedAbilities  // { abilityId: rank }
}
```

### Realm Compression Map

| Realm | Code |
|-------|------|
| Albion | A |
| Midgard | M |
| Hibernia | H |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Share Button Click                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     sharing.ts                               │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   encodeBuild()                      │    │
│  │                                                      │    │
│  │  Build → { c: "A:Cleric", a: {...} } → JSON → btoa() │    │
│  └──────────────────────────┬──────────────────────────┘    │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐    │
│  │                  getBuildShareUrl()                  │    │
│  │                                                      │    │
│  │  current URL + "#build=" + encoded string            │    │
│  └──────────────────────────┬──────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Clipboard                               │
│  https://example.com/#build=eyJjIjoiQTpDbGVyaWMiLCJhIjp7fX0= │
└─────────────────────────────────────────────────────────────┘
```

### Decode Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    URL with #build=...                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     sharing.ts                               │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   getBuildFromUrl()                  │    │
│  │                                                      │    │
│  │  Extract base64 string from hash using regex         │    │
│  │  Pattern: /build=([A-Za-z0-9+/=]+)/                  │    │
│  └──────────────────────────┬──────────────────────────┘    │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐    │
│  │                   decodeBuild()                      │    │
│  │                                                      │    │
│  │  atob() → JSON.parse() → Find class → Build         │    │
│  └──────────────────────────┬──────────────────────────┘    │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐    │
│  │                  clearBuildFromUrl()                 │    │
│  │                                                      │    │
│  │  history.replaceState() to clean URL                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree

### Share Flow

```
                    ┌─────────────────┐
                    │  User clicks    │
                    │  Share button   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Has class       │
                    │ selected?       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ No                          │ Yes
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Encode with     │           │ Encode with     │
    │ c: null         │           │ c: "R:ClassName"│
    └────────┬────────┘           └────────┬────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                   ┌────────▼────────┐
                   │ Generate URL    │
                   │ with hash       │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │ Copy to         │
                   │ clipboard       │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │ Show toast      │
                   │ notification    │
                   └─────────────────┘
```

### Load Flow

```
                    ┌─────────────────┐
                    │  Page loads     │
                    │  with URL hash  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ getBuildFromUrl │
                    │ returns code?   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ No                          │ Yes
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ Fall back to    │           │ decodeBuild()   │
    │ localStorage    │           │                 │
    │ (FX-01)         │           └────────┬────────┘
    └─────────────────┘                    │
                                ┌──────────┼──────────┐
                                │ Success            │ Fail
                                ▼                    ▼
                      ┌─────────────────┐  ┌─────────────────┐
                      │ Load build      │  │ console.error   │
                      │ Clear URL hash  │  │ Fall back       │
                      │ Initialize      │  │ to fresh build  │
                      └─────────────────┘  └─────────────────┘
```

---

## Integration Points

### Inbound Dependencies
- `Build` class from `src/core/build.ts`
- `IClass` type from `src/types/index.ts`
- `PurchasedAbilities` type from `src/core/build.ts`

### Outbound Integration
- Used by `App.tsx` on mount (URL loading)
- Used by `ActionBar.tsx` share button
- Uses `navigator.clipboard` for copy

### Related Features
| Feature | Relationship |
|---------|--------------|
| FX-01 Build Persistence | Share URL takes precedence over localStorage |
| SM-02 Toast Notifications | Shows "Copied to clipboard" feedback |

---

## Workflow Diagram

### Share Workflow

```
User Action              System Response
───────────────────────────────────────────────────────
Click "Share" button →   getBuildShareUrl(build)
                         │
                         ▼
                    encodeBuild(build)
                         │
                    ┌────┴────────────────────────┐
                    │ Compress class:              │
                    │ "Cleric" + "Albion" → "A:C" │
                    │                              │
                    │ Include abilities:           │
                    │ { ability1: 2, ability2: 1 } │
                    └────┬────────────────────────┘
                         │
                         ▼
                    JSON.stringify()
                         │
                         ▼
                    btoa() → Base64
                         │
                         ▼
                    Construct URL:
                    https://.../#build=eyJ...
                         │
                         ▼
                    navigator.clipboard.writeText()
                         │
                         ▼
                    Show toast: "Link copied!"
```

### Receive Workflow

```
URL Navigation           System Response
───────────────────────────────────────────────────────
User opens shared URL →  App.tsx useEffect
                         │
                         ▼
                    getBuildFromUrl()
                         │
                    ┌────┴────────────────────────┐
                    │ Extract from hash:           │
                    │ #build=eyJ...                │
                    │                              │
                    │ Match: /build=([A-Za-z...])/ │
                    └────┬────────────────────────┘
                         │
                         ▼
                    decodeBuild(encoded, classes)
                         │
                    ┌────┴────────────────────────┐
                    │ atob() → JSON               │
                    │                              │
                    │ Parse "A:Cleric":            │
                    │ realm = realmMap["A"]       │
                    │ name = "Cleric"             │
                    │                              │
                    │ Find class in allClasses    │
                    └────┬────────────────────────┘
                         │
                         ▼
                    new Build(class, 0, abilities)
                         │
                         ▼
                    clearBuildFromUrl()
                    (Clean URL for bookmarking)
                         │
                         ▼
                    recalculatePoints()
                    (Verify cost from ability data)
                         │
                         ▼
                    Initialize history with build
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('sharing', () => {
  const mockClasses: IClass[] = [
    { name: 'Cleric', realm: 'Albion', ra_trees: [] },
    { name: 'Shaman', realm: 'Midgard', ra_trees: [] },
  ];

  test('encodeBuild produces base64 string', () => {
    const build = new Build(mockClasses[0], 10, { ability1: 2 });
    const encoded = encodeBuild(build);

    expect(encoded).toBeTruthy();
    expect(() => atob(encoded)).not.toThrow();
  });

  test('encodeBuild compresses realm correctly', () => {
    const build = new Build(mockClasses[0], 0, {});
    const encoded = encodeBuild(build);
    const decoded = JSON.parse(atob(encoded));

    expect(decoded.c).toBe('A:Cleric');
  });

  test('decodeBuild restores build from encoded string', () => {
    const original = new Build(mockClasses[0], 10, { ability1: 2 });
    const encoded = encodeBuild(original);
    const restored = decodeBuild(encoded, mockClasses);

    expect(restored?.characterClass?.name).toBe('Cleric');
    expect(restored?.purchasedAbilities).toEqual({ ability1: 2 });
  });

  test('decodeBuild returns null for invalid input', () => {
    expect(decodeBuild('invalid-base64!!!', mockClasses)).toBeNull();
    expect(decodeBuild('', mockClasses)).toBeNull();
  });

  test('decodeBuild handles missing class gracefully', () => {
    const encoded = btoa(JSON.stringify({ c: 'X:Unknown', a: {} }));
    const result = decodeBuild(encoded, mockClasses);

    expect(result?.characterClass).toBeNull();
  });

  test('getBuildFromUrl extracts code from hash', () => {
    window.location.hash = '#build=eyJjIjpudWxsLCJhIjp7fX0=';

    const code = getBuildFromUrl();
    expect(code).toBe('eyJjIjpudWxsLCJhIjp7fX0=');
  });

  test('getBuildFromUrl returns null when no build in hash', () => {
    window.location.hash = '#other=value';

    expect(getBuildFromUrl()).toBeNull();
  });
});
```

### Integration Tests

```typescript
describe('sharing integration', () => {
  test('full share → load cycle', () => {
    // Create original build
    const original = new Build(cleric, 15, { augment_dex: 3 });

    // Generate share URL
    const shareUrl = getBuildShareUrl(original);
    expect(shareUrl).toContain('#build=');

    // Simulate navigation to shared URL
    window.location.hash = new URL(shareUrl).hash;

    // Load from URL
    const code = getBuildFromUrl();
    const restored = decodeBuild(code!, allClasses);

    expect(restored?.characterClass?.name).toBe('Cleric');
    expect(restored?.purchasedAbilities.augment_dex).toBe(3);
  });
});
```

---

## Deliverable Checklist

### Implementation
- [x] `encodeBuild()` with realm compression
- [x] `decodeBuild()` with realm expansion
- [x] `getBuildShareUrl()` URL construction
- [x] `getBuildFromUrl()` hash extraction
- [x] `clearBuildFromUrl()` URL cleanup
- [x] Integration with App.tsx
- [x] Integration with ActionBar share button

### Testing
- [ ] Unit tests for encode/decode
- [ ] Unit tests for URL functions
- [ ] Integration test for full cycle
- [ ] Edge case tests (invalid input)

### Edge Cases Handled
- [x] No class selected → `c: null`
- [x] Empty abilities → `a: {}`
- [x] Invalid base64 → Returns null
- [x] Missing class → Returns build with null class
- [x] No hash in URL → Returns null

---

## Known Issues & Future Improvements

### Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No checksum/validation | Corrupted URLs fail silently | Medium |
| No versioning in encoded data | Old URLs may break with schema changes | Medium |
| No error feedback to user | User doesn't know if load failed | Low |

### Future Enhancements

1. **URL Versioning** (v0.2.0+)
   ```typescript
   const data = {
     v: 1,  // Schema version
     c: build.characterClass ? `${realm[0]}:${name}` : null,
     a: build.purchasedAbilities,
   };
   ```

2. **Checksum Validation**
   ```typescript
   function addChecksum(encoded: string): string {
     const hash = simpleHash(encoded);
     return `${encoded}:${hash}`;
   }

   function validateChecksum(data: string): string | null {
     const [encoded, hash] = data.split(':');
     if (simpleHash(encoded) !== hash) return null;
     return encoded;
   }
   ```

3. **Short URLs** (v1.0+)
   - Server-side short URL service
   - `https://camelot.build/abc123`
   - Analytics on popular builds

4. **QR Code Generation**
   - For mobile sharing
   - Embed in image export (FX-04)

---

## Code Reference

### Encode Implementation

```typescript
// src/core/sharing.ts - Lines 8-16
export function encodeBuild(build: Build): string {
  const data = {
    c: build.characterClass
      ? `${build.characterClass.realm[0]}:${build.characterClass.name}`
      : null,
    a: build.purchasedAbilities,
  };

  const json = JSON.stringify(data);
  return btoa(json);
}
```

### Decode Implementation

```typescript
// src/core/sharing.ts - Lines 21-54
export function decodeBuild(
  encoded: string,
  allClasses: IClass[]
): Build | null {
  try {
    const json = atob(encoded);
    const data = JSON.parse(json);

    let characterClass: IClass | null = null;
    if (data.c) {
      const [realmInitial, className] = data.c.split(':');
      const realmMap: Record<string, string> = {
        'A': 'Albion',
        'M': 'Midgard',
        'H': 'Hibernia',
      };
      const realm = realmMap[realmInitial];
      characterClass = allClasses.find(
        c => c.name === className && c.realm === realm
      ) ?? null;
    }

    const purchasedAbilities: PurchasedAbilities = data.a || {};
    return new Build(characterClass, 0, purchasedAbilities);
  } catch (error) {
    console.error('Failed to decode build:', error);
    return null;
  }
}
```

---

*Document created: January 2025*
