# ROOPIX Website Security

For responsible disclosure of a suspected issue affecting ROOPIX, contact roopix.in@gmail.com. Include the affected URL, a concise description and reproducible steps. Do not access, alter or download other people's data.

## Current repository controls
- Static security headers are defined in `_headers` for hosts such as Cloudflare Pages or Netlify. GitHub Pages does not process this file.
- A Cloudflare Worker example is provided at `cloudflare/roopix-security-headers.js`. It only becomes active after deployment and assignment to the correct `roopix.in/*` route.
- The site enforces same-origin defaults in its proposed Content Security Policy and permits only the required Google Fonts and jsDelivr GSAP assets.
- The website currently uses client-side email/WhatsApp enquiry handoff on Exports; it does not submit enquiries to a private server. Do not place secrets or API keys in frontend code.

## Deployment verification
After deploying the Worker or moving to a host that applies `_headers`, verify the live response headers using browser developer tools or a trusted header scanner. Confirm HTTP redirects to HTTPS and the TLS certificate is valid. These controls cannot be considered active until checked on the live domain.
