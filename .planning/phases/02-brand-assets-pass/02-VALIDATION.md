---
phase: 2
slug: brand-assets-pass
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-23
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | curl (CLI smoke) + browser (manual social card preview) + Node one-liners (asset dims) |
| **Config file** | none — asset generation phase, no test framework yet (Phase 08 adds Vitest) |
| **Quick run command** | `npm run build 2>&1 | tail -3` |
| **Full suite command** | `curl -o /dev/null -w "%{http_code}" https://unth.ai/favicon.ico` |
| **Estimated runtime** | ~15 seconds (build) + ~2 seconds (curl) |

---

## Sampling Rate

- **After every task commit:** `npm run build` (catch import/syntax errors)
- **After Wave 1 (02-01) deploy:** curl smoke for all 6 favicon files + og-image + browser devtools check
- **Before `/gsd-verify-work`:** All REQ checks must pass
- **Max feedback latency:** 15 seconds (build) or 2 seconds (curl post-deploy)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|----------|-----------|-------------------|--------|
| 02-01 T1 | 02-01 | 1 | png-to-ico installed | `require('png-to-ico/package.json')` succeeds | smoke | `node -e "require('./node_modules/png-to-ico/package.json')" && echo ok` | ⬜ pending |
| 02-01 T2 | 02-01 | 1 | Favicon generator exists | Script file present | smoke | `ls scripts/generate-favicons.mjs && ls scripts/generate-og-image.mjs && echo ok` | ⬜ pending |
| 02-01 T3 | 02-01 | 1 | All 7 assets generated | 6 favicon files + og-image at correct dims | smoke | `ls public/favicon.ico public/favicon-16.png public/favicon-32.png public/apple-touch-icon.png public/android-chrome-192.png public/android-chrome-512.png public/og-image.png && echo "all 7 assets present"` | ⬜ pending |
| 02-01 T4 | 02-01 | 1 | index.html + manifest updated | favicon.ico link present, unthai-logo.png = 1 (JSON-LD only) | smoke | `grep -c 'favicon\.ico' index.html | grep -q 1 && grep -c 'unthai-logo\.png' index.html | grep -q 1 && echo ok` | ⬜ pending |
| 02-01 T5 | 02-01 | 1 | Build succeeds + favicons serve | HTTP 200 for favicon.ico | e2e | `curl -o /dev/null -w "%{http_code}" https://unth.ai/favicon.ico` → 200 | ⬜ pending |
| 02-01 T5 | 02-01 | 1 | og-image serves | HTTP 200 for og-image.png | e2e | `curl -o /dev/null -w "%{http_code}" https://unth.ai/og-image.png` → 200 | ⬜ pending |
| 02-02 T1 | 02-02 | 2 | IndexNow key file served | `https://unth.ai/<KEY>.txt` → 200, content = key | e2e | `curl https://unth.ai/<KEY>.txt` → key string | ⬜ pending |
| 02-02 T2 | 02-02 | 2 | IndexNow ping succeeds | `npm run ping:search` → 200/202 | smoke | `INDEXNOW_KEY=<KEY> node scripts/ping-search-engines.mjs` | ⬜ pending |
| 02-02 T3 | 02-02 | 2 | GSC verified | GSC property shows Verified | manual | Log into search.google.com/search-console and confirm | ⬜ pending |
| 02-02 T4 | 02-02 | 2 | Bing verified | Bing Webmaster shows Verified | manual | Log into bing.com/webmasters and confirm | ⬜ pending |
| 02-02 T5 | 02-02 | 2 | Turnstile sitekey saved | `.env` has `VITE_TURNSTILE_SITEKEY=...` | smoke | `grep -q 'VITE_TURNSTILE_SITEKEY' .env && echo ok` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — no test framework installed yet (Phase 08 adds Vitest). All verification is via bash one-liners, `npm run build`, and curl post-deploy checks that are already available.

---

## Manual-Only Verifications

| Behavior | Why Manual | Test Instructions |
|----------|------------|-------------------|
| og-image 1200×630 branded look | Visual check — automated only checks dims | Open https://unth.ai/og-image.png in browser, verify branding |
| Browser tab shows correct favicon | Requires browser render | Open https://unth.ai in Chrome — favicon tab icon should show UNTH.AI logo |
| Social card preview (og-image) | Requires external preview tool | Use https://opengraph.xyz/?url=https://unth.ai — confirm 1200×630 branded image |
| PWA install icons | Requires browser devtools | Chrome devtools → Application → Manifest → check icon sizes 192/512 |
| GSC property verified | Requires GSC dashboard login | Log into Google Search Console, confirm property shows green ✓ |
| Bing Webmaster verified | Requires Bing dashboard | Log into bing.com/webmasters, confirm site shows Verified |
| Sitemap submitted to GSC + Bing | Requires dashboard | GSC → Sitemaps → sitemap.xml submitted; Bing → Sitemaps → submitted |

---

## Validation Sign-Off

- [x] All tasks have automated verify or manual instructions
- [x] Sampling continuity: every wave has build + curl verification
- [x] No watch-mode flags
- [x] Feedback latency < 15s for smoke tests, < 2s for curl post-deploy
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
