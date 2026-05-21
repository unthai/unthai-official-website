#!/usr/bin/env node
// Pings Google + Bing + IndexNow with sitemap URL.
// Run post-deploy: node scripts/ping-search-engines.mjs

const SITEMAP = 'https://unth.ai/sitemap.xml';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || ''; // 32-hex key, also at public/<key>.txt

const targets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
];

if (INDEXNOW_KEY) {
    targets.push(`https://api.indexnow.org/indexnow?url=${encodeURIComponent('https://unth.ai/')}&key=${INDEXNOW_KEY}`);
}

for (const url of targets) {
    try {
        const res = await fetch(url, { method: 'GET' });
        console.log(`${res.status} ${url}`);
    } catch (e) {
        console.error(`FAIL ${url} → ${e.message}`);
    }
}
