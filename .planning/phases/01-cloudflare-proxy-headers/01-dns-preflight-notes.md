# Phase 01 — DNS Pre-Flight Notes
**Date:** 2026-05-23 13:33 UTC
**Completed by:** Plan 01-01 (automated + API)

---

## mail.unth.ai TLS Check
**Result:** PASS — HTTP/2 404 (TLS is working; 404 is not a cert error)
**Implication:** HSTS `includeSubDomains` is safe to enable in Plan 03.

```
HTTP/2 404
access-control-allow-credentials: true
access-control-allow-origin: https://crm.unth.ai
content-type: text/html; charset=utf-8
```

---

## Current DNS Zone (Hostinger, pre-swap baseline)

| Record | Type | Value | TTL | Proxy (in CF) |
|--------|------|-------|-----|---------------|
| unth.ai (@) | A | 31.97.139.175 | **300** (was 3600, lowered via API ✅) | ORANGE (to be set) |
| www.unth.ai | A | 31.97.139.175 | **300** (was 3600, lowered via API ✅) | ORANGE (to be set) |
| mail.unth.ai | A | 31.97.139.175 | 3600 (unchanged) | GREY — must stay DNS-only |
| unth.ai (@) | MX | 10 mail.unth.ai. | 3600 | n/a |
| unth.ai (@) | NS | ns1.dns-parking.com., ns2.dns-parking.com. | (Hostinger) | n/a |

### Important: Origin IP is VPS, not Hostinger shared hosting

**RESEARCH.md assumed origin = Hostinger shared 145.223.108.64 — THIS IS WRONG.**
Actual origin = VPS `31.97.139.175` (Traefik + nginx/1.29.5 via Let's Encrypt).

Impact on Plan 02:
- Cloudflare will import A records pointing to `31.97.139.175` (correct)
- SSL mode Full works — Traefik has valid LE certs at `31.97.139.175`
- No change needed to Plan 02 logic; just note the correct IP

### HTTP/HTTPS behavior (pre-CF, VPS-served)
```
HTTP → 308 redirect to https://unth.ai/ (Traefik handles it)
HTTPS → HTTP/2 200, server: nginx/1.29.5 (no cf-ray yet)
```

---

## DNSSEC Status
**Status: DISABLED**
- `dig DS unth.ai +short` returned empty (no DS records in parent zone)
- Hostinger API `/api/dns/v1/zones/unth.ai/dnssec` endpoint does not exist
- No action required — safe to swap nameservers without DNSSEC conflict

---

## TTL Reduction — Method Used
Hostinger DNS API v1 — full zone PUT:
```
PUT https://developers.hostinger.com/api/dns/v1/zones/unth.ai
Authorization: Bearer gGeFnTBvPOtIHIAJZ0ZAmolTdLvw0tE65vKgUVlUb584d4df
Body: {"zone": [...all 59 records with @ A + www A TTL modified to 300...]}
```
Response: `HTTP 200 {"message":"Request accepted"}`

API confirms new TTL:
- `@ A → 31.97.139.175 TTL=300` ✅
- `www A → 31.97.139.175 TTL=300` ✅

Resolver cache still holds old TTL (~3600s remaining at check time) — will clear within 60 min.

---

## Plan 02 Earliest Start
**2026-05-24 13:33 UTC** (24h after TTL reduction)

This waiting period ensures all recursive resolvers have expired their cached 3600s TTL
and will fetch the new 300s value, minimizing outage window during NS swap.

---

## Anomalies Found
1. **Origin IP mismatch**: RESEARCH.md/primer said 145.223.108.64 (Hostinger shared), actual is 31.97.139.175 (VPS). SSL Full mode still works — VPS Traefik has LE certs.
2. **mail.unth.ai returns 404**: Expected (Roundcube or mail service not on root path). TLS is healthy — plan criteria is TLS success, not HTTP status.
3. **DNSSEC API endpoint missing on Hostinger**: Confirmed disabled via `dig DS` instead.
