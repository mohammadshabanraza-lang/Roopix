# ROOPIX mobile, readability and layout correction

**Source archive:** `Roopix-main(10).zip`  
**Revision date:** 17 November 2026

## Findings

The Beauty About section used a light blush surface while a later legacy rule in `assets/final-design-system.css` applied pale translucent cards and near-white copy to the Mission, Vision and Approach content. The later rule overrode the intended dark text and white card treatment, which caused the low-contrast appearance in the supplied screenshots.

The three Beauty customer-clarity cards also inherited competing layout rules from several CSS layers. Their label, title and description blocks did not reserve consistent vertical space, so the text did not align reliably across the desktop row and mobile stack.

The repository also contained multiple responsive rules spread across the shared base, page-specific styles and design-system layers. A final scoped layer was needed to apply consistent responsive guardrails after those rules.

## Changes made

### ROOPIX Beauty readability

- Added `class="pg-beauty"` directly to the Beauty document root so the page theme does not depend solely on JavaScript path detection.
- Changed the Beauty `color-scheme` metadata to `light` to match its light blush and porcelain surfaces.
- Added `assets/quality-assurance.css` as the final stylesheet on all site pages.
- Reasserted dark plum headings and readable dark body copy on the light blush About section.
- Rebuilt the Mission, Vision and Approach cards with white surfaces, dark headings, dark descriptions, stronger borders and no translucent white text treatment.
- Removed the inherited low-opacity glass treatment from those information cards.
- Reasserted readable heading and paragraph colours in the other light Beauty sections.

### Three-card alignment

- Reworked the Beauty trust-card grid into three equal desktop columns with consistent gaps and full-height cards.
- Standardised label, heading and description spacing.
- Reserved consistent title height on desktop so headings and copy begin at matching vertical positions.
- Switched to one full-width card per row on mobile, with consistent padding and left alignment.

### Mobile and tablet guardrails

- Added consistent container widths and safe-area-aware side padding.
- Prevented grid and flex children from forcing horizontal page overflow.
- Added responsive safeguards for corporate homepage grids, Beauty grids and Exports content/form grids.
- Kept Beauty category cards in a single-column layout on narrow screens.
- Reduced the chance of category labels and glass badges colliding on narrow phones.
- Standardised mobile navigation spacing and minimum control hit areas.
- Repositioned floating actions with device safe-area support and preserved extra breathing room near the Beauty category section.
- Added form width constraints and mobile button stacking for Exports.
- Added reduced-motion safeguards in the final responsive layer.

### JavaScript compatibility

- Updated the shared mobile-menu breakpoint listener to support both modern `MediaQueryList.addEventListener` and the older `addListener` API.
- Bumped the shared `base.js` cache version on the three business pages.

## Contrast checks

The corrected Beauty text/background combinations were calculated using the WCAG relative-luminance contrast formula:

| Foreground | Background | Contrast ratio |
|---|---|---:|
| `#584752` body copy | `#F8EAF1` blush | 7.40:1 |
| `#5C4D55` card descriptions | `#FFFFFF` | 7.93:1 |
| `#30232B` card headings | `#FFFFFF` | 14.99:1 |
| `#95194F` labels | `#F8EAF1` blush | 7.13:1 |
| `#B51F65` accent heading text | `#FFFAFD` porcelain | 6.08:1 |

All listed combinations exceed WCAG AA contrast thresholds for normal text.

## Validation performed

- Parsed all 17 CSS files with `tinycss2`; no stylesheet parse errors were reported.
- Ran `node --check` on all 8 JavaScript files; no syntax errors were reported.
- Parsed the four HTML documents.
- Checked local CSS, JavaScript, image and linked-page references; none were missing.
- Checked in-page anchor links; no broken fragment references were found.
- Checked duplicate IDs; none were found.
- Checked image `alt` attributes; no images were missing an `alt` attribute.
- Checked external links opening in a new tab; all had `noopener` and `noreferrer`.
- Checked form controls; no unlabeled controls were found.
- Verified the sitemap XML.
- Verified favicon pixel sizes: 32×32, 96×96, 192×192 and Apple touch icon 180×180.

## Remaining verification

A full interactive visual browser pass across real iOS Safari, Android Chrome, tablet and desktop could not be completed in this environment. The automated local browser launch was blocked, so the delivered checks are source-level and contrast calculations, not a claim of full visual device QA. Review the deployed preview at 320, 360, 390, 430, 768, 1024 and 1440 CSS-pixel widths before replacing the live site.

This change does not deploy the site or alter hosting-level security headers. Existing hosting configuration remains subject to the provider and deployment setup.
