# UNTHAI Official Website — Hardening & Growth Roadmap
**Created:** 2026-05-23
**Status:** Plan only — execute in fresh session
**Owner:** Mathieu Buglet
**Site:** https://unth.ai (Hostinger nginx 1.29.5)

---

## Context

Site is live, blog functional, SEO suite shipped, perf baseline good (main 160KB / 54KB gzip, hero LCP preloaded, fonts self-hosted, GDPR cookie consent).

This roadmap turns the remaining owner action items + tech debt + growth ideas into executable GSD phases.

**Execution model:** Each phase = independent slice. Run via `/gsd-plan-phase` to expand into a `PLAN.md` then `/gsd-execute-phase` to ship. Phases sized for 1-3 hour sessions.

---

## Phase Index

| # | Phase | Goal | Effort | Blocker | Priority |
|---|-------|------|--------|---------|----------|
| 01 | **Cloudflare proxy + headers** | Real HTTP security headers (HSTS, X-Frame, Permissions-Policy) by putting Cloudflare in front of unth.ai | 1-2hr | Owner: CF account + DNS swap | 🔴 P0 |
| 02 | **Brand assets pass** | Real og-image, GSC verification, IndexNow key, Turnstile sitekey, favicon set | 2hr | Owner: tokens/keys | 🔴 P0 |
| 03 | **LeadForm wire + verify** | Confirm form actually submits to backend; add Turnstile; GA4 event on submit; thank-you page | 1-2hr | 02 (Turnstile) | 🟡 P1 |
| 04 | **Strapi integration go-live** | DNS api.unth.ai → VPS, posts content-type, switch blog to live data | 2-3hr | Owner: DNS A record | 🟡 P1 |
| 05 | **Content depth + E-E-A-T** | Post body upgrade (h2/h3 blocks), author bio, internal cross-links, FAQ schema on Services | 3hr | none | 🟡 P1 |
| 06 | **Lighthouse audit + fix loop** | Baseline CWV, fix top 5 issues, ship + verify | 2hr | 01 (Cloudflare for accurate headers) | 🟡 P1 |
| 07 | **Case studies + Service array** | New `/work` page, individual Service schema per offering, proof | 4hr | Owner: case content | 🟢 P2 |
| 08 | **DX hardening — CI + tests** | GitHub Actions (lint + build), Vitest unit tests, Playwright smoke E2E | 3hr | none | 🟢 P2 |
| 09 | **GA4 event tracking** | Custom events on CTA clicks, blog reads, scroll depth, form submits | 1hr | 02 (post-consent only) | 🟢 P2 |
| 10 | **404 page upgrade** | Search box, suggested popular pages, recent blog posts | 1hr | none | 🟢 P3 |
| 11 | **RSS feed + JSON feed** | `/blog/rss.xml` + `/blog/feed.json` for LLM ingestion + power users | 1hr | none | 🟢 P3 |
| 12 | **i18n activation OR delete** | Either wire LanguageContext fully (TH/JA) or remove dead code | 2-4hr | Owner: target markets decision | 🟢 P3 |
| 13 | **TypeScript migration** | Convert src/ to TS, strict mode, fix all errors | 6-10hr | none | 🟢 P3 |
| 14 | **Self-hosted analytics (Plausible)** | Deploy Plausible on VPS, replace GA4, drop cookie consent need | 3hr | Owner: decision | 🟢 P3 |
| 15 | **PWA / service worker** | Offline shell, Add-to-Home, push notifications optional | 4hr | none | 🟢 P3 |

**Legend:** 🔴 P0 do first · 🟡 P1 high value next · 🟢 P2 high value when capacity · 🟢 P3 nice-to-have

---

## Phase Details

### Phase 01 — Cloudflare proxy + headers 🔴

**Goal:** Add real HTTP-header-level security (HSTS preload, X-Frame-Options, Permissions-Policy) that Hostinger nginx alone cannot provide.

