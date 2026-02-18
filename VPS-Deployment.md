# UNTH.AI - VPS Deployment Guide

**Last Updated:** 2026-02-19
**Status:** Strapi deployed with PostgreSQL

---

## Current Deployment

### Strapi CMS (Backend)
- **Container:** `unth-strapi`
- **URL:** https://api.unth.ai
- **Database:** PostgreSQL `unthai_website`
- **Location:** `/root/unthai-website/`

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    VPS (31.97.139.175)                  │
├─────────────────────────────────────────────────────────┤
│  Traefik (Reverse Proxy + SSL)                         │
│    ├── api.unth.ai → unth-strapi:1337                  │
│    └── unth.ai → unth-www (nginx)                      │
├─────────────────────────────────────────────────────────┤
│  unth-strapi (Strapi CMS)                              │
│    └── PostgreSQL (unthai_website)                     │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL 16 (root-postgres-1)                       │
│    └── Database: unthai_website                        │
└─────────────────────────────────────────────────────────┘
```

---

## DNS Requirements

Add these A records pointing to `31.97.139.175`:

| Subdomain | Status |
|-----------|--------|
| `api.unth.ai` | **Required** - Strapi API |
| `unth.ai` | Existing |

---

## Update Deployment

### Pull Latest Code
```bash
ssh root@31.97.139.175 "cd /root/unthai-website && git pull"
```

### Rebuild & Restart Strapi
```bash
ssh root@31.97.139.175 "cd /root && docker compose build strapi && docker compose up -d strapi"
```

### View Logs
```bash
ssh root@31.97.139.175 "docker logs unth-strapi --tail 50"
```

---

## Frontend Deployment

### Build Locally
```bash
npm run build
```

### Deploy to VPS
```bash
# Copy dist folder to VPS
rsync -avz dist/ root@31.97.139.175:/root/unth.ai/www/

# Or via SCP
scp -r dist/* root@31.97.139.175:/root/unth.ai/www/
```

---

## Environment Variables

### Strapi (.env on VPS)
Located at `/root/unthai-website/strapi/.env`:

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Secrets (auto-generated)
APP_KEYS=<generated>
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
TRANSFER_TOKEN_SALT=<generated>
ENCRYPTION_KEY=<generated>
JWT_SECRET=<generated>

# Database - PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=unthai_website
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<from /root/.env>
```

---

## First-Time Setup

1. **Add DNS record** for `api.unth.ai` → `31.97.139.175`
2. **Wait for SSL** (auto-provisions via Let's Encrypt)
3. **Create admin user** at https://api.unth.ai/admin
4. **Configure content** in Strapi admin panel

---

## Troubleshooting

### Check Container Status
```bash
ssh root@31.97.139.175 "docker ps | grep strapi"
```

### Check Traefik Logs (SSL issues)
```bash
ssh root@31.97.139.175 "docker logs root-traefik-1 2>&1 | grep api.unth"
```

### Restart Services
```bash
ssh root@31.97.139.175 "cd /root && docker compose restart strapi"
```

### Database Connection Test
```bash
ssh root@31.97.139.175 "docker exec root-postgres-1 psql -U postgres -d unthai_website -c '\dt'"
```
