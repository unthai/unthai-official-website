---
plan: 01-02
phase: 01-cloudflare-proxy-headers
status: complete
completed_at: 2026-05-23T14:38:00Z
---

# Plan 02 Summary — Cloudflare Zone + NS Swap

## What Happened

**Task 1 — CF zone created + DNS records fixed**
- Zone ID: `b6f34c77216bf841e5930c8ec80b2bea`
- CF assigned NS: `norah.ns.cloudflare.com` + `trevor.ns.cloudflare.com`
- DNS records proxied/DNS-only states corrected via CF API:
  - ORANGE (proxied): `unth.ai`, `www`, `api`, `app`, `crm`, `dashboard`, `dev`, `n8n`
  - GREY (DNS-only): `mail`, `ftp`, `webmail`, `autoconfig`, `autodiscover`, all `_domainkey` CNAMEs, MX × 2, TXT × 7
- SSL/TLS mode: `full` (already set, no change needed)

**Task 2 — NS swap at Hostinger (manual hPanel)**
- Note: Hostinger has no registrar API for NS changes — owner changed via hPanel
- Swap time: 2026-05-23 ~14:25 UTC
- CF zone status: `active` at 14:35 UTC (10 min propagation)

**Task 3 — Automated verification**
- NS via 1.1.1.1: `norah.ns.cloudflare.com` + `trevor.ns.cloudflare.com` ✓
- A record: `104.21.31.62` / `172.67.175.56` (CF IPs) ✓
- HTTPS: `HTTP/2 200` with `cf-ray` header ✓
- HTTP→HTTPS: `301` with `Location: https://unth.ai/` ✓
- mail.unth.ai: `HTTP/2 404` (same as pre-flight — no regression) ✓

## Key Findings
- Universal SSL cert provisioned in ~1 min after zone went active
- Local macOS DNS cache still showed old NS — used `@1.1.1.1` / `--resolve` to bypass
- Hostinger API (`/api/dns/v1/`) manages zone records only — NS change requires hPanel

## Artifacts
- `.planning/phases/01-cloudflare-proxy-headers/01-02-PROGRESS.md`
- `.planning/phases/01-cloudflare-proxy-headers/NS-SWAP-INSTRUCTIONS.md`
