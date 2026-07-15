# Contributing

Thank you for improving NYU Albert RMP Ratings. Contributions should keep the extension accurate, privacy-conscious, and safe to test on Albert.

## Before You Start

- Search existing issues before opening a duplicate.
- Use the bug or feature issue form when possible.
- Never post NYU credentials, student information, private URLs, or unredacted Albert screenshots.
- Keep each change focused. Discuss large UI, permission, or architecture changes in an issue first.

## Local Setup

Use a supported Node.js version from `package.json`, then install the locked dependencies:

```bash
npm ci
npm run verify:local
```

Run `npm run build` to create the unpacked extension in `dist/`. Load that directory from `chrome://extensions` with Developer mode enabled. Do not edit generated `dist/` files directly.

## Development Standards

Use ES modules, two-space indentation, semicolons, and double-quoted strings. Follow the structure and naming conventions in `AGENTS.md`. Keep browser entry points thin and place testable behavior in controllers, services, or `src/shared/`.

Add Vitest regression coverage for every bug fix and meaningful branch. Tests belong in `tests/<module>.test.js` and should describe observable behavior.

## Rights and Affiliation

This repository is an independent personal project and must not imply that it is sponsored, approved, reviewed, or endorsed by New York University. NYU retains all rights in its name, trademarks, logos, visual identity, website content, and other NYU-owned materials.

- Do not contribute NYU credentials, student records, private Albert content, proprietary source material, or assets you are not authorized to redistribute.
- Do not add or modify an NYU logo, torch mark, or official-looking lockup without documented authorization.
- Use NYU and Albert names only as needed to describe compatibility or intended use.
- By contributing original code or documentation, you agree that it may be distributed under the repository's MIT License and confirm that you have the right to submit it.

Read [NOTICE.md](NOTICE.md) before contributing. Send copyright, trademark, affiliation, University-policy, or takedown concerns to [mcpejunwei@gmail.com](mailto:mcpejunwei@gmail.com).

## Verification

Before submitting a pull request, run:

```bash
npm run lint
npm test
npm run build
npm run verify:package
npm run verify:release
npm run verify:albert-smoke
```

For UI changes, also test the unpacked extension on a non-destructive Albert page. Do not click enrollment, cart, or class-selection controls solely for testing.

## Commits and Pull Requests

Use a short, imperative commit subject without trailing punctuation. Pull requests should explain what changed, why it changed, how it was verified, and any user-facing impact. Link related issues and include redacted before/after screenshots for visual changes. Explicitly call out manifest permissions, storage behavior, API changes, and version changes.

By participating, you agree to follow `CODE_OF_CONDUCT.md` and the repository's [rights notice](NOTICE.md).