**Steps:**
1. Owner: create Cloudflare account + add zone `unth.ai`
2. Owner: copy CF nameservers, swap at Hostinger registrar
3. Verify Cloudflare proxies traffic (orange cloud on @ + www records)
4. Add Page Rule or Transform Rule for response headers:
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()`
   - `Referrer-Policy: strict-origin-when-cross-origin`
5. Enable HTTPS-only mode + automatic HTTPS rewrites
6. Enable Brotli compression at CF edge
7. Test via securityheaders.com (target grade A)
8. Verify https://unth.ai still serves correctly

**Acceptance:**
- securityheaders.com → A or A+
- HSTS preload submission eligibility (`hstspreload.org`)
- No regression in TTFB or LCP

**Risks:** DNS propagation delay (24-48hr worst). Have Hostinger DNS backup config screenshot before swap.

**Plans:** 4 plans across 4 waves (Wave 1 must complete 24h before Wave 2; Wave 3 must complete 1 week before Wave 4)

Plans:
- [ ] 01-01-PLAN.md — DNS pre-flight: lower TTL, verify mail.unth.ai TLS, check DNSSEC (then wait 24h)
- [ ] 01-02-PLAN.md — Cloudflare zone setup: add zone, verify DNS records, swap nameservers, set SSL Full
- [ ] 01-03-PLAN.md — Security headers: Transform Rule (4 headers), Always Use HTTPS, HSTS Stage 1 (5min)
- [ ] 01-04-PLAN.md — HSTS escalation: Stage 2 (6mo) then Stage 3 (12mo+preload) + hstspreload.org submission

---

### Phase 02 — Brand assets pass 🔴

**Goal:** Replace placeholders with real brand assets + obtain owner-side tokens.

**Steps:**
1. **og-image.png** — design 1200×630 w/ logo + tagline + visual (Figma/Canva). Save to `public/og-image.png` (replace 35KB placeholder).
2. **Favicon set** — generate from logo via realfavicongenerator.net:
   - `favicon.ico` (multi-res)
   - `favicon-16.png`, `favicon-32.png`
   - `apple-touch-icon.png` (180×180)
   - `android-chrome-192.png`, `android-chrome-512.png`
   - Update `<link>` tags in `index.html` + `site.webmanifest`
3. **GSC verification** — register property at search.google.com, copy meta token, paste into `index.html` line 25 placeholder
4. **IndexNow key** — generate 32-hex random (`openssl rand -hex 16`), save `public/<key>.txt` w/ key as content, set `INDEXNOW_KEY` env on build machine
5. **Bing Webmaster Tools** — verify ownership + submit sitemap
6. **Cloudflare Turnstile** — register site at cf.com/products/turnstile, copy sitekey, save as `VITE_TURNSTILE_SITEKEY` env

**Acceptance:**
- All assets shipped + visible at canonical URLs
- GSC + Bing + IndexNow ownership verified
- Turnstile sitekey ready for Phase 03

**Plans:** 2 plans across 2 waves

Plans:
- [ ] 02-01-PLAN.md — Automated assets: install png-to-ico, write favicon + og-image scripts, run generation, update index.html + site.webmanifest, clean up ping script, build + deploy
- [ ] 02-02-PLAN.md — Owner-gated tokens: IndexNow key file, GSC verification, Bing Webmaster verification, Turnstile sitekey (autonomous: false — all tasks require owner action)

---

### Phase 03 — LeadForm wire + verify 🟡

**Goal:** Confirm LeadForm actually submits, add Turnstile, track conversion event.

**Steps:**
1. Audit `src/components/LeadForm.jsx` — find submit endpoint. If missing, wire to:
   - Option A: Strapi `/api/leads` endpoint (when api.unth.ai live)
   - Option B: Resend transactional email to mat@unth.ai
   - Option C: n8n webhook → CRM
2. Add Cloudflare Turnstile widget to form (uses sitekey from Phase 02)
3. Add GA4 event on successful submit: `gtag('event', 'lead_submit', {...})`
4. Add thank-you state in-place (current) OR redirect to `/thank-you` page (better for GA conversion tracking)
5. End-to-end smoke test: submit real form → verify backend received → verify GA4 event fires (post-consent)
6. Same treatment for Newsletter form

**Acceptance:**
- Test submission lands in backend (verify in Strapi/email/CRM)
- Turnstile blocks at least one obvious bot attempt
- GA4 Realtime shows `lead_submit` event

---

### Phase 04 — Strapi integration go-live 🟡

**Goal:** Switch blog from local `posts.js` to live Strapi backend.

**Steps:**
1. Owner: add DNS A record `api.unth.ai` → `31.97.139.175` (Hostinger DNS)
2. Verify https://api.unth.ai resolves + Strapi responds
3. SSH to VPS, log into Strapi admin at https://api.unth.ai/admin
4. Create content-type `posts` per `src/data/postsClient.js` `mapStrapiPost` schema:
   - `slug` (uid, target: title)
   - `title` (string, required)
   - `excerpt` (text, required)
   - `date` (datetime, required)
   - `category` (string)
   - `readTime` (string)
   - `body` (rich text or JSON array)
   - `image` (media, single)
   - `author` (relation → authors table, see Phase 05)
5. Migrate 6 hardcoded posts into Strapi
6. Set `VITE_STRAPI_URL=https://api.unth.ai` on build machine
7. Rebuild + redeploy
8. Verify `/blog` shows Strapi posts (check Network tab → /api/posts)
9. Verify local fallback still works (kill Strapi temporarily)

