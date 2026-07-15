# Changelog

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
