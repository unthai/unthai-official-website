import qs from 'qs';

/**
 * Get the Strapi URL from environment variables
 * @returns {string} The Strapi URL
 */
export const getStrapiURL = (path = '') => {
    return `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${path}`;
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
        constresponse = await fetch(requestUrl, mergedOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${requestUrl}:`, error);
        throw error;
    }
};

/**
 * Helper to get media URL
 * @param {Object} media The media object from Strapi
 * @returns {string} The full URL to the media
 */
export const getMediaURL = (media) => {
    if (!media || !media.data || !media.data.attributes) {
        return '';
    }
    const { url } = media.data.attributes;
    const imageUrl = url.startsWith('/') ? getStrapiURL(url) : url;
    return imageUrl;
};