**Acceptance:**
- Blog renders from Strapi when API up
- Falls back to local posts.js cleanly when API down
- No regression in SEO (sitemap + llms.txt regenerate from Strapi or stay local — decide)

**Decision:** sitemap/llms.txt — keep local-driven (predictable) OR fetch from Strapi at build (always fresh)? Recommend local-driven w/ webhook trigger to rebuild on Strapi publish.

---

### Phase 05 — Content depth + E-E-A-T 🟡

**Goal:** Upgrade blog posts for SERP rich results + Google E-E-A-T weighting.

**Steps:**
1. **Body schema upgrade** — `posts.js` body from `string[]` → `{type:'h2'|'h3'|'p'|'quote'|'list', text}[]`. Render via switch in `BlogPost.jsx`.
2. **Author entity** — `src/data/authors.js` w/ `id, name, bio, photo, url, twitter, linkedin`. Add `Person` JSON-LD on post detail.
3. **Author bio block** at post end — photo + bio + social links.
4. **Inline cross-links** — pass to each post body: identify 2-3 references to other posts, wrap in `<Link>`.
5. **Table of contents** — auto-generate from h2/h3 in body, sticky sidebar on `BlogPost.jsx` (desktop only).
6. **FAQ block on Services** — visible accordion + `FAQPage` JSON-LD with 6-8 common questions.
7. **Reading time recalc** — replace hardcoded `readTime` with computed from body word count.

**Acceptance:**
- Each post has min 2 h2 sections
- Each post has author bio
- Each post has 2+ internal links
- Services page has FAQ accordion + FAQ schema valid in Rich Results Test
- Lighthouse SEO score unchanged or improved

---

### Phase 06 — Lighthouse audit + fix loop 🟡

**Goal:** Baseline + improve Core Web Vitals.

**Steps:**
1. Run Lighthouse (mobile + desktop) on / /blog /blog/<slug> /services /about /contact
2. Capture scores: Performance, Accessibility, Best Practices, SEO
3. Save report to `.planning/audits/2026-XX-XX-lighthouse.md`
4. Identify top 5 issues per page
5. Fix in batch (likely: image dimensions, render-blocking, unused JS, contrast)
6. Re-run, verify improvement

**Target:** all categories ≥ 90 mobile, ≥ 95 desktop. CWV all green.

---

### Phase 07 — Case studies + Service array 🟢

**Goal:** Add proof + expand SEO surface area.

**Steps:**
1. Owner: write 3-5 case studies (problem / approach / outcome / metrics)
2. Add `src/data/caseStudies.js` schema mirroring posts.js
3. New `/work` (or `/case-studies`) route + index + detail pages
4. Individual `Service` JSON-LD per offering on `/services`:
   - AI Agents
   - Workflow Automation
   - Content Engineering
   - Custom AI Systems
5. Add to sitemap
6. Add to Header nav

---

### Phase 08 — DX hardening — CI + tests 🟢

**Goal:** Prevent regressions, automate quality gates.

**Steps:**
1. `.github/workflows/ci.yml` — runs on PR + push to main:
   - `npm ci`
   - `npm run lint` (add ESLint if missing)
   - `npm run build`
   - upload build artifacts
2. `vitest` setup — unit tests for `postsClient.js`, `Seo.jsx`, `LeadForm.jsx` validation logic
3. Playwright smoke E2E:
   - home loads
   - blog list loads + first post clickable
   - blog detail renders body + breadcrumbs
   - contact form submits w/ Turnstile bypass token
   - cookie consent banner toggle
4. Add `lighthouse-ci` to GH Actions on main push (warn-only)

**Acceptance:** CI green on main, badge in README.

---

### Phase 09 — GA4 event tracking 🟢

**Goal:** Conversion funnel visibility.

**Steps:**
1. Wrap `gtag('event', ...)` calls (post-consent only) for:
   - `cta_click` w/ `cta_name` param (Start a Project, Explore Services, blog Read More, etc.)
   - `blog_read` on post detail mount
   - `scroll_depth` at 25/50/75/100% per page
   - `lead_submit` on successful form submit
   - `newsletter_subscribe`
   - `outbound_link` on external link clicks
