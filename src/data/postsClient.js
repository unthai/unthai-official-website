// Strapi-aware posts client.
// Tries the Strapi API at VITE_STRAPI_URL (or api.unth.ai by default).
// Falls back to the local posts.js if Strapi is unreachable or has no `posts` content-type yet.

import { posts as localPosts, getPostBySlug as getLocalPostBySlug } from './posts';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://api.unth.ai';
const FETCH_TIMEOUT_MS = 4000;

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

export const fetchPosts = async () => {
    try {
        const res = await withTimeout(
            fetch(`${STRAPI_URL}/api/posts?populate=image&sort=date:desc`),
            FETCH_TIMEOUT_MS,
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const data = json.data || [];
        if (data.length === 0) return localPosts;
        return data.map(mapStrapiPost);
    } catch {
        return localPosts;
    }
};

export const fetchPostBySlug = async (slug) => {
    try {
        const res = await withTimeout(
            fetch(`${STRAPI_URL}/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=image`),
            FETCH_TIMEOUT_MS,
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const data = json.data || [];
        if (data.length === 0) return getLocalPostBySlug(slug) || null;
        return mapStrapiPost(data[0]);
    } catch {
        return getLocalPostBySlug(slug) || null;
    }
};
