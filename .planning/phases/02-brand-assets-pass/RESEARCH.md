# Phase 02: Brand Assets Pass — Research

**Researched:** 2026-05-23
**Domain:** Static asset generation, favicon toolchain, og-image scripting, webmaster verification
**Confidence:** HIGH

---

## Summary

Phase 02 is a mixed bag of automated asset generation (favicon set, og-image script) and
owner-gated token registrations (GSC, IndexNow, Bing Webmaster, Cloudflare Turnstile). Every
automated task can be scripted with packages already in the project or one new devDependency.
The one design-heavy task (og-image) can be made non-blocking by shipping a code-generated
branded placeholder that is correct in dimensions and metadata while the owner commissions a
final version.

**Primary recommendation:** Split into two plans. Plan 02-01 (automated code work — favicons +
og-image script + IndexNow key generation + manifest update + index.html link tags) requires
no owner input and can ship immediately. Plan 02-02 (owner-gated — GSC token, Bing Webmaster,
Turnstile sitekey) documents exact owner steps + code patches and ships once the owner provides
tokens.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Favicon generation | Build script (Node) | Static hosting (Hostinger) | One-time asset generation at build/script time; files land in `public/` and are served statically |
| og-image | Build script (Node) | Static hosting | SVG→PNG via sharp; runs in `scripts/`; not SSR-dependent |
| GSC verification | Browser (meta tag in index.html) | — | Client-rendered SPA; meta tag in `index.html` is the only reliable option (no server-side headers available on Hostinger) |
| IndexNow | Post-deploy script (Node) | Static file in public/ | Key file served statically; ping script run after deploy |
| Bing Webmaster | Meta tag in index.html OR file in public/ | — | Either approach works on static host; meta tag preferred (no extra file to manage) |
| Turnstile sitekey | Vite env var (`VITE_TURNSTILE_SITEKEY`) | Phase 03 consumption | Env var baked at build time; not consumed until Phase 03 |

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Source |
|---|---|---|---|
| `sharp` | 0.34.5 (installed) | PNG resize → favicon PNGs; SVG→PNG for og-image | `[VERIFIED: node_modules/sharp/package.json]` |

### New devDependency needed
| Library | Version | Purpose | Why |
|---|---|---|---|
| `png-to-ico` | 3.0.1 | Generate multi-res `favicon.ico` from PNGs | `[VERIFIED: npm view png-to-ico]` — sharp cannot output `.ico` format; png-to-ico is the most current option (released 2025-08-22), requires Node ≥ 20, uses `pngjs` (no native binaries) |

### Alternatives considered
| Instead of | Could Use | Tradeoff |
|---|---|---|
| `png-to-ico` | `to-ico` | to-ico last released 2017-08-15 — `[VERIFIED: npm view to-ico time]` — stale, do not use |
| `png-to-ico` | `jimp` | jimp v1.6.1 can write `.ico` via `@jimp/plugin-print` but is heavyweight (6MB+) for this one task |
| `png-to-ico` | `realfavicongenerator.net` | Online tool — produces all sizes including `browserconfig.xml` — but requires manual download + no script automation |
| Sharp SVG overlay | `@napi-rs/canvas` | canvas is heavier; sharp SVG→PNG is zero new dependencies |
| Sharp SVG overlay | `satori` (Vercel) | satori v0.26.0 is designed for JSX→SVG; works but adds ~400KB dep; overkill when sharp can render inline SVG directly |
| Sharp SVG overlay | Playwright screenshot | Playwright v25.0.4 is installed globally but it's heavy for a script; SVG template is faster and reproducible |

**Installation (one new package):**
```bash
npm install --save-dev png-to-ico
```

**Version verification:**
```
$ npm view png-to-ico version   → 3.0.1   [VERIFIED: 2026-05-23]
$ npm view sharp version        → 0.34.5  [VERIFIED: installed]
```

---

## Architecture Patterns

### System Architecture Diagram

