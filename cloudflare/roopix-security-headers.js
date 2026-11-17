/*
 * ROOPIX response-header hardening for Cloudflare Workers.
 * Deploy as a Worker and add a route for roopix.in/* (and www.roopix.in/*
 * only if that hostname is actively used and configured in DNS).
 * This is a hosting-layer configuration. It does not run merely because
 * this file is present in the GitHub repository.
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "form-action 'self' mailto:",
    "script-src 'self' https://cdn.jsdelivr.net",
    "script-src-attr 'none'",
    "style-src 'self' https://fonts.googleapis.com",
    "style-src-attr 'none'",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "manifest-src 'self'",
    'upgrade-insecure-requests'
  ].join('; ')
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.protocol !== 'https:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const upstream = await fetch(request);
    const headers = new Headers(upstream.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers
    });
  }
};
