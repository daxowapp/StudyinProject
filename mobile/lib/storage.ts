import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache keys
const CACHE_KEYS = {
    UNIVERSITIES: 'cache:universities',
    PROGRAMS: 'cache:programs',
    SCHOLARSHIPS: 'cache:scholarships',
    USER_APPLICATIONS: 'cache:user_applications',
    USER_MESSAGES: 'cache:user_messages',
    LAST_SYNC: 'cache:last_sync',
};

// Generic cache helpers using AsyncStorage
export const cache = {
    // Set data with timestamp
    set: async <T>(key: string, data: T) => {
        const cached = {
            data,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(key, JSON.stringify(cached));
    },

    // Get cached data (returns null if expired or not found)
    get: async <T>(key: string, maxAgeMs: number = 5 * 60 * 1000): Promise<T | null> => {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;

        try {
            const cached = JSON.parse(raw);
            const age = Date.now() - cached.timestamp;

            // Return null if cache is expired
            if (age > maxAgeMs) {
                return null;
            }

            return cached.data as T;
        } catch {
            return null;
        }
    },

    // Get cached data even if expired (for offline fallback)
    getStale: async <T>(key: string): Promise<T | null> => {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;

        try {
            const cached = JSON.parse(raw);
            return cached.data as T;
        } catch {
            return null;
        }
    },

    // Clear specific cache
    clear: async (key: string) => {
        await AsyncStorage.removeItem(key);
    },

    // Clear all cache
    clearAll: async () => {
        const keys = Object.values(CACHE_KEYS);
        await AsyncStorage.multiRemove(keys);
    },
};

// Specific helpers for app data
export const appCache = {
    // Universities
    setUniversities: (data: unknown[]) => cache.set(CACHE_KEYS.UNIVERSITIES, data),
    getUniversities: () => cache.get<unknown[]>(CACHE_KEYS.UNIVERSITIES),
    getUniversitiesStale: () => cache.getStale<unknown[]>(CACHE_KEYS.UNIVERSITIES),

    // Programs
    setPrograms: (data: unknown[]) => cache.set(CACHE_KEYS.PROGRAMS, data),
    getPrograms: () => cache.get<unknown[]>(CACHE_KEYS.PROGRAMS),
    getProgramsStale: () => cache.getStale<unknown[]>(CACHE_KEYS.PROGRAMS),

    // Scholarships
    setScholarships: (data: unknown[]) => cache.set(CACHE_KEYS.SCHOLARSHIPS, data),
    getScholarships: () => cache.get<unknown[]>(CACHE_KEYS.SCHOLARSHIPS),
    getScholarshipsStale: () => cache.getStale<unknown[]>(CACHE_KEYS.SCHOLARSHIPS),

    // User applications (longer cache)
    setApplications: (data: unknown[]) => cache.set(CACHE_KEYS.USER_APPLICATIONS, data),
    getApplications: () => cache.get<unknown[]>(CACHE_KEYS.USER_APPLICATIONS, 10 * 60 * 1000),
    getApplicationsStale: () => cache.getStale<unknown[]>(CACHE_KEYS.USER_APPLICATIONS),

    // User messages
    setMessages: (data: unknown[]) => cache.set(CACHE_KEYS.USER_MESSAGES, data),
    getMessages: () => cache.get<unknown[]>(CACHE_KEYS.USER_MESSAGES, 2 * 60 * 1000),
    getMessagesStale: () => cache.getStale<unknown[]>(CACHE_KEYS.USER_MESSAGES),
};

// Auth token storage (separate from cache)
export const authStorage = {
    setToken: async (token: string) => AsyncStorage.setItem('auth:token', token),
    getToken: () => AsyncStorage.getItem('auth:token'),
    clearToken: () => AsyncStorage.removeItem('auth:token'),
};