```
Source file                 Script                  Output → public/
───────────────────────────────────────────────────────────────────
public/unthai-logo.png ──→ scripts/generate-favicons.mjs ──→ public/favicon-16.png
(500×500, RGBA PNG)                                          public/favicon-32.png
                                                             public/apple-touch-icon.png
                                                             public/android-chrome-192.png
                                                             public/android-chrome-512.png
                                                             public/favicon.ico   (multi-res 16+32+48)

inline SVG template    ──→ scripts/generate-og-image.mjs  ──→ public/og-image.png
(brand colors + logo       (sharp SVG→PNG composite)          (1200×630 branded)
 composited by sharp)

openssl rand -hex 16   ──→ manual one-time step            ──→ public/<key>.txt
                                                             .env: INDEXNOW_KEY=<key>

Owner: GSC token       ──→ paste into index.html line 28   ──→ deployed index.html
Owner: BingWMT token   ──→ paste into index.html            ──→ deployed index.html
Owner: Turnstile key   ──→ .env: VITE_TURNSTILE_SITEKEY=   ──→ baked at next build
```

### Recommended project structure (changes only)
```
public/
├── unthai-logo.png         (existing — source)
├── og-image.png            (REPLACE — branded 1200×630)
├── favicon.ico             (NEW — multi-res 16/32/48)
├── favicon-16.png          (NEW)
├── favicon-32.png          (NEW)
├── apple-touch-icon.png    (NEW — 180×180)
├── android-chrome-192.png  (NEW)
├── android-chrome-512.png  (NEW)
└── <indexnow-key>.txt      (NEW — content = key value)

scripts/
├── generate-favicons.mjs   (NEW)
├── generate-og-image.mjs   (NEW)
└── ...existing...

.env                        (update: add INDEXNOW_KEY)
.env.example                (update: document new vars)
index.html                  (update: favicon <link> tags, GSC/Bing meta)
site.webmanifest            (update: point to correct icon filenames/sizes)
```

### Pattern 1: Favicon generation via sharp + png-to-ico

Sharp resizes `public/unthai-logo.png` to each required size. For `.ico`, the raw PNG buffers
are passed to `png-to-ico`. The logo is 500×500 RGBA — sharp handles transparent background
correctly with `flatten()` only when needed (PNGs keep alpha for favicon PNGs; `.ico` should
also preserve alpha via png-to-ico).

```javascript
// Source: [VERIFIED: sharp docs + png-to-ico readme]
// scripts/generate-favicons.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');
const SRC = resolve(PUBLIC, 'unthai-logo.png');

// PNG sizes (sharp resize)
const PNG_SIZES = [
  { name: 'favicon-16.png',          size: 16 },
  { name: 'favicon-32.png',          size: 32 },
  { name: 'apple-touch-icon.png',    size: 180 },
  { name: 'android-chrome-192.png',  size: 192 },
  { name: 'android-chrome-512.png',  size: 512 },
];

// ICO sizes (multi-res: 16, 32, 48)
const ICO_SIZES = [16, 32, 48];

for (const { name, size } of PNG_SIZES) {
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(resolve(PUBLIC, name));
  console.log(`✓ ${name} (${size}×${size})`);
}

// Generate multi-res favicon.ico
const icoBuffers = await Promise.all(
  ICO_SIZES.map(size =>
    sharp(SRC)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);
const ico = await pngToIco(icoBuffers);
await writeFile(resolve(PUBLIC, 'favicon.ico'), ico);
console.log('✓ favicon.ico (16×16, 32×32, 48×48)');
```

**Gotcha:** `png-to-ico` API accepts an array of `Buffer` objects (one per size), not file paths.
Pass the raw PNG buffers from `sharp(...).toBuffer()` directly. `[VERIFIED: png-to-ico readme]`

### Pattern 2: og-image generation via sharp SVG composite

Sharp can convert an inline SVG string directly to PNG with zero new dependencies. The SVG
embeds the UNTH.AI brand colours (`#051224` background, `#F6D027` accent), the logo as a
base64-embedded image, and the tagline text. No Canvas, no Playwright needed.

