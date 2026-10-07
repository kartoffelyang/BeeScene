# BeeScene

AI × Vehicle scenario explorer with 100 research-defined candidates, Chinese/English switching, need and capability filters, an opportunity map, HAI interaction designs, and three investment decision case studies.

Website: https://kartoffelyang.github.io/BeeScene/

## Run locally

```sh
npm ci
npm run dev -- --port 5178
```

Open http://127.0.0.1:5178/.

## Build and validate

```sh
node tests/top100.mjs
node tests/hai.mjs
node tests/decision-evidence.mjs
node tests/i18n.mjs
npm run build
```

## Deployment

Pushes to `main` run validation, build the site for `/BeeScene/`, and publish to GitHub Pages using `.github/workflows/pages.yml`. For a local Pages-path build, run `GITHUB_PAGES=true npm run build`.

## Research boundaries

Rankings and research horizons express research judgments. User value, implementation feasibility and commercial outcomes remain unvalidated. AI-generated scene images illustrate concepts and do not establish implementation or validation evidence. HAI flows are reference designs, not a connected runtime executor.

The active scenario data is `src/top100.js`. Scenario IDs stay stable across filtering and language changes. Bulk TOP100 export controls have been removed; single-scenario and decision/evidence backup exports remain available.

Language preference, research shortlist and evidence records are stored in the current browser. They are not shared between devices or synchronized to a backend. User-entered records are not uploaded to GitHub.
