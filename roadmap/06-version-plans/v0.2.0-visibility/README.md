# v0.2.0 "Visibility" - Release Overview

## Release Theme
**Information & Feedback** - Help users understand their builds and provide clear feedback for actions.

## Status: PLANNING

## Release Goals
1. Give users detailed ability information on demand
2. Provide visual feedback during loading states
3. Enhance the notification system for better action feedback
4. Protect users from accidental data loss with confirmations

## Feature Summary

| ID | Feature | Priority | Category | Status | Description |
|----|---------|----------|----------|--------|-------------|
| IH-01 | Ability Detail Modal | High | Information | Planned | Click ability to see full description, all ranks, and stats |
| SM-01 | Loading States | Medium | Feedback | Planned | Skeleton loaders when data is being fetched |
| SM-02 | Toast Notifications | Medium | Feedback | Planned | Enhance existing toast system with actions and variants |
| SM-03 | Confirmation Dialogs | Medium | Protection | Planned | Confirm before reset or other destructive actions |

## Implementation Status Matrix

| Feature | Planning | Design | Implementation | Testing | Integration |
|---------|----------|--------|----------------|---------|-------------|
| IH-01 | [ ] | [ ] | [ ] | [ ] | [ ] |
| SM-01 | [ ] | [ ] | [ ] | [ ] | [ ] |
| SM-02 | [ ] | [ ] | [ ] | [ ] | [ ] |
| SM-03 | [ ] | [ ] | [ ] | [ ] | [ ] |

## Feature Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                    v0.2.0 Visibility                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐          ┌─────────────────────────┐     │
│   │   IH-01     │          │        SM-02            │     │
│   │  Ability    │          │   Toast Notifications   │     │
│   │   Modal     │          │     (enhance existing)  │     │
│   │ (standalone)│          │                         │     │
│   └─────────────┘          └───────────┬─────────────┘     │
│                                        │                    │
│   ┌─────────────┐                      │                    │
│   │   SM-01     │                      ▼                    │
│   │  Loading    │          ┌─────────────────────────┐     │
│   │   States    │          │        SM-03            │     │
│   │ (standalone)│          │  Confirmation Dialogs   │     │
│   └─────────────┘          │   (uses toasts for      │     │
│                            │    post-action feedback) │     │
│                            └─────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Notes:**
- **IH-01** and **SM-01** are standalone features with no dependencies
- **SM-02** enhances the existing Toast system (can be done independently)
- **SM-03** depends on SM-02 for post-confirmation feedback toasts

## Recommended Implementation Order

1. **SM-02 Toast Notifications** - Enhance existing system first
2. **SM-01 Loading States** - Independent, can be done in parallel
3. **IH-01 Ability Detail Modal** - Independent, can be done in parallel
4. **SM-03 Confirmation Dialogs** - Depends on enhanced toasts

## Files to Create/Modify

### New Components
| File | Feature | Description |
|------|---------|-------------|
| `src/components/AbilityModal.tsx` | IH-01 | Full ability detail modal |
| `src/components/AbilityModal.css` | IH-01 | Modal styling |
| `src/components/Skeleton.tsx` | SM-01 | Loading skeleton variants |
| `src/components/Skeleton.css` | SM-01 | Skeleton animations |
| `src/components/ConfirmDialog.tsx` | SM-03 | Confirmation modal |
| `src/components/ConfirmDialog.css` | SM-03 | Dialog styling |

### Enhanced Components
| File | Feature | Changes |
|------|---------|---------|
| `src/components/Toast.tsx` | SM-02 | Add warning type, actions, progress |
| `src/components/Toast.css` | SM-02 | New variant styles |
| `src/components/AbilityTree.tsx` | IH-01 | Add click handler for modal |
| `src/components/ActionBar.tsx` | SM-03 | Integrate confirmation on reset |

### New Hooks
| File | Feature | Description |
|------|---------|-------------|
| `src/hooks/useModal.ts` | IH-01 | Generic modal state management |
| `src/hooks/useConfirm.ts` | SM-03 | Promise-based confirmation API |

### Test Files
| File | Feature |
|------|---------|
| `src/components/AbilityModal.test.tsx` | IH-01 |
| `src/components/Skeleton.test.tsx` | SM-01 |
| `src/components/Toast.test.tsx` | SM-02 |
| `src/components/ConfirmDialog.test.tsx` | SM-03 |
| `src/hooks/useModal.test.ts` | IH-01 |
| `src/hooks/useConfirm.test.ts` | SM-03 |

## Existing Infrastructure

### Toast System (for SM-02 enhancement)
The project already has a toast notification system:
- `src/components/Toast.tsx` - Toast component
- `src/components/Toast.css` - Toast styling
- `src/hooks/useToast.ts` - Toast context and hook

Current toast types: `success`, `error`, `info`

### Modal Pattern (reference for IH-01)
No existing modal component. Will create reusable pattern.

## Release Criteria Checklist

### Functionality
- [ ] IH-01: Ability modal shows all ranks and descriptions
- [ ] IH-01: Modal accessible via keyboard (ESC to close)
- [ ] SM-01: Skeleton shown during initial load
- [ ] SM-01: Skeleton matches component shapes
- [ ] SM-02: Warning toast type available
- [ ] SM-02: Toast actions work (e.g., Undo button)
- [ ] SM-03: Reset requires confirmation when build has abilities
- [ ] SM-03: Confirmation can be cancelled

### Testing
- [ ] All new components have test coverage
- [ ] All new hooks have test coverage
- [ ] Integration tests for modal + ability tree
- [ ] Integration tests for confirm + action bar
- [ ] All existing tests still pass

### Accessibility
- [ ] Modal traps focus appropriately
- [ ] Modal announces to screen readers
- [ ] Toast announcements work with screen readers
- [ ] Confirmation dialog keyboard navigable

### Performance
- [ ] Skeleton animations are smooth (60fps)
- [ ] Modal renders without blocking
- [ ] No memory leaks from event listeners

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Event handlers
- Edge cases

### Integration Tests
- Modal triggered from ability tree
- Confirmation flow with action bar
- Toast feedback after actions

### Accessibility Tests
- Focus management
- Screen reader announcements
- Keyboard navigation

## Known Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Modal focus trap complexity | Medium | Use established patterns, test thoroughly |
| Toast stacking UX | Low | Limit visible toasts, add stacking animation |
| Confirmation fatigue | Medium | Add "don't ask again" option |
| Loading state flicker | Low | Add minimum display time |

## Future Considerations (Out of Scope)

- Custom toast duration per message
- Toast queue management
- Modal animation transitions
- Confirmation dialog variants (danger, warning)
- Loading state for individual abilities

## Related Documentation

- [IH-01 Ability Detail Modal](./IH-01-ability-detail-modal.md)
- [SM-01 Loading States](./SM-01-loading-states.md)
- [SM-02 Toast Notifications](./SM-02-toast-notifications.md)
- [SM-03 Confirmation Dialogs](./SM-03-confirmation-dialogs.md)
