# NS Swap Instructions
**DO NOT EXECUTE BEFORE: 2026-05-24 13:33 UTC**

## What's already done (pre-deployed via API)
- CF zone: `b6f34c77216bf841e5930c8ec80b2bea` (status: pending)
- DNS records: all proxied/DNS-only states corrected ✓
- Always Use HTTPS: ON ✓
- HSTS Stage 1: max-age=300, includeSubDomains=true, preload=false ✓
- Transform Rule: 4 security headers (X-Frame-Options, X-Content-Type-Options, Permissions-Policy, Referrer-Policy) ✓

## The one manual step: NS swap at Hostinger

**CF nameservers to set:**
- `norah.ns.cloudflare.com`
- `trevor.ns.cloudflare.com`

**Via Hostinger hPanel (no API available for NS changes):**
1. Login to hPanel at https://hpanel.hostinger.com
2. Domains → Domain Portfolio → unth.ai → Manage
3. Find "Nameservers" section → Change to Custom Nameservers
4. Enter:
   - `norah.ns.cloudflare.com`
   - `trevor.ns.cloudflare.com`
5. Save / Confirm
6. Note swap time

## After NS swap — verify (run after ~5-30 min)
```bash
# Check NS propagated to Cloudflare
dig NS unth.ai +short
# Expected: norah.ns.cloudflare.com. + trevor.ns.cloudflare.com.

# Check CF zone went active
curl -s "https://api.cloudflare.com/client/v4/zones/b6f34c77216bf841e5930c8ec80b2bea" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['result']['status'])"
# Expected: active

# Check CF is proxying
curl -sI https://unth.ai | grep -i cf-ray
# Expected: cf-ray: [hash]

# Check all 5 security headers
curl -sI https://unth.ai | grep -iE "x-frame|x-content|permissions|referrer|strict-transport"
# Expected: 5 lines, one per header

# Check HTTP→HTTPS redirect
curl -sI http://unth.ai | grep -E "HTTP/|location"
# Expected: HTTP/1.1 301 + location: https://unth.ai/

# Check mail not broken
curl -sI --max-time 10 https://mail.unth.ai | head -2
# Expected: same as pre-flight (200 or 301)
```

## Monitor CF zone activation (poll)
```bash
# Watch CF zone status — will change from "pending" to "active" after NS propagates
watch -n 30 'curl -s "https://api.cloudflare.com/client/v4/zones/b6f34c77216bf841e5930c8ec80b2bea" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)[\"result\"][\"status\"])"'
```
