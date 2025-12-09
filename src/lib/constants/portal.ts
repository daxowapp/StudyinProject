/**
 * Portal Configuration
 * 
 * This file provides utilities for multi-portal architecture.
 * Each portal (studyatchina, studyatspain, etc.) uses the same
 * Supabase database, isolated by portal_key.
 */

export const PORTAL_KEY = process.env.NEXT_PUBLIC_PORTAL_KEY || 'studyatchina';

/**
 * Helper to add portal_key to insert objects
 */
export function withPortalKey<T extends Record<string, unknown>>(data: T): T & { portal_key: string } {
    return { ...data, portal_key: PORTAL_KEY };
}
