import qs from 'qs';

/* ─── In-memory cache with TTL ───────────────────────────── */

const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieve a cached value by key. Returns undefined if missing or expired.
 */
const cacheGet = (key) => {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return undefined;
    }
    return entry.data;
};

/**
 * Store a value in cache with an optional TTL in milliseconds.
 */
const cacheSet = (key, data, ttl = DEFAULT_TTL) => {
    cache.set(key, { data, expiry: Date.now() + ttl });
};

/**
 * Build a stable cache key from the request URL + serialized options.
 */
const cacheKey = (url, options) => `${url}::${JSON.stringify(options)}`;

/* ─── Public API ─────────────────────────────────────────── */

/**
 * Get the Strapi URL from environment variables
 * @returns {string} The Strapi URL
 */
export const getStrapiURL = (path = '') => {
    const base = import.meta.env.VITE_STRAPI_URL;
    // Dev mode: use relative URLs so Vite proxy handles forwarding to the API server
    if (import.meta.env.DEV || !base) return path;
    return `${base}${path}`;
};

/**
 * Invalidate all cached entries (useful after language change or forced refresh).
 */
export const clearCache = () => {
    cache.clear();
};

/**
 * Build a full Strapi request URL from path + params.
 */
export const buildStrapiUrl = (path, urlParamsObject = {}) => {
    const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    return `${getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ''}`
    )}`;
};

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path The API path (e.g. '/api/hero')
 * @param {Object} urlParamsObject URL parameters object, will be stringified using qs
 * @param {Object} options Options passed to fetch
 * @returns Parsed JSON API response
 */
export const fetchAPI = async (path, urlParamsObject = {}, options = {}) => {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
    const requestUrl = `${getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ''}`
    )}`;

    // Trigger API call
    try {
        const response = await fetch(requestUrl, mergedOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${requestUrl}:`, error);
        throw error;
    }
};

/**
 * Cached version of fetchAPI. Returns cached data if available within TTL,
 * otherwise fetches, caches, and returns.
 *
 * @param {string} path
 * @param {Object} urlParamsObject
 * @param {Object} options
 * @param {number} [options.cacheTtl]  TTL in ms (default 5 min)
 * @returns Parsed JSON API response
 */
export const fetchAPICached = async (path, urlParamsObject = {}, options = {}) => {
    // Strip non-cache-relevant fields so they don't pollute the cache key
    const { cacheTtl, signal, ...fetchOptions } = options;
    const url = buildStrapiUrl(path, urlParamsObject);
    const key = cacheKey(url, fetchOptions);

    const cached = cacheGet(key);
    if (cached !== undefined) return cached;

    const data = await fetchAPI(path, urlParamsObject, fetchOptions);
    cacheSet(key, data, cacheTtl);
    return data;
};

/**
 * Helper to get media URL
 * @param {Object} media The media object from Strapi
 * @returns {string} The full URL to the media
 */
export const getMediaURL = (media) => {
    if (!media || !media.data) {
        return '';
    }
    const data = media.data;
    // Handle both v4 (data.attributes.url) and v5 (data.url)
    const url = (data.attributes && data.attributes.url) ? data.attributes.url : data.url;

    if (!url) return '';

    const imageUrl = url.startsWith('/') ? getStrapiURL(url) : url;
    return imageUrl;
};