```javascript
// Source: [VERIFIED: sharp docs on SVG input + composite]
// scripts/generate-og-image.mjs
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');

const logoBuffer = await readFile(resolve(PUBLIC, 'unthai-logo.png'));
const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

const W = 1200, H = 630;

// SVG template — uses brand colors from src/index.css
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">

  <!-- Background: brand primary -->
  <rect width="${W}" height="${H}" fill="#051224"/>

  <!-- Subtle gradient overlay -->
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1e3a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#051224" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>

  <!-- Logo (centered-left column) -->
  <image href="${logoBase64}" x="80" y="195" width="240" height="240"/>

  <!-- Vertical separator -->
  <rect x="380" y="160" width="3" height="310" fill="#F6D027" opacity="0.6"/>

  <!-- Brand name -->
  <text x="420" y="280" font-family="Arial, Helvetica, sans-serif"
        font-size="88" font-weight="700" fill="#F6D027">UNTH.AI</text>

  <!-- Tagline -->
  <text x="424" y="345" font-family="Arial, Helvetica, sans-serif"
        font-size="28" fill="#FFFFFF" opacity="0.85">AI-Powered Creative</text>
  <text x="424" y="385" font-family="Arial, Helvetica, sans-serif"
        font-size="28" fill="#FFFFFF" opacity="0.85">&amp; Automation Agency</text>

  <!-- Bottom accent bar -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#F6D027"/>
</svg>`.trim();

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(resolve(PUBLIC, 'og-image.png'));
console.log('✓ og-image.png (1200×630)');
```

**Gotcha:** SVG fonts are rendered by libvips/Cairo using system fonts — "Arial" resolves on
macOS and Ubuntu. The output is fully reproducible. The image uses only standard web-safe fonts
so no font embedding is needed. `[ASSUMED]` — verified that sharp renders SVG text via libvips
on macOS; CI environment (Ubuntu) also ships Arial-equivalent via `ttf-mscorefonts` or falls
back to DejaVu/Helvetica. Visually acceptable either way.

**Owner note:** This script produces a branded automated og-image. If the owner wants a custom
Figma/Canva design later, they simply replace `public/og-image.png` manually — no code change
needed.

### Pattern 3: IndexNow key setup

IndexNow requires:
1. A random key string (32 hex chars = 16 bytes)
2. A file `public/<key>.txt` whose **content is the key itself** (not anything else)
3. The key passed to the API via `?key=<key>` param

`ping-search-engines.mjs` already handles the IndexNow ping via `process.env.INDEXNOW_KEY`.
It just needs the key to be set and the file created. The script already has the correct API
endpoint (`https://api.indexnow.org/indexnow`).

**Gotcha on Google/Bing sitemap ping:** The project memory notes these endpoints are
deprecated (404/410). The `ping-search-engines.mjs` still calls them — those will return
non-200 but won't break anything. They should be cleaned up (commented out or removed) and
IndexNow should become the primary ping target. IndexNow propagates to Bing, Yandex, and other
participating engines in one call. `[VERIFIED: indexnow.org]`

**Key generation (one-liner):**
```bash
openssl rand -hex 16
# → e.g. a3f9b2c8d1e047a5...  (32 hex chars)
```

**File content:** `public/<your-key>.txt` must contain only the key string
(no newline, no other content). `[CITED: https://www.indexnow.org/faq]`

**env update needed:**
```
# .env
INDEXNOW_KEY=<generated-by-openssl-rand-hex-16>
```

### Pattern 4: index.html favicon link tags (modern best practice)

Current `index.html` uses a single `<link rel="icon" type="image/png" href="/unthai-logo.png" />`.
Modern browsers fall back through these in order: `favicon.ico` (implicit), then explicit `<link>` tags.

