# HDRG Studio v0.2 — development plan

Status: prototype created separately; existing live site and assets remain unchanged.

## Goals
- Private local Windows editor; no admin PIN or GitHub token embedded in public website.
- Editable brand, logo, header, navigation, theme, section ordering and visibility, project metadata.
- Shared validated site-config.json with live preview, local drafts, import/export, undo/redo.
- Existing portfolio catalog and verified media in `porto` must be preserved.
- Publish through authenticated local Git or a secure GitHub authorization flow.

## Integration checklist
1. Map existing content.js and generated project catalog to versioned config.
2. Refactor site layout to consume configuration while keeping existing routes, assets and SEO.
3. Add media management and asset copying.
4. QA desktop/mobile, link navigation, accessibility and GitHub Pages deployment.
5. Merge only after testing and review.

The initial v0.2 ZIP prototype is supplied separately in the conversation. This branch does not replace the live website.
