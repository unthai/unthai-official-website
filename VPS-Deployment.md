# 🚀 UNTH.AI - VPS Deployment Guide

This guide provides the exact steps to deploy the new **Strapi + React** version of the UNTHAI website to your production VPS.

## 📁 1. Sync Files to VPS
Transfer these folders/files from your local machine to the VPS:
*   **Backend**: `strapi/` folder
    *   *Include:* `.tmp/data.db` (SQLite database with your seeded content)
    *   *Exclude:* `node_modules/` (install fresh on VPS)
*   **Frontend**: `dist/` folder (generated via `npm run build`)
*   **Orchestration**: `ecosystem.config.js` (PM2 configuration)

---

## 🔑 2. Environment Configuration
Create a `.env` file inside the `strapi/` folder on your VPS. 

**Recommended content (based on local secrets):**
```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Secrets (Unique Production Keys)
APP_KEYS=gU7KFf12S4vr5JckvXx8QpgTMhmMjXpmhTsc86MI+sw=,Uo/xtuJgoRnrrVSfX4RGA79ZjIeU2mG48IXvF/2/AvA=,9LmXYyESWNUoSAynjbrQNOJJYRWEcR7JDFedp+A9v/g=,vuh0cWqo9vuIR6fFih4RM/yuQhMY0/vk9qPFsb/oeRM=
API_TOKEN_SALT=+Z0ffV5syJX7OJ39ZA9Q8rUoJApdX956yo0P8albXvk=
ADMIN_JWT_SECRET=Fxe2mnDpD0PynU+Hp6vd7hJLHn8W0awkB4TIdx/zuYk=
TRANSFER_TOKEN_SALT=MdSQplLoab7oUIYrZX87ZQPD+UNDYsbbvBTfksB2d4I=
ENCRYPTION_KEY=ukG1e9O5RmTvjAjkmxfNGpXqPKFzNu9oqcrk2tW9B/o=
JWT_SECRET=c7IxgRrsKG8o/Y1o09IcuZSzOLhFsUJP5zJh9PYHXFg=

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

---

## ⚙️ 3. Backend Setup (Strapi)
Run these commands inside the `strapi/` directory on your VPS:

```bash
# 1. Install production dependencies
npm install --omit=dev

# 2. Build the Strapi Admin UI
npm run build

# 3. Start with PM2 (using the root config)
cd ..
pm2 start ecosystem.config.js --env production
```

---

## 🌐 4. Nginx Configuration
Update your Nginx config to serve the frontend and proxy the backend:

```nginx
server {
    server_name unth.ai;
    root /var/www/unth.ai/dist; # Point to your dist folder
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Strapi API & Admin
    location /api/ {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ 5. Final Verification
1.  Check **https://unth.ai** to see if content loads.
2.  Check **https://unth.ai/admin** to access the CMS.
3.  Test the **Language Switcher** (EN/JA).
