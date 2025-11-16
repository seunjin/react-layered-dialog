---
"react-layered-dialog": none
---

docs: API docs section added and documentation site refreshed

- Split documentation into Fundamentals (concepts/patterns) and API (definitions/guarantees)
- Added API pages: DialogStore, createDialogApi, defineDialog, DialogsRenderer, useDialogController, Types
- Added advanced docs: State/Lifecycle, zIndex/Layering, Async Status, Multi-store/SSR (no "Advanced:" prefix)
- Sidebar regrouped (Core/Types/Advanced) and labels switched to English
- Introduced DocLink/DocLinks, DocCallout, DocDefinitionList for consistent UX
- Fixed mobile horizontal overflow in code blocks (wrap long lines, max-width)
- Improved PageNavigation and responsive styles
- Updated README (requirements, minimal setup, API links) and removed long focus/accessibility section

Note: No library API changes; package version not bumped.

