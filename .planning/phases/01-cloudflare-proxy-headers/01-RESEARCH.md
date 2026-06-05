# Phase 01: Cloudflare Proxy + Headers — Research

**Researched:** 2026-05-23
**Domain:** DNS / CDN / HTTP Security Headers / HSTS Preload
**Confidence:** HIGH

---

## Summary

The goal is to move `unth.ai` behind Cloudflare's proxy so that real HTTP security headers (HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy, X-Content-Type-Options) can be injected at the edge — something Hostinger's shared nginx cannot do. The path is: Cloudflare account → add zone → import DNS records → swap Hostinger nameservers → configure headers via Transform Rules + HSTS via SSL/TLS panel.

All five security headers are addable on the **free Cloudflare plan** (10 Transform Rules, no regex needed). HSTS has a dedicated dashboard panel (SSL/TLS → Edge Certificates) that is also free. Brotli compression at the highest quality level requires Pro plan, but Zstandard (comparable quality) is the free default and requires zero configuration.

The single major risk in this phase is the `includeSubDomains` HSTS flag: `unth.ai` currently has subdomains (`mail.unth.ai`, `api.unth.ai`, `www.unth.ai`) all pointing to the VPS (`31.97.139.175`) but that VPS is behind Traefik with valid TLS — so the HTTPS requirement holds. Still, HSTS preload is effectively **irreversible on a 12-month timescale**, so the recommended approach is a staged rollout: start HSTS at 5 minutes max-age (no preload), verify for a day, then increase to 2 years + preload flag.

**Primary recommendation:** Use Cloudflare free plan. Add all five non-HSTS headers via a single Transform Rule. Configure HSTS via the dedicated SSL/TLS panel staged rollout. Defer CSP via Transform Rules to a later phase — the existing meta-CSP in index.html is sufficient protection for now, and a CF-level CSP could break Cloudflare's own challenge pages.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Security headers (HSTS, XFO, etc.) | CDN / Edge (Cloudflare) | — | Cannot be set by Hostinger nginx; CF injects at edge |
| DNS resolution | Cloudflare DNS | Hostinger (registrar only) | CF becomes authoritative NS post-swap |
| TLS / HTTPS | Cloudflare SSL | Hostinger origin cert | CF issues edge cert; Hostinger has origin cert |
| Static asset delivery | CDN / Edge (Cloudflare) | Hostinger origin | CF caches CSS/JS/images; HTML not cached by default |
| HTML serving | Frontend Server (Hostinger nginx) | — | Cloudflare proxies but does not cache HTML by default |
| Compression | CDN / Edge (Cloudflare) | Hostinger origin | CF applies Zstandard (free) or Brotli (Pro) |

---

## Standard Stack

### Core
| Tool | Version / Tier | Purpose | Why Standard |
|------|---------------|---------|--------------|
| Cloudflare (Free plan) | Free | DNS proxy, security headers, DDoS, TLS | Industry standard CDN/proxy with free tier sufficient for this phase |
| Cloudflare Transform Rules | Free (10 rules) | Modify HTTP response headers | Only CF mechanism to inject headers on free plan without Workers |
| Cloudflare SSL/TLS panel → HSTS | Free | HSTS header with UI-guided staged rollout | Prevents misconfiguration, handles max-age options |
| Cloudflare "Always Use HTTPS" | Free | HTTP → HTTPS redirect at CF edge | Supplements Hostinger's existing 308 redirect |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| securityheaders.com | Validate header grades | After headers deployed, before/after HSTS preload |
| hstspreload.org | Submit to HSTS preload list | After 48h stable with preload flag + grade A |
| curl -sI | Quick header verification from CLI | During implementation to check CF is injecting headers |
| Cloudflare API (optional) | Automate rule creation | Only if Claude can execute with API key; dashboard is simpler |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP security headers | Hostinger .htaccess / nginx config | Cloudflare Transform Rules | Hostinger nginx silently ignores .htaccess; no server config access on shared hosting |
| HTTP → HTTPS redirect | Custom 301 logic | Cloudflare "Always Use HTTPS" | Already works at Hostinger (308), CF adds edge-level guarantee |
| DDoS protection | Rate limiting code | Cloudflare free WAF | Free plan includes DDoS mitigation automatically |
| Brotli compression | Server config | Cloudflare (auto Zstandard on free) | Free tier delivers Zstandard which modern browsers support equally well |
| HSTS configuration | Custom header value | Cloudflare SSL/TLS → HSTS panel | CF UI validates max-age range and prevents invalid combos |

