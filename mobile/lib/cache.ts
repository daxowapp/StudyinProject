import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

// Default TTL values (in milliseconds)
export const CACHE_TTL = {
    UNIVERSITIES: 24 * 60 * 60 * 1000, // 24 hours
    PROGRAMS: 24 * 60 * 60 * 1000, // 24 hours
    CITIES: 7 * 24 * 60 * 60 * 1000, // 7 days
    USER_DATA: 1 * 60 * 60 * 1000, // 1 hour
    APPLICATIONS: 5 * 60 * 1000, // 5 minutes
};

const CACHE_PREFIX = '@cache_';

/**
 * Get data from cache or fetch fresh data
 */
export async function getWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number,
    forceRefresh: boolean = false
): Promise<{ data: T; fromCache: boolean; timestamp: number | null }> {
    const cacheKey = CACHE_PREFIX + key;

    // Try to get cached data first (if not forcing refresh)
    if (!forceRefresh) {
        try {
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) {
                const entry: CacheEntry<T> = JSON.parse(cached);
                const now = Date.now();

                // Check if cache is still valid
                if (now - entry.timestamp < entry.ttl) {
                    return { data: entry.data, fromCache: true, timestamp: entry.timestamp };
                }
            }
        } catch (error) {
            console.warn('Cache read error:', error);
        }
    }

    // Fetch fresh data
    try {
        const freshData = await fetcher();

        // Store in cache
        const entry: CacheEntry<T> = {
            data: freshData,
            timestamp: Date.now(),
            ttl,
        };
        await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));

        return { data: freshData, fromCache: false, timestamp: Date.now() };
    } catch (fetchError) {
        // If fetch fails, try to return stale cache data
        try {
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) {
                const entry: CacheEntry<T> = JSON.parse(cached);
                console.log('Using stale cache data due to fetch error');
                return { data: entry.data, fromCache: true, timestamp: entry.timestamp };
            }
        } catch {
            // Cache also failed
        }

        // Both fetch and cache failed
        throw fetchError;
    }
}

/**
 * Set data in cache directly
 */
export async function setCache<T>(key: string, data: T, ttl: number): Promise<void> {
    const cacheKey = CACHE_PREFIX + key;
    const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
}

/**
 * Get cached data only (without fetching)
 */
export async function getCacheOnly<T>(key: string): Promise<T | null> {
    const cacheKey = CACHE_PREFIX + key;
    try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
            const entry: CacheEntry<T> = JSON.parse(cached);
            return entry.data;
        }
    } catch {
        // Ignore errors
    }
    return null;
}

/**
 * Clear specific cache entry
 */
export async function clearCache(key: string): Promise<void> {
    const cacheKey = CACHE_PREFIX + key;
    await AsyncStorage.removeItem(cacheKey);
}

/**
 * Clear all cache entries
 */
export async function clearAllCache(): Promise<void> {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const cacheKeys = allKeys.filter(k => k.startsWith(CACHE_PREFIX));
        await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

/**
 * Get cache age in human readable format
 */
export function getCacheAge(timestamp: number | null): string {
    if (!timestamp) return '';

    const now = Date.now();
    const age = now - timestamp;

    const minutes = Math.floor(age / (60 * 1000));
    const hours = Math.floor(age / (60 * 60 * 1000));
    const days = Math.floor(age / (24 * 60 * 60 * 1000));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}
