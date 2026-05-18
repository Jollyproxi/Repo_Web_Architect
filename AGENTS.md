# Repo Web Architect

## Project Shape
- This repository is a teaching playground, not a single app. Most folders under `HTML/`, `JAVASCRIPT/`, and `Statement Fondamentali/` are static lesson demos that open directly in the browser.
- The main structured app is `projectRubrica_Giolitti/`: a browser-only ES Modules contact book with Bootstrap and persistent state in `localStorage`/`sessionStorage`.
- There is no backend in this repo. Do not invent API layers, servers, or database workflows when changing the rubrica app.

## Architecture To Preserve
- `projectRubrica_Giolitti/js/script01.js` is the orchestrator that boots the app and wires events.
- `projectRubrica_Giolitti/js/app-logic.js` adapts UI events to domain actions.
- `projectRubrica_Giolitti/js/data-manager.js` owns persistence, session state, and normalization.
- `projectRubrica_Giolitti/js/contact-utils.js` holds pure contact helpers; `projectRubrica_Giolitti/tests/contact-utils.test.mjs` covers these helpers.
- `projectRubrica_Giolitti/js/dom-refs.js` centralizes DOM queries. Prefer extending it instead of scattering new `querySelector` calls.

## Working Patterns
- Keep mutations, rendering, and DOM wiring separated the way the rubrica app already does.
- Preserve the existing Italian UI labels and DOM ids when possible; many files depend on them.
- Prefer small edits inside the owning lesson/app folder instead of cross-cutting refactors across unrelated exercises.

## Commands That Actually Work
- In `projectRubrica_Giolitti/`, run `npm test` to execute `tests/contact-utils.test.mjs`.
- In `HTML/Lezione7/`, run `npm run start` to launch `serve . -l 5500` for browser verification.
- For static lesson pages, use Live Server or open the HTML file directly; there is usually no build step.

## Integration Notes
- `projectRubrica_Giolitti/index.html` loads Bootstrap from `node_modules` and expects the modular JS entrypoint to run in the browser.
- `HTML/Lezione7/index.html` also relies on `node_modules` assets and local static serving.
- The rubrica app uses Bootstrap modals, toast, and form state heavily; changing markup often requires matching updates in `dom-refs.js` and `app-logic.js`.

## Change Discipline
- When editing `projectRubrica_Giolitti`, keep `contact-utils.js` functions pure when possible and add or update the node test if you change normalization or duplicate-detection logic.
- Avoid broad style-only rewrites in lesson files unless they are the actual task; the repo contains many educational snapshots with intentionally simple code.