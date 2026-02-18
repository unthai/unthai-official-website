# VPS Infrastructure Documentation

**Last Updated:** 2026-02-06  
**IP Address:** 31.97.139.175  
**Provider:** Hostinger  
**OS:** Ubuntu Linux  
**RAM:** 16GB  
**Disk:** 193GB total, 155GB available  
**Timezone:** Asia/Bangkok

---

## Docker Services

All services are orchestrated via Docker Compose (`/root/docker-compose.yml`).

### Reverse Proxy: Traefik
- **Image:** traefik:latest
- **Ports:** 80 (HTTP), 443 (HTTPS)
- **TLS:** Let's Encrypt (automatic SSL certificates)
- **Storage:** `traefik_data` volume for certificates
- **Configuration:** Labels on each service define routing rules

### Automation Platform: n8n
- **URL:** https://n8n.unth.ai
- **Image:** docker.n8n.io/n8nio/n8n:latest
- **Internal Port:** 5678
- **Storage:** `n8n_data` volume for workflows and data
- **Files Mount:** `/local-files` → `/files` (shared with other services)
- **API Key:** Configured in `.env` file
- **CORS:** Enabled for dashboard.unth.ai

### Database: PostgreSQL 16
- **Image:** postgres:16-alpine
- **Port:** 127.0.0.1:5432 (localhost only, not exposed to internet)
- **Storage:** `postgres_data` volume
- **Backups:** `/local-files/db-backups`
- **Version:** PostgreSQL 16.11
- **Connection:** Internal via service name `postgres:5432`

**Configuration:**
- Max connections: 200
- Shared buffers: 512MB
- Effective cache size: 1.5GB
- Logging: Enabled (queries > 1 second)
- Timezone: Asia/Bangkok

**Databases:**
```
analytics          - Analytics and reporting data
dashboard          - Internal dashboard application
marketplace        - Marketplace application
tourinthailand     - tourinthailand.travel WordPress
unth_platform      - Main platform database
unthai_website     - UNTH.AI Official Website (Strapi CMS)
wordpress_unth     - unth.ai WordPress
xclusiveworld      - xclusive-world.com WordPress
xheart             - xheart.tv WordPress
```

**Backup Strategy:**
- Schedule: Daily at 2 AM Bangkok time
- Script: `/root/backup-postgres.sh`
- Location: `/local-files/db-backups`
- Retention: 7 days
- Notifications: n8n webhooks (when configured)
  - Success: `/webhook/postgres-backup-success`
  - Failure: `/webhook/postgres-backup-failure`

**Connection Strings:**
```bash
# From Docker containers (same network)
postgresql://postgres:PASSWORD@postgres:5432/[database_name]

# From VPS host (via localhost)
postgresql://postgres:PASSWORD@127.0.0.1:5432/[database_name]

# SSH tunnel from local machine
ssh -L 5432:localhost:5432 root@31.97.139.175 -i ~/.ssh/vps_key
psql postgresql://postgres:PASSWORD@localhost:5432/[database_name]
```

### Static Websites (nginx)

All static sites use `nginx:alpine` image and are served via Traefik with automatic SSL.

1. **tourinthailand.travel**
   - Container: `tourinthailand`
   - Path: `/root/tourinthailand/html`
   - Database: `tourinthailand` (PostgreSQL - for future WordPress)

2. **unth.ai**
   - Container: `unth-www`
   - Path: `/root/unth.ai/www`

3. **dashboard.unth.ai**
   - Container: `unth-dashboard`
   - Path: `/root/unth.ai/dashboard`
   - Database: `dashboard` (PostgreSQL - for future dynamic app)
   - Note: Will be replaced with Next.js application

4. **xclusive-world.com**
   - Container: `xclusiveworld`
   - Path: `/root/xclusiveworld/html`
   - Database: `xclusiveworld` (PostgreSQL - for future WordPress)

5. **xheart.tv**
   - Container: `xheart`
   - Path: `/root/xheart/html`
   - Database: `xheart` (PostgreSQL - for future WordPress)

---

## Docker Volumes

```bash
docker volume ls
```

- **traefik_data** - SSL certificates and Traefik configuration
- **n8n_data** - n8n workflows, credentials, and execution data
- **postgres_data** - PostgreSQL database files

---

## File Structure

```
/root/
├── docker-compose.yml          # Main orchestration file
├── docker-compose.yml.backup   # Backup before PostgreSQL deployment
├── .env                        # Environment variables (credentials)
├── backup-postgres.sh          # PostgreSQL backup script
├── postgres-service.yml        # PostgreSQL service template
├── POSTGRESQL_DEPLOYMENT_PLAN.md  # Full deployment documentation
├── tourinthailand/
│   └── html/                   # Static website files
├── unth.ai/
│   ├── www/                    # Main website
│   └── dashboard/              # Dashboard (static, will be dynamic)
├── xclusiveworld/
│   └── html/                   # Static website files
└── xheart/
    └── html/                   # Static website files

/local-files/
└── db-backups/                 # PostgreSQL backups (7-day retention)
```

---

## Environment Variables

Located in `/root/.env`:

