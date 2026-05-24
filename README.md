# NYU Albert RMP Ratings

Chrome extension that displays Rate My Professors ratings and useful comments beside instructor rows on NYU Albert.

## Local Development

```powershell
npm install
npm test
npm run build
```

Load `dist` as an unpacked Chrome extension after `npm run build`.

## Scope

- Detects Albert instructor labels in the page DOM.
- Looks up matching NYU professors through the Rate My Professors GraphQL endpoint.
- Injects compact rating cards with score, difficulty, take-again percentage, tags, and useful comments.
- Caches lookup results in extension storage.
