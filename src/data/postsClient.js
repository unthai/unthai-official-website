// Strapi-aware posts client with in-memory caching.
// Tries the Strapi API at VITE_STRAPI_URL (or api.unth.ai by default).
// Falls back to the local posts.js if Strapi is unreachable or has no `posts` content-type yet.

import { posts as localPosts, getPostBySlug as getLocalPostBySlug } from './posts';
import { clearCache as clearStrapiCache } from '../lib/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://api.unth.ai';
const FETCH_TIMEOUT_MS = 4000;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ─── In-memory cache ────────────────────────────────────── */

const postsCache = new Map();

const cacheGet = (key) => {
    const entry = postsCache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
        postsCache.delete(key);
        return undefined;
    }
    return entry.data;
};

const cacheSet = (key, data) => {
    postsCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
};

/**
 * Clear all cached post data (useful after Strapi content update notification).
 */
export const clearPostsCache = () => {
    postsCache.clear();
    clearStrapiCache();
};

/* ─── Helpers ────────────────────────────────────────────── */

const withTimeout = (promise, ms) =>
    Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
    ]);

const mapStrapiPost = (entry) => {
    const a = entry.attributes || entry;
    const image =
        a.image?.data?.attributes?.url
            ? (a.image.data.attributes.url.startsWith('http')
                ? a.image.data.attributes.url
                : `${STRAPI_URL}${a.image.data.attributes.url}`)
            : a.imageUrl || null;
    return {
        id: entry.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        date: a.date || a.publishedAt,
        category: a.category,
        readTime: a.readTime || '5 min read',
        image,
        body: Array.isArray(a.body)
            ? a.body
            : typeof a.body === 'string'
                ? a.body.split(/\n\n+/).filter(Boolean)
                : [],
    };
};

/* ─── Public API ─────────────────────────────────────────── */

export const fetchPosts = async () => {
    const cacheKey = 'all_posts';
    const cached = cacheGet(cacheKey);
    if (cached !== undefined) return cached;

    try {
        const res = await withTimeout(
            fetch(`${STRAPI_URL}/api/posts?populate=image&sort=date:desc`),
            FETCH_TIMEOUT_MS,
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const data = json.data || [];
        if (data.length === 0) {
            cacheSet(cacheKey, localPosts);
            return localPosts;
        }
        const mapped = data.map(mapStrapiPost);
        cacheSet(cacheKey, mapped);
        return mapped;
    } catch {
        cacheSet(cacheKey, localPosts);
        return localPosts;
    }
};

export const fetchPostBySlug = async (slug) => {
    const cacheKey = `post_${slug}`;
    const cached = cacheGet(cacheKey);
    if (cached !== undefined) return cached;

    try {
        const res = await withTimeout(
            fetch(`${STRAPI_URL}/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=image`),
            FETCH_TIMEOUT_MS,
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const data = json.data || [];
        if (data.length === 0) {
            const fallback = getLocalPostBySlug(slug) || null;
            cacheSet(cacheKey, fallback);
            return fallback;
        }
        const mapped = mapStrapiPost(data[0]);
        cacheSet(cacheKey, mapped);
        return mapped;
    } catch {
        const fallback = getLocalPostBySlug(slug) || null;
        cacheSet(cacheKey, fallback);
        return fallback;
    }
};
