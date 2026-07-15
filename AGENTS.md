# Repository Guidelines

## Project Structure & Module Organization

The extension source lives in `src/`. Chrome entry points are `background.js`, `content.js`, and `popup.js`; controller, DOM, and messaging concerns are split into neighboring modules. Reusable parsing, API, and version logic belongs in `src/shared/`. Keep `src/manifest.json` and `src/popup.html` aligned with entry-point changes. Tests mirror behavior in `tests/*.test.js`. Build and verification utilities live in `scripts/`; generated extension files and release archives belong in `dist/` and should not be edited by hand.

## Build, Test, and Development Commands

- `npm ci` installs the locked development dependencies.
- `npm run lint` checks JavaScript syntax across `src/`, `scripts/`, and `tests/`.
- `npm test` runs the Vitest suite once.
- `npm run build` creates the unpacked Chrome extension in `dist/`.
- `npm run verify:local` builds, tests, and runs package, version, and Albert layout checks; use this before opening a pull request.
- `npm run package:release -- v0.1.11` validates and packages a tagged release.
- `npm run verify:albert-shape -- ./snapshot.html` checks a saved Albert page against the current card layout.

Load `dist/` from `chrome://extensions` for manual testing. See `README.md` for profile and live-readiness checks.

## Coding Style & Naming Conventions

Use modern JavaScript ES modules, two-space indentation, semicolons, and double-quoted strings. Follow existing names: `camelCase` for functions and variables, `PascalCase` only for classes, and `UPPER_SNAKE_CASE` for module constants. Keep browser entry points thin and put testable behavior in controllers, services, or `src/shared/`. The lint command performs syntax checks; there is no autoformatter, so match surrounding code and avoid unrelated formatting changes.

## Testing Guidelines

Write Vitest tests named `tests/<module>.test.js`, using descriptive `describe` and behavior-focused `it` blocks. Add regression cases for parser inputs, Albert DOM variants, popup state, messaging, and package scripts when those areas change. Run `npm test` during development and `npm run verify:local` before submission. No numeric coverage threshold is enforced, but new branches and bug fixes should be exercised.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, sentence-case subjects, such as `Detect Albert Course Search class cards`. Keep each commit focused and omit trailing punctuation. Pull requests should explain user-visible behavior, list verification commands, and link the relevant issue when one exists. Include before/after screenshots for popup or injected-card UI changes, and note any manifest permission or release-version changes explicitly.
