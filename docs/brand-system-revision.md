# ROOPIX Signature Pink Luxury Theme Revision

**Source:** `Roopix-main(7).zip` supplied by the user on 17 November 2026.  
**Scope:** Main homepage, ROOPIX Beauty and ROOPIX Exports.

## Design direction

The theme retains ROOPIX's signature pink identity and builds a more consistent luxury system around it:

- Deep plum / charcoal for the wordmark-led navigation, footer and selected editorial sections.
- Porcelain white and soft blush for light content surfaces.
- Signature rose-magenta for important headings, links, focus states and primary calls to action.
- Champagne / rose-metallic details used sparingly rather than as a competing primary colour.
- Cormorant Garamond display typography paired with Jost body typography already present in the project.

The intended contrast hierarchy is dark plum text on light surfaces and warm white text on deep plum surfaces. Pink is an accent and action colour, not a substitute for body text.

## Problems addressed

### ROOPIX Beauty

The previous stylesheets mixed light blush section backgrounds from the refinement/implementation layer with white, translucent text and glass-card styling from the earlier dark Beauty layer. This made the Mission, Vision and Approach cards difficult to read, along with several section headings and descriptions.

The new theme sets the Beauty canvas to porcelain/blush, makes headings and body copy dark plum, and changes the three pillars to white cards with dark text and restrained pink icon details. It keeps the photography-led category cards dark for contrast, while retaining the signature rose accents. The WhatsApp feature band and footer remain deep plum with light text.

### ROOPIX Exports

The earlier implementation layer applied pale grey text to some content inside the light beige sourcing introduction. This produced the low-contrast text shown in the user's screenshot. The sourcing introduction, standards, FAQ and enquiry sections now use dark text on pale blush/porcelain surfaces. Collections, buyer support and the sourcing process use deep plum surfaces with warm white copy and rose highlights. The enquiry form uses a white card, dark labels and values, and clear rose focus states.

### Main homepage

The homepage's ivory editorial structure is retained, but gold/brown emphasis has been harmonised with the ROOPIX pink identity. The hero, division cards, vision, founder and contact sections use dark plum text on pale blush/white surfaces. The considered-approach section remains dark plum with pale text and rose highlights.

## Implementation

- Added `assets/brand-system.css` as the final theme layer after the existing stylesheets on all three HTML pages.
- Defined shared colour tokens for ink, body text, muted text, signature rose, blush, porcelain, deep plum, borders and shadows.
- Updated the browser theme colour to deep plum and declared the overall page colour scheme as light.
- Kept existing content, photography, category links, forms, animations and page structure intact.
- Added high-contrast focus styling and respected reduced-motion preferences.
- No customer testimonials, product claims, certifications, buyer statistics or supplier claims were invented.

## Contrast checks on core palette

Calculated contrast ratios for the core design pairs:

| Foreground | Background | Ratio |
|---|---|---:|
| `#2B1924` | `#FFFAFD` | 16.05:1 |
| `#584752` | `#FFFAFD` | 8.34:1 |
| `#B51F65` | `#FFFAFD` | 6.08:1 |
| `#FFFFFF` | `#B51F65` | 6.27:1 |
| `#FFF8FC` | `#24131F` | 16.91:1 |
| `#584752` | `#F8EAF1` | 7.40:1 |
| `#95194F` | `#F8EAF1` | 7.13:1 |

These exceed WCAG AA contrast thresholds for normal text for the listed colour pairs. Individual overlays and image text still depend on their rendered backgrounds and should be reviewed in a browser.

## Validation performed

- CSS parsed across all 12 project CSS files: no parser errors.
- JavaScript syntax checked across all 6 project JavaScript files: no syntax errors.
- Local HTML asset references checked: no missing local references detected.
- Each of the three page heads contains exactly one reference to the new theme stylesheet, and the relative path resolves.
- Meta theme colour and light colour-scheme declarations checked on all three pages.

## Verification limitation

A full Chromium visual/browser pass could not be completed in this environment because the runtime blocked local browser navigation. WeasyPrint also could not render the project reliably because it does not support several modern layout/CSS features used by the website. Therefore this is source-level validation, not a claim of completed cross-browser visual QA. Review the deployed preview at desktop and mobile widths before publishing it to the live domain.
