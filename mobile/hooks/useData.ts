import { useEffect, useState } from 'react';
import { supabase, University, Program } from '../lib/supabase';
import { appCache } from '../lib/storage';

// Hook to fetch universities with offline support
export function useUniversities() {
    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        fetchUniversities();
    }, []);

    async function fetchUniversities() {
        try {
            setLoading(true);
            setIsOffline(false);

            console.log('[useUniversities] Fetching from Supabase...');

            const { data, error } = await supabase
                .from('universities')
                .select('id, name, slug, city, ranking, logo_url')
                .order('ranking', { ascending: true, nullsFirst: false })
                .limit(50);

            if (error) {
                console.error('[useUniversities] Supabase error:', JSON.stringify(error, null, 2));
                throw error;
            }

            console.log('[useUniversities] Fetched', data?.length, 'universities');

            // Cache the data
            if (data) {
                await appCache.setUniversities(data);
            }

            setUniversities(data || []);
        } catch (err) {
            console.error('[useUniversities] Error:', err);
            // Try to load from cache
            const cached = await appCache.getUniversitiesStale();
            if (cached && cached.length > 0) {
                console.log('[useUniversities] Using cached data:', cached.length, 'universities');
                setUniversities(cached as University[]);
                setIsOffline(true);
            } else {
                setError((err as Error).message);
            }
        } finally {
            setLoading(false);
        }
    }

    return { universities, loading, error, isOffline, refetch: fetchUniversities };
}

// Hook to fetch a single university by slug
export function useUniversity(slug: string) {
    const [university, setUniversity] = useState<University | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) fetchUniversity();
    }, [slug]);

    async function fetchUniversity() {
        try {
            setLoading(true);

            // Fetch university
            const { data: uniData, error: uniError } = await supabase
                .from('universities')
                .select('*')
                .eq('slug', slug)
                .single();

            if (uniError) throw uniError;
            setUniversity(uniData);

            // Fetch programs for this university
            if (uniData) {
                const { data: progData, error: progError } = await supabase
                    .from('university_programs')
                    .select('*')
                    .eq('university_id', uniData.id)
                    .eq('is_active', true)
                    .order('title');

                if (!progError) {
                    setPrograms(progData || []);
                }
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return { university, programs, loading, error };
}

// Hook to fetch featured programs with caching
export function useFeaturedPrograms() {
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    async function fetchPrograms() {
        try {
            setLoading(true);

            // Check cache first
            const cached = await appCache.getPrograms();
            if (cached && cached.length > 0) {
                setPrograms(cached as any[]);
                setLoading(false);
            }

            const { data, error } = await supabase
                .from('university_programs')
                .select('*, universities(name, slug)')
                .eq('is_active', true)
                .limit(6);

            if (!error && data) {
                // Transform data to include university_name
                const transformed = data.map((p: any) => ({
                    ...p,
                    university_name: p.universities?.name || 'University'
                }));
                await appCache.setPrograms(transformed);
                setPrograms(transformed);
            }
        } catch {
            // Try stale cache
            const cached = await appCache.getProgramsStale();
            if (cached) {
                setPrograms(cached as any[]);
            }
        } finally {
            setLoading(false);
        }
    }

    return { programs, loading };
}

// Hook to search programs
export function useSearchPrograms(query: string) {
    const [results, setResults] = useState<Program[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length >= 2) {
            searchPrograms();
        } else {
            setResults([]);
        }
    }, [query]);

    async function searchPrograms() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('university_programs')
                .select('*, universities(name)')
                .or(`title.ilike.%${query}%`)
                .eq('is_active', true)
                .limit(10);

            if (!error) {
                setResults(data || []);
            }
        } catch {
            // Silent fail for search
        } finally {
            setLoading(false);
        }
    }

    return { results, loading };
}