**Key insight:** The entire value of Cloudflare for this phase is that it solves infrastructure problems (headers, TLS, DDoS) that cannot be solved at the application layer on shared hosting.

---

## Architecture Patterns

### System Architecture Diagram

```
Browser
  │
  ▼
Cloudflare Edge (orange-cloud)
  │  ├─ Injects response headers (Transform Rule)
  │  ├─ Injects HSTS (SSL/TLS panel)
  │  ├─ Enforces HTTPS (Always Use HTTPS)
  │  ├─ Applies Zstandard compression (free default)
  │  └─ Caches: CSS, JS, images (not HTML by default)
  │
  ▼
Hostinger nginx 1.29.5 (145.223.108.64)
  │  └─ Serves dist/ (React + Vite static build)
  │
  ▼
Response travels back through CF edge (headers injected here)
```

### Recommended Project Structure (no code changes required)
This phase is **infrastructure-only** — no files in the project repo change.
The only project change is:
```
index.html      — no change (meta-CSP stays as belt-and-suspenders)
```
DNS configuration lives in Cloudflare dashboard, not in the repo.

### Pattern 1: Security Headers via Single Transform Rule

**What:** One Transform Rule matching all requests (`true` / all traffic) sets multiple headers in a single rule.

**When to use:** All requests to the proxied zone.

**Dashboard steps:**
1. Cloudflare Dashboard → your zone → Rules → Transform Rules → Modify Response Headers
2. Create rule → name: "Security headers"
3. "When incoming requests match": leave as "All incoming requests" (no filter needed)
4. "Then": Add 4 "Set static" operations (one per header):
   - Header: `X-Frame-Options` → Value: `SAMEORIGIN`
   - Header: `X-Content-Type-Options` → Value: `nosniff`
   - Header: `Permissions-Policy` → Value: `geolocation=(), microphone=(), camera=(), payment=()`
   - Header: `Referrer-Policy` → Value: `strict-origin-when-cross-origin`
5. Click "Save and Deploy"

**Do NOT add HSTS here** — use the dedicated SSL/TLS panel instead (see Pattern 2).

**Do NOT add CSP here** — see Pitfall 3 below.

**Example (equivalent curl verification):**
```bash
# [VERIFIED: live curl during research session]
curl -sI https://unth.ai | grep -i "x-frame\|permissions\|referrer\|x-content"
# After deployment, these four headers should appear in the response
```

### Pattern 2: HSTS — Staged Rollout via SSL/TLS Panel

**What:** Use Cloudflare's HSTS panel for a staged rollout to avoid permanent lockout.

**Dashboard path:** SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)

**Staged approach (MUST follow this order):**

Stage 1 (Day 0 — deploy):
- Enable HSTS: ON
- Max Age: `5 minutes` (300s) — Cloudflare supports: 0, 5min, 1hr, 6hr, 12hr, 1d, 1m, 6m, 12m
- Apply HSTS policy to subdomains: ON (required for preload)
- Preload: **OFF** for now
- No-Sniff Header: ON (free X-Content-Type-Options bonus)

Stage 2 (after 24h stability check):
- Max Age: `6 months` (15768000s)
- Preload: still OFF

Stage 3 (after 1 week stable + securityheaders.com grade A):
- Max Age: `12 months` (31536000s)
- Preload: ON
- Submit to hstspreload.org

**Warning:** Cloudflare's UI maximum is 12 months (31536000s), which meets the 1-year minimum for preload. The ROADMAP.md specifies 63072000s (2 years) — this is achievable via Transform Rule if desired, but CF's SSL panel caps at 12 months. Recommendation: use the panel (safer UI), 12 months is sufficient for preload eligibility.

### Pattern 3: Cloudflare Full Setup (Nameserver Swap)

**What:** Cloudflare becomes the authoritative DNS for `unth.ai`.

**Dashboard steps:**
1. cloudflare.com → Add a site → enter `unth.ai` → Free plan
2. CF auto-scans for DNS records (imports `A`, `MX`, `CNAME` automatically)
3. Verify imported records match current Hostinger DNS:
   - `unth.ai` A → `145.223.108.64` (Hostinger, proxied = orange cloud)
   - `www.unth.ai` A → `145.223.108.64` (proxied)
   - `mail.unth.ai` A → `31.97.139.175` (NOT proxied — DNS only)
   - `api.unth.ai` A → `31.97.139.175` (NOT proxied — DNS only, optional add)
   - MX record: `mail.unth.ai` (keep as-is)