```bash
# Traefik
SSL_EMAIL=mat@unthai.me

# n8n
SUBDOMAIN=n8n
DOMAIN_NAME=unth.ai
GENERIC_TIMEZONE=Asia/Bangkok
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<STRONG_PASSWORD>
POSTGRES_DB=unth_platform
```

---

## Common Operations

### Check Service Status
```bash
docker ps
docker compose ps
```

### View Service Logs
```bash
docker logs root-postgres-1
docker logs root-n8n-1
docker logs root-traefik-1
```

### Restart a Service
```bash
docker compose restart postgres
docker compose restart n8n
docker compose restart traefik
```

### Update a Service
```bash
docker compose pull [service_name]
docker compose up -d [service_name]
```

### PostgreSQL Operations
```bash
# Connect to PostgreSQL
docker exec -it root-postgres-1 psql -U postgres -d [database_name]

# List all databases
docker exec root-postgres-1 psql -U postgres -c "\l"

# Backup manually
/root/backup-postgres.sh

# Restore from backup
gunzip -c /local-files/db-backups/[backup_file].sql.gz | \
  docker exec -i root-postgres-1 psql -U postgres -d [database_name]
```

### n8n Operations
```bash
# Access n8n
# URL: https://n8n.unth.ai

# Check API health
curl -H "X-N8N-API-KEY: $N8N_API_KEY" https://n8n.unth.ai/api/v1/workflows

# View n8n logs
docker logs -f root-n8n-1
```

---

## Maintenance Schedule

- **Daily 2:00 AM** - PostgreSQL backup (automated)
- **Weekly** - Check disk usage and clean old Docker images
- **Monthly** - Review and update Docker images
- **Quarterly** - Security audit and dependency updates

---

## Security Notes

1. **PostgreSQL Access:**
   - NOT exposed to internet (127.0.0.1 binding only)
   - Only accessible within Docker network
   - External access requires SSH tunnel

2. **Backups:**
   - Stored locally in `/local-files/db-backups`
   - 7-day retention policy
   - Directory permissions: 700 (root only)
   - TODO: Implement off-site backup replication

3. **SSL Certificates:**
   - Automatic renewal via Let's Encrypt
   - Managed by Traefik
   - Stored in `traefik_data` volume

4. **n8n Security:**
   - API key authentication required
   - CORS restricted to dashboard.unth.ai
   - Not exposed on public port (only via Traefik)

---

## Future Enhancements

### Immediate (Planned)
- [ ] Configure n8n webhooks for backup notifications
- [ ] Create application-specific database users
- [ ] Implement off-site backup replication
- [ ] Add database connection pooling (PgBouncer)

### WordPress Migration
- [ ] Install WordPress containers for tourinthailand, xclusiveworld, xheart
- [ ] Migrate static content to WordPress
- [ ] Configure WordPress database connections

### Dynamic Applications
- [ ] Deploy Next.js dashboard application
- [ ] Build and deploy marketplace application
- [ ] Implement centralized authentication

### Monitoring & Observability
- [ ] Set up n8n workflow for PostgreSQL health monitoring
- [ ] Add disk space alerts via n8n + Telegram
- [ ] Create backup failure alerts via n8n + Telegram
- [ ] Implement log aggregation

### Performance Optimization
- [ ] Add PgBouncer for connection pooling
- [ ] Configure PostgreSQL read replicas (if needed)
- [ ] Implement Redis for caching (if needed)

---

## Troubleshooting

### PostgreSQL won't start
```bash
# Check logs
docker logs root-postgres-1

# Check disk space
df -h

# Verify volume exists
docker volume ls | grep postgres_data

# Check configuration
docker compose config | grep -A 20 postgres:
```

### n8n workflows not executing
```bash
# Check n8n status
docker ps | grep n8n

# View n8n logs
docker logs -f root-n8n-1

# Verify database connection
docker exec root-n8n-1 wget -q --spider http://localhost:5678 && echo "n8n is running"
```

### SSL certificate issues
```bash
# Check Traefik logs
docker logs root-traefik-1

# Verify DNS points to VPS
dig +short [domain_name]

# Check certificate status
docker exec root-traefik-1 cat /letsencrypt/acme.json | grep -i [domain_name]
```

### Backup failures
```bash
# Check backup log
tail -50 /var/log/postgres-backup.log

# Verify disk space
df -h /local-files

# Run manual backup
/root/backup-postgres.sh

# Check cron job
crontab -l | grep backup-postgres
```

---

## Contact & Support

**System Administrator:** mat@unthai.me  
**Documentation:** /root/VPS.md  
**Deployment Plan:** /root/POSTGRESQL_DEPLOYMENT_PLAN.md  
**n8n Platform:** https://n8n.unth.ai

---

## Changelog

### 2026-02-06 - PostgreSQL Deployment
- Deployed PostgreSQL 16-alpine via Docker Compose
- Created 8 application databases
- Configured automated daily backups
- Scheduled cron job for 2 AM backup
- Updated docker-compose.yml with PostgreSQL service
- Created comprehensive deployment documentation

### 2026-01-XX - Initial Setup
- Deployed Traefik reverse proxy
- Deployed n8n automation platform
- Deployed 5 static websites
- Configured Let's Encrypt SSL
- Set up Docker Compose orchestration

