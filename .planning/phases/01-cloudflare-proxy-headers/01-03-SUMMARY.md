---
plan: 01-03
phase: 01-cloudflare-proxy-headers
status: complete
completed_at: 2026-05-23T14:38:00Z
---

# Plan 03 Summary — Security Headers + HSTS Stage 1

## What Happened

All tasks deployed via CF API (pre-deployed before NS swap, activated automatically):

**Task 1 — Always Use HTTPS**
- API: `PATCH /zones/{zone}/settings/always_use_https` → `"on"`
- Verified: `curl -sI http://unth.ai` → `HTTP/1.1 301 Location: https://unth.ai/` ✓

**Task 2 — Transform Rule (4 security headers)**
- Ruleset ID: `26507dbd3c8f48d58896ba3cd656ecef`
- Phase: `http_response_headers_transform`
- Headers set on all responses:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()`
  - `Referrer-Policy: strict-origin-when-cross-origin`

**Task 3 — HSTS Stage 1**
- `max-age=300`, `includeSubDomains=true`, `preload=false`
- `nosniff=true` (no-sniff bonus enabled in HSTS panel)

**Task 4 — Full verification**
```
cf-ray: a004ce5a1cae91a2-SIN                     ← REQ-01 ✓
referrer-policy: strict-origin-when-cross-origin  ← REQ-05 ✓
x-frame-options: SAMEORIGIN                       ← REQ-02 ✓
strict-transport-security: max-age=300; includeSubDomains  ← REQ-06 ✓
x-content-type-options: nosniff                   ← REQ-03 ✓
permissions-policy: geolocation=(), microphone=(), camera=(), payment=()  ← REQ-04 ✓
HTTP/2 200                                        ← REQ-08 ✓
HTTP/1.1 301 Location: https://unth.ai/           ← REQ-07 ✓
```
- REQ-09 (securityheaders.com grade A): owner to verify at https://securityheaders.com/?q=https://unth.ai

## All subdomains affected
Security headers + HSTS apply to all 8 proxied subdomains:
`unth.ai`, `www`, `api`, `app`, `crm`, `dashboard`, `dev`, `n8n`

## Plan 04 Gate
Wait minimum **1 week** (until 2026-05-30) before escalating HSTS:
- Verify all `*.unth.ai` subdomains work correctly with `includeSubDomains`
- Then: Plan 04 escalates `max-age=300` → `max-age=31536000` + `preload`