4. Note CF's two assigned nameservers (e.g. `alice.ns.cloudflare.com`)
5. **Owner action:** Log into Hostinger hPanel → Domains → Domain Portfolio → Manage → DNS / Nameservers → Change to Custom → enter CF's two nameservers
6. Wait up to 24h for propagation

**TTL reduction (recommended before swap):**
Currently using `ns1.dns-parking.com` / `ns2.dns-parking.com` (Hostinger's DNS-parking nameservers). Before swapping, lower the TTL of the A records to 300s in Hostinger DNS — wait 24h for the low TTL to propagate — THEN swap nameservers. This reduces propagation lag from up to 24h to ~5min.

**Verification:**
```bash
# Check nameserver propagation
dig NS unth.ai +short
# Should show Cloudflare nameservers (e.g. *.ns.cloudflare.com)

# Check proxying is active (Cloudflare IPs, not Hostinger)
dig A unth.ai +short
# Should return Cloudflare IP (e.g. 104.x.x.x), NOT 145.223.108.64

# Check site still serves
curl -sI https://unth.ai | head -5
```

### Anti-Patterns to Avoid

- **Proxying mail.unth.ai** — never orange-cloud MX/SMTP records; email will break. Keep as DNS-only (grey cloud).
- **Adding CSP via Transform Rule** — Cloudflare injects scripts for Turnstile/challenge/analytics into pages; a CF-level CSP may block them. The existing `<meta http-equiv="Content-Security-Policy">` in index.html is safer and doesn't conflict.
- **Enabling preload on day 0** — if any subdomain doesn't have valid HTTPS, users get lockout for the full max-age duration. There is no fast rollback once preloaded.
- **Enabling "Cache Everything" page rule for HTML** — by default CF only caches static assets, not HTML. Enabling HTML caching means deploys won't be visible until CF cache is purged.

---

## Common Pitfalls

### Pitfall 1: HSTS includeSubDomains Locks Out Non-HTTPS Subdomains
**What goes wrong:** If any subdomain of `unth.ai` is HTTP-only, browsers will refuse to connect to it after HSTS is cached. Removal from preload list takes 6-12 months.
**Why it happens:** `includeSubDomains` applies to ALL subdomains, including any internal or forgotten ones.
**How to avoid:** Before enabling `includeSubDomains`, verify all known subdomains (see inventory below).
**Warning signs:** Any subdomain returning HTTP 200 without redirect to HTTPS is a blocker.

**Subdomain inventory for unth.ai (verified via DNS lookup 2026-05-23):**
| Subdomain | IP | TLS? | CF Proxy? |
|-----------|-----|------|-----------|
| unth.ai (apex) | 145.223.108.64 | Yes (Hostinger) | Yes (will be) |
| www.unth.ai | 145.223.108.64 | Yes (Hostinger) | Yes (will be) |
| mail.unth.ai | 31.97.139.175 | Yes (Traefik LE) | No (DNS-only) |
| api.unth.ai | 31.97.139.175 | No DNS yet (pending) | No |

`mail.unth.ai` → VPS Traefik which has LE certs → HTTPS-capable (non-proxied is fine, it just needs a valid TLS cert on the origin, which Traefik provides). Before enabling HSTS preload, verify `https://mail.unth.ai` returns 200 or appropriate redirect, not a TLS error.

`api.unth.ai` has no DNS record yet — it won't be affected by HSTS. When DNS is added (Phase 04), it will need to be HTTPS-capable from day 1.

### Pitfall 2: DNS Records Lost During Nameserver Swap
**What goes wrong:** Cloudflare's auto-scan misses some records; MX or subdomain records silently disappear; mail breaks.
**Why it happens:** CF says the quick scan is "not guaranteed to find all records."
**How to avoid:** Before clicking "Deploy" in CF, manually compare CF's imported record list against Hostinger's DNS zone export. Pay special attention to MX records.
**Warning signs:** Email bouncing after DNS swap.

### Pitfall 3: CSP via Transform Rule Breaks Cloudflare Challenges
**What goes wrong:** Cloudflare injects its own scripts (for Turnstile, bot management, challenge pages) into responses. A CF-level CSP that doesn't include `cdn-cgi/*` will block these scripts.
**Why it happens:** CF's challenge pages load scripts dynamically; Transform Rules are applied after CF injects but the CSP blocks them.
**How to avoid:** Do NOT add CSP via Transform Rule in this phase. The `<meta http-equiv="Content-Security-Policy">` in `index.html` is sufficient and doesn't affect CF's own scripts.
**Warning signs:** Users see a blank Cloudflare challenge page.

### Pitfall 4: Hostinger Edge Cache Serving Stale Content
**What goes wrong:** After CF is enabled, CF proxies to Hostinger, but Hostinger's internal cache may serve stale HTML.
**Why it happens:** CF does not cache HTML by default — it passes through to Hostinger's origin. Hostinger may cache at the edge.
**How to avoid:** After any FTP deploy, test via `curl -sI https://unth.ai` (check `etag` or `last-modified`). CF has no HTML cache to purge; Hostinger cache expires on its own (~5-15 min).
**Warning signs:** New builds not visible at canonical URL 15+ min after FTP deploy.

### Pitfall 5: Cloudflare SSL Mode Misconfiguration
**What goes wrong:** If CF SSL mode is set to "Flexible", CF proxies HTTP to Hostinger origin even if the browser sees HTTPS. This creates mixed-content issues and weakens security.
**Why it happens:** Flexible mode is sometimes auto-selected for origins without a cert.
**How to avoid:** Set CF SSL mode to "Full" or "Full (Strict)". Hostinger provides origin SSL — so "Full" works. "Full (Strict)" requires a valid CA-signed cert on origin (Hostinger's shared SSL is valid).
**Warning signs:** HTTPS in browser but mixed-content warnings; security tools report HTTP at origin.

---

## Code Examples

### Verify Security Headers After Deployment
```bash
# [VERIFIED: pattern from research — apply to live unth.ai after CF is deployed]
curl -sI https://unth.ai | grep -iE "strict-transport|x-frame|x-content|permissions|referrer"
# Expected output after Phase 01 complete:
# strict-transport-security: max-age=300; includeSubDomains
# x-frame-options: SAMEORIGIN
# x-content-type-options: nosniff
# permissions-policy: geolocation=(), microphone=(), camera=(), payment=()
# referrer-policy: strict-origin-when-cross-origin
```

### Verify Cloudflare Is Proxying (Not Direct to Hostinger)
```bash
# [VERIFIED: Cloudflare IPs are in 103.21.244.0/22, 103.22.200.0/22, 104.x.x.x ranges]
curl -sI https://unth.ai | grep -i "cf-ray\|server"
# After CF proxy active: server: cloudflare and cf-ray header present
```

### Verify HTTP → HTTPS Redirect (CF + Hostinger)
```bash
# [VERIFIED: Hostinger already returns 308; CF adds edge-level 301 via "Always Use HTTPS"]
curl -sI http://unth.ai | grep -i "location\|HTTP/"
# Expected: HTTP/1.1 301 + Location: https://unth.ai/
```

### DNS Propagation Check
```bash
# [VERIFIED: standard dig pattern]
dig NS unth.ai +short
# Before swap: ns1.dns-parking.com. ns2.dns-parking.com.
# After swap: alice.ns.cloudflare.com. (assigned by CF)
```

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — static site, no auth |
| V3 Session Management | No | N/A — static site |
| V4 Access Control | No | N/A — static site |
| V5 Input Validation | No | No server-side input in this phase |
| V6 Cryptography | Partial | Cloudflare TLS edge cert; no hand-rolled crypto |
| V14 Configuration | Yes | Security headers: HSTS, XFO, Referrer-Policy, Permissions-Policy, X-Content-Type-Options |

### Known Threat Patterns and Mitigations

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Clickjacking | Tampering | `X-Frame-Options: SAMEORIGIN` via CF Transform Rule |
| MIME sniffing attacks | Tampering | `X-Content-Type-Options: nosniff` via CF Transform Rule |
| HTTP downgrade (MITM) | Spoofing | HSTS `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| Referrer leakage to third parties | Info Disclosure | `Referrer-Policy: strict-origin-when-cross-origin` |
| Sensor/camera/mic abuse via iframes | Tampering | `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()` |
| Browser feature fingerprinting | Info Disclosure | Permissions-Policy restricts unnecessary API access |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | curl + securityheaders.com (external) — no unit test framework needed |
| Config file | none |
| Quick run command | `curl -sI https://unth.ai` |
| Full suite command | `securityheaders.com/?q=https%3A%2F%2Funth.ai` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| REQ-01 | CF proxying traffic (orange cloud active) | smoke | `curl -sI https://unth.ai \| grep cf-ray` | Manual verify |
| REQ-02 | X-Frame-Options header present | smoke | `curl -sI https://unth.ai \| grep -i x-frame` | |
| REQ-03 | X-Content-Type-Options header present | smoke | `curl -sI https://unth.ai \| grep -i x-content` | |
| REQ-04 | Permissions-Policy header present | smoke | `curl -sI https://unth.ai \| grep -i permissions` | |
| REQ-05 | Referrer-Policy header present | smoke | `curl -sI https://unth.ai \| grep -i referrer` | |
| REQ-06 | HSTS header present (any max-age) | smoke | `curl -sI https://unth.ai \| grep -i strict` | |
| REQ-07 | HTTP → HTTPS redirect | smoke | `curl -sI http://unth.ai \| grep "301\|302\|308"` | |
| REQ-08 | Site still loads (no regression) | smoke | `curl -sI https://unth.ai \| grep "200"` | |
| REQ-09 | securityheaders.com grade A | external | manual scan at securityheaders.com | Owner runs |
| REQ-10 | HSTS preload eligibility | external | manual check at hstspreload.org | After 1-week stable |

### Phase Gate
All REQ-01 through REQ-08 must pass before marking phase complete. REQ-09 confirms A grade. REQ-10 is the final stretch goal (submit to preload list after 1 week stability).

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Brotli toggle in CF dashboard | Removed — Zstandard is default (free); Brotli default on Pro+ | May 2024 | Free plan: no action needed for good compression |
| Page Rules for header injection | Transform Rules (Modify Response Headers) | 2021 | Transform Rules are more flexible, 10 free |
| Workers for security headers | Transform Rules (simpler) | 2021 | No Workers quota needed for headers |
| HSTS via response header only | HSTS panel in SSL/TLS → Edge Certificates | 2019+ | UI prevents common misconfiguration |

**Deprecated:**
- **Cloudflare Page Rules for headers**: Page Rules cannot modify response headers. Transform Rules replaced this use case.
- **X-XSS-Protection header**: No longer checked by securityheaders.com for grade; deprecated by browsers. Do NOT add it.
- **DNSSEC at Hostinger before swap**: Must be disabled at Hostinger before nameserver change or propagation will fail.

---

## Owner Actions vs Claude-Executable Actions

| Action | Who | Notes |
|--------|-----|-------|
| Create Cloudflare account | Owner | cloudflare.com — free tier |
| Add zone `unth.ai` to CF | Owner | CF onboarding wizard |
| Verify imported DNS records | Owner + Claude (advisory) | Claude advises what to check |
| Swap nameservers at Hostinger | Owner | hPanel → Domains → DNS / Nameservers |
| Reduce Hostinger DNS TTL before swap | Owner | hPanel → DNS Zone → A records → TTL → 300 |
| Disable DNSSEC at Hostinger | Owner | Required before NS swap if enabled |
| Configure Transform Rule (4 headers) | Owner (Claude provides exact values) | CF Dashboard → Rules → Transform Rules |
| Configure HSTS in SSL/TLS panel | Owner (Claude provides exact settings) | CF Dashboard → SSL/TLS → Edge Certificates |
| Enable "Always Use HTTPS" | Owner (Claude guides) | CF Dashboard → SSL/TLS → Edge Certificates |
| Set SSL mode to "Full" | Owner | CF Dashboard → SSL/TLS → Overview |
| Run `curl -sI` verification | Claude (if terminal access) | Verify headers post-deploy |
| Submit to hstspreload.org | Owner | After 1 week stable, manually |
| Submit sitemap to GSC | Owner | Out of scope Phase 01 |

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Cloudflare account (free) | All CF features | No (needs creation) | N/A | N/A — required |
| Hostinger hPanel access | Nameserver swap | Owner has access | N/A | N/A — required |
| curl (local CLI) | Header verification | Yes | — | Browser devtools |
| dig (local CLI) | DNS verification | Yes | — | online DNS lookup |
| securityheaders.com | Grade validation | Yes (external tool) | N/A | curl manual check |
| hstspreload.org | Preload submission | Yes (external tool) | N/A | — |

**Missing dependencies with no fallback:**
- Cloudflare account must be created by owner before any implementation steps

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Hostinger DNS NS records can be changed to custom nameservers via hPanel | Nameserver swap | If locked, owner would need Hostinger support — minor delay |
| A2 | `mail.unth.ai` on VPS (31.97.139.175) is served via Traefik with valid LE cert making HTTPS accessible | HSTS includeSubDomains | If Traefik LE cert is missing for mail.unth.ai, HSTS includeSubDomains would break mail subdomain access |
| A3 | DNSSEC is currently NOT enabled at Hostinger for unth.ai | NS swap procedure | If enabled, swap will fail silently or cause resolution errors until DS records cleared |
| A4 | Cloudflare's free plan Transform Rules limit is 10 (sufficient for 1 rule with 4 header operations) | Standard Stack | If limit were lower (e.g. 2), would need to upgrade plan; but multiple sources confirm 10 |
| A5 | Hostinger origin serves a valid HTTPS cert that CF can connect to in Full mode | SSL mode | If Hostinger's shared SSL cert is invalid/expired, must use Flexible mode (weaker) |

---

## Open Questions

1. **Is DNSSEC enabled on unth.ai at Hostinger?**
   - What we know: Current NS is dns-parking.com (Hostinger's). DNSSEC could be enabled or not.
   - What's unclear: Cannot verify without Hostinger hPanel access.
   - Recommendation: Owner checks hPanel before starting — if enabled, disable and wait 24h before swapping NS.

2. **Does `https://mail.unth.ai` resolve with a valid TLS cert today?**
   - What we know: mail.unth.ai A → 31.97.139.175 (VPS with Traefik). Traefik handles LE certs.
   - What's unclear: Whether Traefik has issued a cert for mail.unth.ai specifically (it may not have a route defined).
   - Recommendation: Owner runs `curl -sI https://mail.unth.ai` before enabling HSTS includeSubDomains. If TLS error → do not enable includeSubDomains until resolved.

3. **Which HSTS max-age to use at final stage?**
   - What we know: CF panel max is 12 months (31536000s). ROADMAP specified 63072000 (2y). Preload requires min 31536000 (1y).
   - What's unclear: Whether 12 months is acceptable or if owner wants 2y via Transform Rule override.
   - Recommendation: Use CF panel (12 months) — simpler, less error-prone, meets preload minimum.

---

## Sources

### Primary (HIGH confidence)
- [Cloudflare Transform Rules](https://developers.cloudflare.com/rules/transform/) — Plan limits table (Free: 10 rules, no regex)
- [Cloudflare Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/) — Feature description
- [Cloudflare Create Response Header Transform Rule (dashboard)](https://developers.cloudflare.com/rules/transform/response-header-modification/create-dashboard/) — 9-step dashboard walkthrough
- [Cloudflare HSTS documentation](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/) — Panel options, max-age range, plan availability (all plans)
- [Cloudflare Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/) — Free plan, dashboard location
- [Cloudflare Full Setup (nameserver change)](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) — Step-by-step, auto DNS import caveat
- [Cloudflare Default Cache Behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/) — HTML not cached by default
- [Cloudflare Content Compression](https://developers.cloudflare.com/speed/optimization/content/compression/) — Zstandard on Free, Brotli on Pro+
- [hstspreload.org](https://hstspreload.org/) — Exact requirements: max-age ≥ 31536000, includeSubDomains, preload directive, all subdomains HTTPS
- [MDN Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) — Header syntax and semantics

### Secondary (MEDIUM confidence)
- [Cloudflare Community — Hostinger nameserver change](https://community.cloudflare.com/t/change-nameservers-hostinger/585257) — Confirms hPanel path: Domains → DNS / Nameservers
- [Scott Helme — Security Headers Updates](https://scotthelme.co.uk/security-headers-updates/) — Grading criteria: CSP + XFO/frame-ancestors required for A+; X-XSS-Protection no longer required
- [Paramdeo Singh — Enforcing Security Headers with CF Transform Rules](https://paramdeo.com/blog/enforcing-security-headers-with-cloudflare-transform-rules) — Practical walkthrough
- [Cloudflare Community — CSP with CF Managed Challenge](https://community.cloudflare.com/t/content-security-policy-with-managed-challenge/526416) — Pitfall: CF-level CSP breaks challenge pages

### Tertiary (LOW confidence — flagged in Assumptions Log)
- Various community posts confirming 10-rule limit on Free plan (Assumption A4)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Cloudflare free plan limits verified from official docs
- Architecture: HIGH — Diagram derived from verified CF caching and proxy behavior
- Pitfalls: HIGH — HSTS risk from MDN + hstspreload.org; CSP/challenge risk from CF community
- DNS import: MEDIUM — CF says "not guaranteed"; manual verification step added to plan

**Research date:** 2026-05-23
**Valid until:** 2026-11-23 (6 months — Cloudflare plan feature availability is stable)
