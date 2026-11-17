/*
 * ROOPIX response-header hardening for Cloudflare Workers.
 * Deploy as a Worker and add a route for roopix.in/*.
 * It does not run because this file exists in GitHub; deployment and routing
 * must be completed in the Cloudflare dashboard.
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
    "connect-src 'self'",
    "manifest-src 'self'",
    'upgrade-insecure-requests'
  ].join('; ')
};

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    if (incoming.protocol !== 'https:') {
      incoming.protocol = 'https:';
      return Response.redirect(incoming.toString(), 301);
    }
    if (!['roopix.in', 'www.roopix.in'].includes(incoming.hostname)) {
      return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
    const upstream = await fetch(request);
    const responseHeaders = new Headers(upstream.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) responseHeaders.set(name, value);
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
  }
};
