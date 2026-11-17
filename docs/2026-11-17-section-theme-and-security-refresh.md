# ROOPIX section theme and security refresh

Source used: the latest repository ZIP provided in this conversation (`Roopix-main_2(1).zip`).

## Design system

The website now has three intentionally different but related visual identities:

- **ROOPIX corporate:** charcoal, warm porcelain, limestone and restrained champagne/brass. Pink is no longer used as the main corporate interface colour; the existing pink logo remains unchanged.
- **ROOPIX Beauty:** signature blush, rose and magenta direction is preserved. This division continues to use its own existing Beauty styles.
- **ROOPIX Exports:** deep forest green, warm limestone, ivory and antique brass. Rose/pink interface accents have been removed from export sections, navigation, cards, buttons and footer.

A final stylesheet, `assets/section-identity.css`, is loaded only on the homepage and Exports page after the legacy shared theme layers. This allows the existing Beauty visual system to remain independent.

## Readability and interaction

The new corporate and export palettes use dark text on light surfaces and warm light text on dark surfaces. Representative palette pairings checked during this build exceed WCAG AA's 4.5:1 normal-text contrast threshold:

- Corporate body text on porcelain: 7.35:1.
- Corporate brass accent on porcelain: 4.81:1.
- Corporate light text on deep charcoal: 15.43:1.
- Exports body text on limestone: 6.99:1.
- Exports antique-gold accent on limestone: 4.57:1.
- Exports light text on forest: 14.54:1.

These are representative tokens, not an automated per-pixel audit of every rendered element. The deployed page still needs visual and accessibility testing.

## Source-level security hardening

- Replaced inline page-bootstrap scripts with `assets/page-init.js`.
- Removed inline event-handler attributes and added a same-origin logo fallback listener in `assets/base.js`.
- Removed inline style block from the policies page and moved it to `policies/policy.css`.
- Added `noopener noreferrer` to external links that open in a new tab.
- Added `/.well-known/security.txt` and a repository `SECURITY.md` contact notice.
- Added a restrictive Content Security Policy and standard security response headers in `_headers` for compatible static hosts.
- Added `cloudflare/roopix-security-headers.js` as a deployable Worker option when GitHub Pages is retained as the static origin behind Cloudflare.

## Hosting limitation that must be understood

The repository's `CNAME` and `.nojekyll` indicate a GitHub Pages-style deployment. The `_headers` file is **not automatically applied by GitHub Pages**. It is supported by Cloudflare Pages and some other static hosting providers. To add HTTP response headers while continuing to use GitHub Pages, the provided Cloudflare Worker must be deployed and routed to the custom domain with Cloudflare proxying configured. The Worker is source code only; it has not been deployed or activated from this repository update.

Also verify **GitHub repository → Settings → Pages → Enforce HTTPS** after deployment. Do not assume that adding an HTTPS link in HTML forces HTTPS at the hosting layer.

## Browser security warnings

A Google Safe Browsing, Chrome, antivirus or other security interstitial is not removed by changing the colour theme or merely adding HTTP headers. If a warning appears, the domain owner must inspect the Security Issues report in Google Search Console and the Google Safe Browsing Site Status diagnostic, investigate the exact affected URLs, remove any unwanted injected content or malicious files, secure the hosting/domain accounts and dependencies, and then request a review if the report requires one.

The build does not certify that the domain is free of malware, does not determine its Safe Browsing reputation, and does not guarantee that no third-party security product will ever display a warning.
