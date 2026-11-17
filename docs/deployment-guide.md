# ROOPIX Deployment and Verification

1. Review this repository against the intended production branch and deploy through a preview/staging environment first.
2. Verify `/`, `/beauty/`, `/exports/` and `/policies/` over HTTPS. Check that HTTP redirects to HTTPS and the TLS certificate is valid.
3. Verify `/sitemap.xml`, `/robots.txt`, `/favicon.svg`, `/favicon.ico`, `/assets/favicon-32.png`, `/assets/favicon-96.png` and `/assets/favicon-192.png`.
4. Verify all external online-store, mailto, WhatsApp and map links.
5. Check desktop, tablet and mobile widths, including 320px, 375px, 390px, 430px, 768px and 1024px. Confirm no horizontal page overflow.
6. Check forms and their email/WhatsApp handoff. The current Exports enquiry form does not submit to a server. Do not add a public API key or private credential to client-side code.
7. If hosted on Cloudflare Pages or Netlify, review `_headers`. If hosted on GitHub Pages, note that GitHub Pages does not apply `_headers`; deploy the example Cloudflare Worker and route it to the live hostname, or use a host that supports response headers.
8. After security configuration is deployed, verify the response headers and inspect browser Console/Network for CSP violations.
9. Populate product catalogue entries only after verifying actual photographs, codes, specifications and availability with the owner/supplier.
10. This repository update is not deployed to the live domain by this process.
