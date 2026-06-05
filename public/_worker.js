// Cloudflare Worker — SPA routing for unth.ai
// Deploy via Cloudflare Dashboard → Workers & Pages → Create Worker
// Paste this entire file and deploy.
// No routes configuration needed — the Worker runs on all routes.

const SPA_INDEX = '/index.html';

// File extensions that should be served directly (not rewritten to index.html)
const STATIC_EXT_PATTERN = /\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2?|ttf|eot|json|xml|txt|webmanifest|pdf|mp4|webm)$/i;

// Paths that should never be rewritten
const EXCLUDED_PATHS = [
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/humans.txt',
  '/site.webmanifest',
  '/og-image.png',
  '/unthai-logo.png',
  '/.well-known/',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1. Serve static files directly (let Cloudflare's cache handle them)
    if (STATIC_EXT_PATTERN.test(pathname)) {
      return fetch(request);
    }

    // 2. Don't rewrite excluded paths
    if (EXCLUDED_PATHS.some(p => pathname.startsWith(p))) {
      return fetch(request);
    }

    // 3. Serve index.html for the root path
    if (pathname === '/' || pathname === '') {
      return fetch(request);
    }

    // 4. SPA fallback — rewrite all other paths to /index.html
    //    This allows React Router to handle client-side routing.
    const spaUrl = new URL(request.url);
    spaUrl.pathname = SPA_INDEX;

    const spaRequest = new Request(spaUrl.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body,
      redirect: 'manual',
    });

    const response = await fetch(spaRequest);

    // Return the SPA index.html with a 200 status (not 404)
    return new Response(response.body, {
      status: 200,
      statusText: 'OK',
      headers: response.headers,
    });
  },
};