2. Mark `lead_submit` as conversion in GA4 admin
3. Build "homepage → blog → contact" funnel in GA4 Explore

---

### Phase 10 — 404 page upgrade 🟢

**Goal:** Reduce bounce from broken URLs.

**Steps:**
1. Add search input that filters `posts` by title (live search via `fetchPosts()`)
2. Show 3 most-recent blog posts
3. Show "popular pages" list: Home, Services, Blog, Contact
4. Keep `noindex,follow` robots directive

---

### Phase 11 — RSS feed + JSON feed 🟢

**Goal:** LLM ingestion path + power-user subscription.

**Steps:**
1. `scripts/generate-feeds.mjs` — emits:
   - `public/blog/rss.xml` (RSS 2.0)
   - `public/blog/feed.json` (JSON Feed 1.1)
2. Hook into `seo:build`
3. Link from `<head>` and footer:
   - `<link rel="alternate" type="application/rss+xml" href="/blog/rss.xml">`
   - `<link rel="alternate" type="application/feed+json" href="/blog/feed.json">`

---

### Phase 12 — i18n activation OR delete 🟢

**Goal:** Decide direction — markets or dead code.

**Steps:**
- **If activating:** wire `LanguageContext` to switch all UI strings, add `/{lang}/...` routing, add `hreflang` tags to sitemap + `<head>`, add language switcher to Header
- **If deleting:** rip `LanguageContext`, simplify `t()` calls back to plain strings

---

### Phase 13 — TypeScript migration 🟢

**Goal:** Static type safety + better refactor confidence.

**Steps:**
1. `npm install -D typescript @types/react @types/react-dom @types/react-router-dom`
2. `tsconfig.json` w/ strict mode
3. Rename `.jsx` → `.tsx` (gradual)
4. Fix all type errors
5. Update `vite.config.js` → `.ts`
6. Update CI to type-check

---

### Phase 14 — Self-hosted analytics 🟢

**Goal:** Drop GA4 + cookie consent banner (Plausible is cookieless).

**Steps:**
1. Deploy Plausible on VPS (Docker, separate compose)
2. Configure `plausible.unth.ai` via Traefik
3. Swap snippet in CookieConsent.jsx (or remove banner entirely — Plausible is GDPR-clean)
4. Migrate 30 days of GA4 data manually (export to CSV)
5. Keep GA4 running parallel for 30 days as comparison

---

### Phase 15 — PWA / service worker 🟢

**Goal:** Offline shell + Add-to-Home + future push.

**Steps:**
1. Vite PWA plugin (`vite-plugin-pwa`)
2. Configure manifest (already exists) + service worker strategy:
   - Network-first for HTML
   - Cache-first for `/assets/*` w/ stale-while-revalidate
3. Add install prompt UI (deferred until user engages)

---

## Cross-Phase Hygiene Tasks (run inline w/ each phase)

- [ ] Update `~/.claude/rules/unthai-official-website-primer.md` at end of each session
- [ ] Update `.planning/STATE.md` w/ completed phases
- [ ] Commit each phase as single PR w/ descriptive title
- [ ] Smoke test live URL after each deploy: `/`, `/blog`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`
- [ ] Watch GA4 Realtime + cookie consent for regressions

---

## Recommended Execution Order

**Sprint 1 (4-6 hrs):** Phases 01, 02, 03 — security + brand + conversion path
**Sprint 2 (5-7 hrs):** Phases 04, 05, 06 — Strapi + content depth + perf
**Sprint 3 (4-5 hrs):** Phases 07, 08, 09 — growth + DX + analytics
**Sprint 4 (3-4 hrs):** Phases 10, 11 — polish (404, feeds)
**Backlog:** Phases 12, 13, 14, 15 — pull when capacity + decision-ready

---

## Out of Scope (this roadmap)

- Pricing page — sales positioning debate
- Live chat widget — distracts from form conversion
- Exit-intent popup — UX trade-off
- Multi-author CMS workflow — premature until volume
- Newsletter double-opt-in — depends on Strapi config

---

## Open Decisions for Owner

1. **Cloudflare or stay direct on Hostinger?** Recommend Cloudflare for headers + WAF + DDoS.
2. **Target markets for i18n?** TH? JA? FR? Or English-only?
3. **Plausible vs GA4 long-term?** Privacy-first or feature-rich?
4. **Case study format?** Long-form narrative vs metrics-first dashboard?
5. **Author byline policy?** UNTH.AI as org vs individual humans?