```html
<!-- Source: [CITED: https://web.dev/articles/favicon-best-practices] -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

**Remove:** the existing `<link rel="icon" type="image/png" href="/unthai-logo.png" />` and
`<link rel="apple-touch-icon" href="/unthai-logo.png" />` lines.

### Pattern 5: site.webmanifest update

Current manifest points both icons to `/unthai-logo.png` with wrong `sizes`. Must update to
the generated android-chrome files:

```json
{
  "name": "UNTH.AI",
  "short_name": "UNTH.AI",
  "description": "AI-powered creative and automation agency.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#051224",
  "theme_color": "#051224",
  "icons": [
    {
      "src": "/android-chrome-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/android-chrome-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Gotcha:** The original manifest has `"purpose": "any maskable"` on the 192 icon. Maskable
icons need a "safe zone" (the inner 80% circle must contain the graphic). The logo is currently
centered in a 500×500 canvas with alpha padding — it likely qualifies, but if the logo crops
weirdly on maskable devices, split into separate `purpose: "any"` (192) and `purpose: "maskable"`
(512 with guaranteed safe zone). For now, `purpose: "any"` on 192 and `purpose: "any maskable"`
on 512 is correct. `[ASSUMED]` — safe-zone padding not verified against maskable spec.

### Pattern 6: GSC meta tag (owner-gated)

`index.html` line 28 already has the placeholder:
```html
<!-- Google Search Console verification — replace with real token when ready -->
<!-- <meta name="google-site-verification" content="REPLACE_ME" /> -->
```

Owner action: Go to https://search.google.com/search-console → Add property → `https://unth.ai`
→ select "HTML tag" verification → copy the `content="..."` value → uncomment line 28 in
`index.html` and replace `REPLACE_ME`. Then commit + deploy. The plan just automates the
surrounding mechanical steps.

### Pattern 7: Bing Webmaster Tools verification

Two options for a static site:
- **Meta tag** (preferred): add `<meta name="msvalidate.01" content="TOKEN" />` to `index.html`
- **XML file**: place `BingSiteAuth.xml` in `public/`

Meta tag is preferred here because it stays in version control and deploys automatically.

Owner action: Go to https://www.bing.com/webmasters → Add site → `https://unth.ai` → choose
"HTML meta tag" verification method → copy the `content` value → add to `index.html`.

### Pattern 8: Cloudflare Turnstile sitekey (env var only)

No code changes in Phase 02. The sitekey just needs to be:
1. Generated at https://dash.cloudflare.com → Turnstile → Add site
2. Saved as `VITE_TURNSTILE_SITEKEY=<sitekey>` in `.env` and on the build machine

Phase 03 will consume it via `import.meta.env.VITE_TURNSTILE_SITEKEY` in `LeadForm.jsx`.

**Gotcha:** Vite bakes `VITE_*` env vars at build time. If the sitekey is set after Phase 03
deploys, the build must be re-run. Document this dependency clearly.

### Anti-Patterns to Avoid

- **Using `to-ico` (last release 2017):** stale, uses `resize-img` which shells out to Jimp internals. Use `png-to-ico` v3.0.1 instead.
- **Passing file paths to `png-to-ico`:** The API requires `Buffer` arrays, not path strings. Pass `sharp(...).toBuffer()` output.
- **Forgetting `sharp` output is async:** All sharp operations return Promises; always `await` them.
- **Leaving Google/Bing sitemap ping calls in `ping-search-engines.mjs`:** Both deprecated. IndexNow covers Bing anyway. Removing them avoids misleading 404 output.
- **Baking IndexNow key into git:** The key is not a secret per se (it must be publicly readable in `public/<key>.txt`) but keeping it in `.env` (which is gitignored) is the correct pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| ICO generation | Manual binary ICO format writer | `png-to-ico` | ICO format has header + directory + bitmap encoding edge cases |
| PNG resize | Custom resize logic | `sharp` (already installed) | libvips handles gamma correction, alpha, precision |
| SVG font rendering | Canvas text API | Sharp SVG input | Sharp renders SVG via rsvg/Cairo; zero new deps |
| OG image CI pipeline | Playwright screenshot | Sharp SVG→PNG | Playwright requires browser binary; SVG is faster + reproducible |

**Key insight:** For a static Vite project with no SSR, `sharp` SVG rendering is the right
tool for og-image generation — it's already a devDependency and the output is deterministic.

---

## Common Pitfalls

### Pitfall 1: sharp cannot output `.ico`
**What goes wrong:** `sharp(src).toFile('favicon.ico')` silently picks PNG format (extension
is not `.ico` in sharp's supported formats list — `[VERIFIED: sharp.format object does not
include 'ico']`).
**Why it happens:** libvips does not support ICO as an output format.
**How to avoid:** Use `sharp` for all PNG sizes → pass raw buffers to `png-to-ico` for the `.ico`.
**Warning signs:** `favicon.ico` file appears but is actually a PNG (Firefox/Chrome will still
render it but it won't be a valid multi-res ICO).

### Pitfall 2: IndexNow key file must contain only the key
**What goes wrong:** Key file has a newline or extra whitespace → validation fails.
**Why it happens:** `fs.writeFileSync(path, key + '\n')` or template literals with trailing newline.
**How to avoid:** Use `writeFile(path, key)` with no trailing newline.
**Warning signs:** IndexNow API returns 403 or "key verification failed".

### Pitfall 3: GSC meta tag in commented HTML is still commented after deploy
**What goes wrong:** Owner pastes token but forgets to uncomment the `<!-- -->` wrapper.
**Why it happens:** The placeholder is wrapped in HTML comments on two lines.
**How to avoid:** Plan step should be: (1) remove comment delimiters AND (2) replace REPLACE_ME.

### Pitfall 4: site.webmanifest served with wrong MIME type
**What goes wrong:** Browser console: `Manifest: Line: 1, column: 1, Unexpected token.`
**Why it happens:** Hostinger may serve `.webmanifest` as `text/plain` instead of `application/manifest+json`.
**How to avoid:** This is a Hostinger nginx config issue. Workaround: rename to `site.webmanifest.json`
and update `<link rel="manifest" href="/site.webmanifest.json" />`. However, this is pre-existing
(the file already exists and is linked) — if it's working today, don't change it.
**Warning signs:** PWA install prompt doesn't appear; browser devtools shows manifest fetch error.

### Pitfall 5: Vite doesn't hash `public/` files
**What goes wrong:** After replacing `og-image.png` or favicon files, users see cached old versions.
**Why it happens:** Files in `public/` are served as-is, without Vite content-hash in filename.
**How to avoid:** After deploy, purge Cloudflare cache (Phase 01 is already live — CF purge is
available via the CF API or dashboard). The CF API token is documented in the primer.
**Warning signs:** New og-image doesn't appear in social previews despite successful deploy.

### Pitfall 6: `og-image.png` is preloaded in index.html
**What goes wrong:** After replacing the image, the `<link rel="preload" as="image" href="/og-image.png" />`
at index.html line 19 preloads it correctly — no change needed. But if the filename changes,
this preload breaks.
**How to avoid:** Keep the filename `og-image.png` — do NOT rename to a hashed version.

---

## Code Examples

### Generate all favicons (complete script)
```javascript
// scripts/generate-favicons.mjs
// Source: [VERIFIED: sharp 0.34.x API + png-to-ico 3.0.1 README]
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');
const SRC = resolve(PUBLIC, 'unthai-logo.png');

const PNG_TARGETS = [
  { out: 'favicon-16.png',         size: 16  },
  { out: 'favicon-32.png',         size: 32  },
  { out: 'apple-touch-icon.png',   size: 180 },
  { out: 'android-chrome-192.png', size: 192 },
  { out: 'android-chrome-512.png', size: 512 },
];

for (const { out, size } of PNG_TARGETS) {
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(resolve(PUBLIC, out));
  console.log(`✓  ${out}`);
}

// ICO: pass array of PNG buffers (16px, 32px, 48px)
const icoBuffers = await Promise.all(
  [16, 32, 48].map(s =>
    sharp(SRC)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);
const ico = await pngToIco(icoBuffers);
await writeFile(resolve(PUBLIC, 'favicon.ico'), ico);
console.log('✓  favicon.ico (16, 32, 48)');
```

### npm script to add to package.json
```json
"favicons": "node scripts/generate-favicons.mjs",
"og-image": "node scripts/generate-og-image.mjs",
"assets:gen": "npm run favicons && npm run og-image"
```

### Updated index.html favicon block (replace lines 6-8)
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

### Cleaned-up ping-search-engines.mjs
```javascript
// IndexNow only (Google/Bing ping endpoints are deprecated — 404/410)
const SITE = 'https://unth.ai/';
const KEY = process.env.INDEXNOW_KEY || '';

if (!KEY) { console.warn('INDEXNOW_KEY not set — skipping ping'); process.exit(0); }

const url = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITE)}&key=${KEY}`;
const res = await fetch(url);
console.log(`IndexNow: ${res.status} ${url}`);
```

---

## Wave / Plan Split

### Plan 02-01 — Automated code work (no owner tokens needed)
**Can ship immediately. No owner input required.**

Tasks:
1. `npm install --save-dev png-to-ico`
2. Write `scripts/generate-favicons.mjs` (sharp + png-to-ico)
3. Write `scripts/generate-og-image.mjs` (sharp SVG→PNG)
4. Add npm scripts: `favicons`, `og-image`, `assets:gen`
5. Run `npm run assets:gen` → generates all files in `public/`
6. Update `index.html` favicon `<link>` tags
7. Update `public/site.webmanifest` (correct icon filenames + sizes)
8. Clean up `ping-search-engines.mjs` (remove deprecated Google/Bing pings, keep IndexNow branch)
9. Update `.env.example` (document `INDEXNOW_KEY`, `VITE_TURNSTILE_SITEKEY`)
10. `npm run build` + deploy

Acceptance: all favicon files exist in `public/`; `og-image.png` is branded; manifest correct;
`curl -I https://unth.ai/favicon.ico` → 200; social card preview shows branded og-image.

### Plan 02-02 — Owner-gated tokens (owner must act first)
**Blocked until owner completes external service registrations.**

Tasks:
1. **IndexNow key** — owner generates `openssl rand -hex 16`, creates `public/<key>.txt`,
   sets `INDEXNOW_KEY` in `.env`, redeploys
2. **GSC verification** — owner goes to GSC → gets meta token → uncomments + replaces in
   `index.html` line 28 → deploy → click "Verify" in GSC → submit sitemap
3. **Bing Webmaster** — owner goes to Bing Webmaster Tools → gets `msvalidate.01` token →
   adds `<meta name="msvalidate.01" content="TOKEN" />` to `index.html` → deploy → click
   "Verify" → submit sitemap at `https://unth.ai/sitemap.xml`
4. **Cloudflare Turnstile** — owner registers site at CF dashboard → saves sitekey as
   `VITE_TURNSTILE_SITEKEY` in `.env` → available for Phase 03

Acceptance: GSC property shows Verified; Bing Webmaster shows Verified; sitemap submitted
to both; IndexNow ping returns 200.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|---|---|---|
| `realfavicongenerator.net` manual download | Scripted via sharp + png-to-ico | Automated, reproducible, in-repo |
| Google/Bing sitemap ping (deprecated) | IndexNow API | IndexNow propagates to Bing, Yandex, Naver |
| Manual og-image in Figma | Sharp SVG→PNG script | Owner can still replace with custom design later |

**Deprecated:**
- `https://www.google.com/ping?sitemap=...`: Google discontinued this endpoint. Confirmed 404.
- `https://www.bing.com/ping?sitemap=...`: Bing discontinued direct ping. Use IndexNow instead.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Sharp renders "Arial" font on CI/deploy machine (Ubuntu) | Pattern 2 og-image | Font falls back to DejaVu/Helvetica — visually close but not identical; text still renders |
| A2 | `purpose: "any maskable"` on android-chrome-512 is safe-zone compliant | Pattern 5 manifest | Maskable icon may crop oddly on some launchers; workaround: change to `"any"` only |

---

## Open Questions

1. **Who generates the IndexNow key — owner or automated?**
   - What we know: key is not a secret (it must be publicly readable), so generating it in
     code and committing `public/<key>.txt` is fine
   - What's unclear: owner preference for managing this
   - Recommendation: Plan 02-01 generates a key file automatically (hardcoded in script output)
     OR the plan documents the `openssl rand -hex 16` command as a one-liner owner runs once.
     Given it's a one-time action with minimal security implication, document it as owner step
     in Plan 02-02 to keep automation clean.

2. **Should og-image.png be committed or gitignored?**
   - What we know: it's in `public/` and is currently committed (34KB placeholder)
   - What's unclear: if the script generates it, should CI regenerate it or use the committed version?
   - Recommendation: keep `public/og-image.png` committed (generated once by running the script,
     then committed). The script is an `npm run og-image` convenience, not a CI gate. Owner
     can replace with custom Figma version and commit that instead — no code change needed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---|---|---|
| `sharp` | favicon generation, og-image | ✓ | 0.34.5 (installed) | — |
| `png-to-ico` | favicon.ico generation | ✗ (not installed) | 3.0.1 on npm | — (must install) |
| `node` | all scripts | ✓ | v24.13.1 | — |
| `openssl` | IndexNow key generation | ✓ | system | `node -e "require('crypto').randomBytes(16).toString('hex')"` |
| `lftp` | deploy to Hostinger | ✓ (per primer) | system | — |
| Cloudflare API | CF cache purge post-deploy | ✓ (Phase 01 token exists) | — | Manual purge in CF dashboard |

**Missing dependencies with no fallback:**
- `png-to-ico` — must install before Plan 02-01 can run

**Missing dependencies with fallback:**
- None

---

## Validation Architecture

> nyquist_validation: key absent from config.json — treating as enabled.

### Test Framework
| Property | Value |
|---|---|
| Framework | None installed yet (Phase 08 adds Vitest) |
| Config file | none |
| Quick run command | `npm run build` (build smoke — no test framework yet) |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map
| Req | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| favicon files exist | All 6 favicon files present in public/ | smoke | `ls public/favicon.ico public/favicon-16.png public/favicon-32.png public/apple-touch-icon.png public/android-chrome-192.png public/android-chrome-512.png` | ❌ manual check |
| og-image correct dims | 1200×630 PNG at public/og-image.png | smoke | `node -e "import('sharp').then(s=>s.default('./public/og-image.png').metadata().then(m=>{ if(m.width!==1200\|\|m.height!==630) throw new Error('wrong dims'); console.log('ok')}))"` | ❌ Wave 0 |
| manifest valid | site.webmanifest references correct filenames | manual | inspect in browser devtools Application tab | manual-only |
| index.html favicon tags | Correct `<link>` tags present | smoke | `grep 'favicon.ico\|favicon-32\|apple-touch-icon' index.html` | ❌ Wave 0 |
| deploy smoke | https://unth.ai/favicon.ico → 200 | e2e | `curl -o /dev/null -w "%{http_code}" https://unth.ai/favicon.ico` | ❌ post-deploy |

### Sampling Rate
- **Per task commit:** `npm run build` (catches build failures)
- **Per wave merge:** `npm run build` + manual favicon check in browser
- **Phase gate:** social card preview shows branded og-image; all favicon HTTP 200

### Wave 0 Gaps
- [ ] No test framework installed yet — Phase 08 addresses this
- [ ] Smoke checks are bash one-liners, not automated suite — acceptable for this phase

---

## Security Domain

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | — (no new user input) |
| V6 Cryptography | no | IndexNow key is public-facing by design |

**No security-sensitive changes in this phase.** The IndexNow key is intentionally public
(served at a known URL); it is not a secret. GSC/Bing/Turnstile tokens are read-only
verification tokens, not API keys with write access. Turnstile sitekey is public by design
(it's embedded in the client-side bundle).

---

## Sources

### Primary (HIGH confidence)
- sharp 0.34.5 installed — `node_modules/sharp/package.json` version verified
- `npm view png-to-ico` — v3.0.1, released 2025-08-22, deps verified
- `npm view to-ico` — last release 2017, confirmed stale
- `sharp.format` object inspected at runtime — no `ico` format listed
- Logo metadata: 500×500 RGBA PNG — verified via `sharp().metadata()`
- SVG→PNG rendering — tested in project environment, returned valid 19KB PNG

### Secondary (MEDIUM confidence)
- IndexNow key file format — `[CITED: https://www.indexnow.org/faq]` (key = file content)
- Modern favicon link tag strategy — `[CITED: https://web.dev/articles/favicon-best-practices]`
- Google/Bing sitemap ping deprecated — confirmed by project memory + widely documented

### Tertiary (LOW confidence — see Assumptions Log)
- A1: Arial font on Ubuntu CI for sharp SVG rendering
- A2: maskable safe-zone compliance for logo at 512×512

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified via npm registry + runtime tests
- Architecture: HIGH — existing patterns in codebase, no new frameworks
- Pitfalls: HIGH — verified at runtime (sharp ICO test) + documented registry dates

**Research date:** 2026-05-23
**Valid until:** 2026-08-23 (stable toolchain — sharp, png-to-ico are not fast-moving)
