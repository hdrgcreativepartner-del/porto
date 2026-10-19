# HDRG Creative Partner — Shared Project Brief

> Single source of truth for ChatGPT, Gemini, and human contributors. Read this document before editing.

## Project
- Repository: https://github.com/hdrgcreativepartner-del/porto
- Public website: https://hdrgcreativepartner-del.github.io/porto/
- Brand: HDRG Creative Partner
- Tagline: **From ideas to visual experiences.**
- Scope of current phase: **public landing page UI/UX and front-end**. Admin builder is a separate phase.
- Language: Indonesian or bilingual as appropriate; keep public-facing copy consistent.

## Brand and art direction
- Visual direction: Swiss editorial × contemporary creative studio × authentic portfolio.
- Primary palette: charcoal `#303333`, deep charcoal `#171B1D`, electric blue `#3979F6`, off-white `#F4F5F5`.
- Original HDRG logo only. **Never recreate, redraw, or replace the logo with a generated monogram.**
- Bold, precise typography; intentional whitespace; asymmetric editorial layouts.
- No orange as the primary brand accent, generic AI cartoons, fake client imagery, excessive glow, fake awards, testimonials or invented numbers.
- Authentic project imagery should dominate the portfolio. When assets are unavailable, use clearly identified placeholders, not synthetic proof of past work.

## Site structure
1. Header with original logo, navigation, and contact CTA.
2. Editorial hero with “FROM IDEAS TO VISUAL EXPERIENCES.”, concise positioning, CTAs, and optional featured-project slider.
3. Selected works with real images, category filtering and accessible project detail.
4. Services: photography, videography, video editing, motion graphics, graphic design/branding, social media management. Event LED/VJ visual production is a key specialty.
5. About / Why HDRG.
6. Process / Approach.
7. Verified clients/collaborations only.
8. Contact via WhatsApp, email, Instagram, and project brief.
9. Footer.

## Verified contact
- Email: hdrg.creativepartner@gmail.com
- WhatsApp: +62 85746 894 195
- Instagram: @hdrg.creativepartner

## Content rules
- Use existing portfolio content and assets in this repository as the starting point.
- Verify project names, clients, years, and scope before publication. If uncertain, flag for review rather than inventing.
- Preserve working contact, portfolio and admin functionality.

## Current technical context
- GitHub Pages static website.
- Existing files include `index.html`, `styles.css`, `app.js`, `content.js`, `catalog.js`, `studio-site.css`, `site-runtime.js`, `site-config.json`, and `admin/`.
- Public runtime and admin depend on existing configuration and content files. Inspect before changing.
- Do not replace the entire site with a standalone demo or Tailwind CDN mockup.
- Keep changes modular, lightweight, accessible, responsive, and compatible with GitHub Pages subpath `/porto/`.
- Do not embed API tokens or secrets in the public website.

## UX acceptance criteria
- Mobile-first layout, no horizontal overflow, readable typography and clear CTA.
- Accessible navigation, keyboard-operable modal/slider/filter controls, focus visibility, alt text and reduced-motion support.
- No broken asset paths or console-breaking JavaScript errors.
- Portfolio is visual-first; do not substitute text-only cards for actual project media.
- Slider should have usable controls and should not distract or autoplay without appropriate control.
- No unverified performance claims; measure before reporting Lighthouse scores.

## Workflow and responsibilities
- Gemini (browser): propose and implement landing-page front-end changes; commit via a GitHub-capable environment or provide files/patches for review.
- ChatGPT: art direction, UX/code review, integration advice, QA and targeted fixes.
- Human owner: approves design direction, asset authenticity, and merges to production.
- Work in a feature branch, not directly on `main`. Open a pull request and link it for review.
- Avoid concurrent edits of the same file. Update `TASKS.md` and `CHANGELOG.md` with meaningful changes.
- Do not touch `admin/` in the current landing-page phase unless explicitly authorized.

## Definition of done
A change is ready for review when it includes: screenshots or preview, changed-file summary, test notes (desktop/mobile), verified asset paths, and any known limitations.
