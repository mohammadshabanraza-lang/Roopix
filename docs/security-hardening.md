# ROOPIX hosting and browser-security hardening

## What this repository now does

- Uses a same-origin script for page bootstrap instead of an inline executable script.
- Removes inline event-handler attributes from the pages and handles the logo fallback in `assets/base.js`.
- Adds `noopener noreferrer` to external links opened in new tabs.
- Keeps the animation dependency pinned to a specific GSAP version and restricts the proposed Content Security Policy to the ROOPIX origin, Google Fonts, and that pinned CDN host.
- Includes a `security.txt` contact at `/.well-known/security.txt`.
- Includes standard response-header policies in `_headers` for compatible static hosts and a Cloudflare Worker option.

## Important hosting limitation

The repository includes a `CNAME` and `.nojekyll`, which is consistent with a GitHub Pages deployment. GitHub Pages does not apply a repository `_headers` file as HTTP response headers. Therefore, the `_headers` file alone does **not** secure the live GitHub Pages response.

For response headers while retaining GitHub Pages as the origin, place Cloudflare in front of the custom domain and deploy `cloudflare/roopix-security-headers.js` as a Worker route for `roopix.in/*`. The Cloudflare DNS records for the web host must be proxied, and HTTPS must be active. Alternatively, migrate the static deployment to Cloudflare Pages and keep `_headers` in the published output directory.

Before enabling the Content Security Policy, test the live website on desktop and mobile. If a future feature adds a trusted third-party script, image, font, API or embedded service, update the policy deliberately rather than adding `unsafe-inline` or `unsafe-eval`.

## HTTPS

In the GitHub repository, open **Settings → Pages** and confirm that **Enforce HTTPS** is enabled. Keep all canonical URLs, assets, fonts and site links on HTTPS. The Worker example redirects HTTP requests to HTTPS and emits HSTS only after the HTTPS request reaches it.

## Browser / Google Safe Browsing warnings

Security headers reduce certain classes of browser risk, but they cannot make a Safe Browsing, antivirus, or phishing warning disappear by themselves. If a browser or search result displays a warning, inspect the verified domain in Google Search Console's **Security issues** report and the Google Safe Browsing site-status checker. Review the reported sample URLs, remove any unwanted injected content or files, update exposed credentials and third-party dependencies where appropriate, and request a review only after the cause is fixed.

No code change can guarantee that every third-party security product will never show a warning. Hosting response headers and reputation/security-list status are separate checks.
