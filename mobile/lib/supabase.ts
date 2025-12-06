import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Custom storage adapter for Expo SecureStore
const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
};

// Supabase configuration
// In production, use environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mxmrdnzmaztskbkqeusm.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bXJkbnptYXp0c2ticWV1c20iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMjg4NzExMSwiZXhwIjoyMDQ4NDYzMTExfQ.TE4bE_S-aafykyjL-Pm5lbtJUKj_5bEYcDXpSfAFjpc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Types for database
export type University = {
    id: string;
    name: string;
    slug: string;
    city: string;
    province?: string;
    description?: string;
    website?: string;
    logo_url?: string;
    ranking?: number;
    founded?: number;
    total_students?: number;
    international_students?: number;
};

export type Program = {
    id: string;
    title: string;
    slug: string;
    level: string;
    field?: string;
    duration?: string;
    tuition_fee?: number;
    tuition_currency?: string;
    language?: string;
    description?: string;
    university_id: string;
    university?: University;
};

export type Scholarship = {
    id: string;
    name: string;
    type: string;
    description?: string;
    award_amount?: number;
    deadline?: string;
    eligibility?: string;
    is_active: boolean;
};
