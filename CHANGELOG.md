# Changelog

## 0.1.13 - 2026-07-15

### Fixed

- Kept compact rating badges on their own grid row so labels remain readable in Albert's constrained rating column.

### Changed

- Reworked injected cards and the extension popup with Albert's flat teal control language, NYU Violet branding, square geometry, and restrained motion.
- Added a measured public-NYU website design specification covering responsive layouts, typography, color, components, imagery, and animation.

## 0.1.12 - 2026-07-15

### Fixed

- Prevented RMP cards from collapsing into an unreadable trailing column when Albert uses fixed table layout.
- Restored the popup overlay switch track so its enabled and disabled states are visible.

### Changed

- Shortened the popup feature summary and made cache clearing visually secondary to copying diagnostics.

## 0.1.11 - 2026-07-15

### Fixed

- Recovered exact full-name professor ratings when RMP requires a department-scoped surname fallback, without accepting different first names.
- Prevented browser-normalized CSS zero lengths from producing false Albert layout warnings.
- Refreshed Albert connection diagnostics immediately after enabling or disabling the rating overlay.

## 0.1.10 - 2026-07-15

### Fixed

- Prevented surname-only RMP matches from selecting professors in the wrong department.
- Prevented cleared caches from being repopulated by in-flight or legacy writes.
- Kept rating cards synchronized when Albert changes instructors, SELECT_BUTTON rows, or values to TBA.
- Stopped failed rating cards from retrying automatically during DOM rescans.
- Prevented duplicate content-script observers and listeners after reinjection.
- Aggregated popup diagnostics across loaded Albert frames.
- Accepted supported under-button rating layouts in snapshot and diagnostic verification.
- Made local path redaction portable across operating systems.

### Added

- Contributor guidelines, community policies, issue forms, a pull-request template, and an MIT license.
- CI verification, supported Node.js versions, and a dependency-free JavaScript syntax check.
- Regression coverage for matching, cache races, dynamic Albert DOM updates, reinjection, frame aggregation, layout verification, and path redaction.
