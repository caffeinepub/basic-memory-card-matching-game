# Specification

## Summary
**Goal:** Expand the Memory Match game into a 10-level progressive experience with per-user saved progress and a mintable completion badge for players who finish all levels.

**Planned changes:**
- Replace Easy/Medium/Hard with selectable Level 1–Level 10, increasing difficulty by increasing pair count and adapting grid layouts per level for mobile/desktop.
- Add level progression UX: on Level 1–9 completion show a “Next Level” action; on Level 10 show an “all levels complete” end state; keep a restart/play-again option.
- Implement backend persistence keyed to Internet Identity principals to read progress, record completed levels idempotently, and persist state across upgrades.
- Wire frontend to backend: record level completion for authenticated users, fetch and display saved progress on load, and prompt unauthenticated users to log in to save progress.
- Add backend “mint badge” capability available only after all 10 levels are completed, stored as a one-time per-user minted record with basic metadata (badge id, mint timestamp) and query support.
- Add frontend badge-claim UI: show “Mint Badge” for authenticated users who completed all levels, handle loading/disabled states, and show a persistent “Badge minted” state based on backend queries.
- Add a static badge image asset in `frontend/public/assets/generated` and render it in the completion/badge UI.

**User-visible outcome:** Players can choose Level 1–10, progress through levels with a “Next Level” flow, save their progress when logged in with Internet Identity, and mint/view a completion badge after finishing all 10 levels.
