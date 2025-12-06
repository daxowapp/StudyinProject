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

            // Try to fetch from network
            const { data, error } = await supabase
                .from('universities')
                .select('*')
                .order('ranking', { ascending: true, nullsFirst: false })
                .limit(50);

            if (error) throw error;

            // Cache the data
            if (data) {
                await appCache.setUniversities(data);
            }

            setUniversities(data || []);
        } catch (err) {
            // Try to load from cache
            const cached = await appCache.getUniversitiesStale();
            if (cached && cached.length > 0) {
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
                .from('v_university_programs_full')
                .select('*')
                .eq('is_active', true)
                .limit(6);

            if (!error && data) {
                await appCache.setPrograms(data);
                setPrograms(data);
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

// Hook to fetch scholarships with caching
export function useScholarships() {
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        fetchScholarships();
    }, []);

    async function fetchScholarships() {
        try {
            setLoading(true);
            setIsOffline(false);

            const { data, error } = await supabase
                .from('scholarships')
                .select('*')
                .eq('is_active', true)
                .order('deadline', { ascending: true });

            if (error) throw error;

            if (data) {
                await appCache.setScholarships(data);
            }

            setScholarships(data || []);
        } catch (err) {
            // Try cached data
            const cached = await appCache.getScholarshipsStale();
            if (cached && cached.length > 0) {
                setScholarships(cached as any[]);
                setIsOffline(true);
            } else {
                setError((err as Error).message);
            }
        } finally {
            setLoading(false);
        }
    }

    return { scholarships, loading, error, isOffline, refetch: fetchScholarships };
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
                .from('v_university_programs_full')
                .select('*')
                .or(`title.ilike.%${query}%,university_name.ilike.%${query}%`)
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
