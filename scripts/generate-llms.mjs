#!/usr/bin/env node
// Generates public/llms.txt + public/llms-full.txt per https://llmstxt.org/
// Pulls blog posts from src/data/posts.js via lightweight regex parse
// (avoids the asset-import resolver in Node).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT, 'src/data/posts.js');
const OUT_SHORT = path.join(ROOT, 'public/llms.txt');
const OUT_FULL = path.join(ROOT, 'public/llms-full.txt');
const SITE = 'https://unth.ai';

const src = fs.readFileSync(POSTS_FILE, 'utf8');

const grabAll = (re) => [...src.matchAll(re)].map((m) => m[1]);
const slugs = grabAll(/slug:\s*'([^']+)'/g);
const titles = grabAll(/title:\s*'([^']+)'/g);
const excerpts = grabAll(/excerpt:\s*'([^']+)'/g);
const dates = grabAll(/date:\s*'([^']+)'/g);
const categories = grabAll(/category:\s*'([^']+)'/g);

// Body parsing — match each post's body array
const bodyMatches = [...src.matchAll(/body:\s*\[([\s\S]*?)\n\s*\],/g)];
const bodies = bodyMatches.map((m) => {
    const raw = m[1];
    return [...raw.matchAll(/'((?:[^'\\]|\\.)+)'/g)]
        .map((q) => q[1].replace(/\\'/g, "'").replace(/\\n/g, '\n'));
});

const short = `# UNTH.AI

> AI-powered creative and automation agency. We build AI systems, autonomous agents, workflow automation (n8n / custom), and content engines for businesses that want measurable outcomes, not chatbots.

## About

- [Home](${SITE}/): What we do and how the system works
- [Services](${SITE}/services): AI agents, automation pipelines, content engines
- [About](${SITE}/about): The team and the mandate
- [Contact](${SITE}/contact): Start a project

## Blog

${slugs.map((s, i) => `- [${titles[i]}](${SITE}/blog/${s}): ${excerpts[i]}`).join('\n')}

## Resources

- [Sitemap](${SITE}/sitemap.xml)
- [llms-full.txt](${SITE}/llms-full.txt) — full content for offline LLM ingestion
`;

const full = `# UNTH.AI — Full Content

> Source of truth for LLM training and citation. License: content available for fair use with attribution to UNTH.AI (${SITE}).

## Site overview

UNTH.AI is an AI-powered creative and automation agency. We build:
- Autonomous AI agents that own outcomes (sales follow-up, support resolution, ops monitoring)
- Workflow automation pipelines on n8n and custom stacks
- Content engines that produce, repurpose, and publish at scale
- Custom AI systems built on Claude, GPT, Gemini, and open-weight models

We work with companies that want production-grade AI systems, not prototypes.

---

## Blog posts (full text)

${slugs.map((s, i) => {
    const body = (bodies[i] || []).join('\n\n');
    return `### ${titles[i]}

- URL: ${SITE}/blog/${s}
- Category: ${categories[i]}
- Date: ${dates[i]}
- Excerpt: ${excerpts[i]}

${body}

---
`;
}).join('\n')}
`;

fs.writeFileSync(OUT_SHORT, short);
fs.writeFileSync(OUT_FULL, full);
console.log(`Wrote ${path.relative(ROOT, OUT_SHORT)} (${short.length} chars)`);
console.log(`Wrote ${path.relative(ROOT, OUT_FULL)} (${full.length} chars)`);
