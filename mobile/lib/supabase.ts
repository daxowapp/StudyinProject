import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Check if we're on web
const isWeb = Platform.OS === 'web';

// Custom storage adapter that works on both web and native
const ExpoSecureStoreAdapter = {
    getItem: async (key: string): Promise<string | null> => {
        if (isWeb) {
            // Use localStorage on web
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
            return null;
        }
        // Use SecureStore on native
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (isWeb) {
            // Use localStorage on web
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
            }
            return;
        }
        // Use SecureStore on native
        await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
        if (isWeb) {
            // Use localStorage on web
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
            return;
        }
        // Use SecureStore on native
        await SecureStore.deleteItemAsync(key);
    },
};

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mxmrdnzmaztskbkqeusm.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bXJkbnptYXp0c2tia3FldXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzk5MjIsImV4cCI6MjA3OTgxNTkyMn0.BjPnOV0EyLJiwbEt043iO87ONkcqlGTcV7XB2tfDqks';

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
    cover_photo_url?: string;
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
