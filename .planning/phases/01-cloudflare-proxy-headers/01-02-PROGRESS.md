# Plan 02 — Progress Notes
**Updated:** 2026-05-23 14:11 UTC

## Task 1 — CF Zone + DNS Audit: COMPLETE ✅

- Zone ID: `b6f34c77216bf841e5930c8ec80b2bea`
- CF account: mat@unth.ai
- CF NS assigned: `norah.ns.cloudflare.com` + `trevor.ns.cloudflare.com`
- Zone status: `pending` (NS not yet swapped — CORRECT)
- SSL/TLS mode: `full` — already set ✓
- DNS records proxied status: CORRECTED (2026-05-23 14:11 UTC)
  - ORANGE (proxied): unth.ai, www, api, app, crm, dashboard, dev, n8n
  - GREY (DNS-only): mail, ftp, webmail, autoconfig, autodiscover,
    brevo1._domainkey, brevo2._domainkey,
    hostingermail-a._domainkey, hostingermail-b._domainkey, hostingermail-c._domainkey,
    MX × 2, TXT × 7

## Task 2 — NS Swap: WAITING FOR GATE ⏸

**Gate opens:** 2026-05-24 13:33 UTC (24h after TTL reduction at 2026-05-23 13:33 UTC)

NS swap command (run AFTER gate opens — see 01-02-NS-SWAP.sh):
```bash
# Hostinger API — change unth.ai nameservers to Cloudflare
bash /tmp/01-02-NS-SWAP.sh
```

## Task 3 — CF Proxy Verification: PENDING ⏸
Runs immediately after Task 2 completes.
