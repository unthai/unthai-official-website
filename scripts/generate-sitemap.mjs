#!/usr/bin/env node
// Generates public/sitemap.xml from static routes + blog posts.
// Includes <image:image> entries for blog post hero images.
// Run: node scripts/generate-sitemap.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT, 'src/data/posts.js');
const OUT = path.join(ROOT, 'public/sitemap.xml');
const SITE = 'https://unth.ai';

const today = new Date().toISOString().slice(0, 10);

const src = fs.readFileSync(POSTS_FILE, 'utf8');
const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const dates = [...src.matchAll(/date:\s*'([^']+)'/g)].map((m) => m[1]);
const titles = [...src.matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1]);
// image: imgFoo  → import map
const imageRefs = [...src.matchAll(/image:\s*(\w+)/g)].map((m) => m[1]);
const imports = Object.fromEntries(
    [...src.matchAll(/import\s+(\w+)\s+from\s+'([^']+)';/g)].map((m) => [m[1], m[2]]),
);

const resolveImage = (varName) => {
    const rel = imports[varName];
    if (!rel) return null;
    // src/assets/foo.png  → /foo.png in public? No — bundled by Vite.
    // For sitemap we point to the original public asset name as a stable URL.
    const file = path.basename(rel);
    return `${SITE}/${file}`;
};

const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/services', priority: '0.9', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
];

const staticXml = staticRoutes.map((r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');

const blogXml = slugs.map((slug, i) => {
    const lastmod = dates[i] || today;
    const imgUrl = resolveImage(imageRefs[i]);
    const imgTag = imgUrl ? `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${escapeXml(titles[i] || slug)}</image:title>
    </image:image>` : '';
    return `  <url>
    <loc>${SITE}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imgTag}
  </url>`;
}).join('\n');

function escapeXml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemaps-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticXml}
${blogXml}
</urlset>
`;

fs.writeFileSync(OUT, xml);
console.log(`Wrote ${staticRoutes.length + slugs.length} URLs to ${path.relative(ROOT, OUT)}`);
