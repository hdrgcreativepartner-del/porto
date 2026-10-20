# HDRG Website — Collaboration Changelog

All entries should describe **actual committed changes**, not proposed work.

## 2026-10-19 — Collaboration setup
- Added shared project brief, task board, PR template, and static-site validation workflow.
- Established review-first collaboration between Gemini browser, ChatGPT and the repository owner.
- No landing-page redesign is claimed by this entry.

## How to log future changes
### YYYY-MM-DD — Short title
- Branch / PR:
- Files changed:
- Functional changes:
- Tests performed:
- Known limitations:

## 2026-10-19 — Editorial landing page v2 (feature branch, pending review)
- Branch: `ai/chatgpt-editorial-v2`.
- Added editorial featured-work carousel from existing portfolio entries and their real cover paths, with arrows, keyboard and touch navigation; no autoplay.
- Added responsive typography and restrained hover treatments.
- Preserved existing original logo, project archive, services, contact and admin integration.
- Testing: source inspection only; browser/device tests and asset-path verification requested from Gemini. Not deployed to main.

## 2026-10-19 — Editorial v2 continuation (pending review)
- Featured carousel now waits for `HDRGCatalog`, so it uses the same active portfolio as the project grid; hides gracefully when no media exists.
- Added a four-stage Our Approach section with responsive layout.
- Source-level review only; real browser testing and Gemini feedback still pending.

## 2026-10-19 — Editorial continuation QA
- Preserve featured work and approach positions when applying configured section ordering.
- Guard carousel input until the live catalogue resolves; prevent vertical gestures from changing slides.
- Add regression tests for delayed catalogue, keyboard/wrap navigation, touch direction and configured order; 7 tests pass.
- Browser visual QA remains pending: Chromium installation was not available in this environment.

## 2026-10-19 — Concept portfolio and admin access
- Add three AI concept illustrations as editable portfolio records; keep existing work.
- Add admin login navigation and a concept checkbox in the existing authenticated editor.
- Apply reference-inspired blue/paper sections, split hero and editorial typography. Event concept cover drives hero imagery after catalogue load.
- Seven regression tests pass and modified JS syntax checks pass. Visual browser QA and authenticated upload testing remain pending.

## 2026-10-20 — Live homepage refinements
- On `main`, featured slider prioritizes real portfolio items; concept images are fallback only and explicitly labeled.
- Added visible hero concept-art disclosure to avoid suggesting client documentation.
- Bumped CSS and featured slider cache versions. User is primary tester; no Gemini review gate.
- Browser deployment and device QA remain to be verified by owner.
