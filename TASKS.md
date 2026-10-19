# HDRG Collaboration — Task Board

Status labels: TODO / IN PROGRESS / REVIEW / DONE / BLOCKED.

| ID | Status | Owner | Task | Acceptance |
|---|---|---|---|---|
| LP-01 | TODO | Gemini | Audit current homepage and existing assets | Inventory of working sections and reusable media |
| LP-02 | TODO | Gemini | Implement editorial hero and responsive navigation | Original logo, brand palette, mobile usability |
| LP-03 | TODO | Gemini | Build featured project slider | Real project media, accessible controls, swipe |
| LP-04 | TODO | Gemini | Refine selected works and service sections | Visual-first, real content, coherent grid |
| LP-05 | TODO | Gemini | Responsive and interaction fixes | No overflow, usable keyboard navigation |
| QA-01 | TODO | ChatGPT | Review Gemini pull request | Design, semantics, regressions, assets, content |
| QA-02 | TODO | ChatGPT | Final refinement recommendations | Actionable prioritized fixes |
| ADM-01 | BLOCKED | Later phase | Expand visual admin editor | Explicit approval required before implementation |

## Rules
- Update status and owner before beginning a task.
- Each PR should reference task IDs and describe tested behavior.
- No automatic approval or production merge.
- If Gemini browser cannot push code, share its patch/files for a GitHub-capable workflow.

## ChatGPT implementation handoff (2026-10-19)
- REVIEW — LP-02 / LP-03: Editorial hero refinement and authentic-media featured slider implemented on `ai/chatgpt-editorial-v2`. Gemini to review and test before merge. Existing archive, services, contact and admin are preserved.

## Continuation QA (2026-10-19)
- REVIEW — ChatGPT: LP-05 / QA-01, fixed section ordering, loading-time carousel input and vertical-scroll handling. Seven automated tests pass. Browser visual QA remains pending because Chromium is unavailable in the execution environment.

- REVIEW — Concept portfolio, reference-led layout and admin access implemented at owner request. Owner authorized publishing; visual review follows.
