---
phase: 1
slug: cloudflare-proxy-headers
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-23
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | curl (CLI smoke tests) + external tools (securityheaders.com, hstspreload.org) |
| **Config file** | none — infrastructure phase, no test files |
| **Quick run command** | `curl -sI https://unth.ai` |
| **Full suite command** | `curl -sI https://unth.ai | grep -iE "cf-ray|strict-transport|x-frame|x-content|permissions|referrer"` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `curl -sI https://unth.ai | grep -i "200 OK"`
- **After every plan wave:** Run full header suite command above
- **Before `/gsd-verify-work`:** All REQ-01 through REQ-09 must pass
- **Max feedback latency:** 5 seconds (curl) or 60 seconds (DNS propagation check)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| 01-01 | 01 | 1 | REQ-01 (CF proxying) | — | CF-Ray header present | smoke | `curl -sI https://unth.ai \| grep -i cf-ray` | ⬜ pending |
| 01-02 | 01 | 1 | REQ-07 (HTTP→HTTPS) | T-downgrade | 301/308 redirect | smoke | `curl -sI http://unth.ai \| grep -i "location"` | ⬜ pending |
| 01-03 | 01 | 2 | REQ-02 (X-Frame-Options) | T-clickjacking | SAMEORIGIN | smoke | `curl -sI https://unth.ai \| grep -i "x-frame"` | ⬜ pending |
| 01-04 | 01 | 2 | REQ-03 (X-Content-Type) | T-MIME | nosniff | smoke | `curl -sI https://unth.ai \| grep -i "x-content"` | ⬜ pending |
| 01-05 | 01 | 2 | REQ-04 (Permissions-Policy) | T-fingerprint | geolocation=() etc | smoke | `curl -sI https://unth.ai \| grep -i "permissions"` | ⬜ pending |
| 01-06 | 01 | 2 | REQ-05 (Referrer-Policy) | T-leakage | strict-origin-when-cross-origin | smoke | `curl -sI https://unth.ai \| grep -i "referrer"` | ⬜ pending |
| 01-07 | 01 | 3 | REQ-06 (HSTS) | T-MITM | max-age=300+ includeSubDomains | smoke | `curl -sI https://unth.ai \| grep -i "strict-transport"` | ⬜ pending |
| 01-08 | 01 | 3 | REQ-08 (no regression) | — | HTTP 200 | smoke | `curl -sI https://unth.ai \| grep "200"` | ⬜ pending |
| 01-09 | 01 | 4 | REQ-09 (grade A) | — | A or A+ | manual | securityheaders.com scan | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

None — this is an infrastructure phase. No test file stubs needed. All verification is via curl and external tools that are already available.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| CF proxying active (orange cloud) | REQ-01 | Requires Cloudflare dashboard login | Verify orange cloud icon on A records in CF DNS tab |
| Nameserver swap complete | REQ-01 | DNS propagation, requires dig | `dig NS unth.ai +short` → shows `*.ns.cloudflare.com` |
| securityheaders.com grade A | REQ-09 | External grading tool | Visit https://securityheaders.com/?q=https://unth.ai |
| HSTS preload eligibility | REQ-10 | External tool, requires 1-week stable | Visit https://hstspreload.org after 1 week |
| mail.unth.ai TLS valid | Pre-HSTS check | Requires curl to subdomain | `curl -sI https://mail.unth.ai` — must not return TLS error |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or manual instructions
- [ ] Sampling continuity: every wave has curl verification
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s for smoke tests
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
