import { useEffect, useState } from 'react';
import { supabase, University, Program } from '../lib/supabase';
import { appCache } from '../lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
                .select('id, name, slug, city, ranking, logo_url, cover_photo_url, programs:university_programs(count)')
                .order('ranking', { ascending: true, nullsFirst: false });
            // .limit(50);

            if (error) {
                console.error('[useUniversities] Supabase error:', JSON.stringify(error, null, 2));
                throw error;
            }

            // Map data to include program_count
            const universitiesWithCount = (data || []).map((uni: any) => ({
                ...uni,
                program_count: uni.programs?.[0]?.count || 0,
                programs: undefined // Clean up
            }));

            console.log('[useUniversities] Fetched', universitiesWithCount.length, 'universities');
            // Shuffle
            setUniversities(universitiesWithCount.sort(() => 0.5 - Math.random()));
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

// Hook to fetch a single university by slug with its programs, accommodation, and scholarships
export function useUniversity(slug: string) {
    const [university, setUniversity] = useState<University | null>(null);
    const [programs, setPrograms] = useState<any[]>([]);
    const [accommodation, setAccommodation] = useState<any[]>([]);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) fetchUniversity();
    }, [slug]);

    async function fetchUniversity() {
        try {
            setLoading(true);
            console.log('[useUniversity] Fetching university:', slug);

            // Fetch university with all details
            const { data: uniData, error: uniError } = await supabase
                .from('universities')
                .select('*')
                .eq('slug', slug)
                .single();

            if (uniError) throw uniError;
            setUniversity(uniData);

            // Fetch programs from the view (has proper titles and all data)
            if (uniData) {
                const { data: progData, error: progError } = await supabase
                    .from('v_university_programs_full')
                    .select('*')
                    .eq('university_id', uniData.id)
                    .eq('is_active', true)
                    .order('program_title');

                if (!progError && progData) {
                    // Transform programs to have consistent title field
                    const transformed = progData.map((p: any) => ({
                        ...p,
                        title: p.display_title || p.program_title || 'Program',
                        university_logo: uniData.logo_url,
                        university_cover: uniData.cover_photo_url,
                    }));
                    setPrograms(transformed);
                    console.log('[useUniversity] Fetched', transformed.length, 'programs');
                }

                // Fetch accommodation types
                const { data: accData } = await supabase
                    .from('university_accommodation')
                    .select('*')
                    .eq('university_id', uniData.id)
                    .order('display_order');

                if (accData) {
                    setAccommodation(accData);
                    console.log('[useUniversity] Fetched', accData.length, 'accommodation types');
                }

                // Fetch scholarships
                const { data: schData } = await supabase
                    .from('university_scholarships')
                    .select('*')
                    .eq('university_id', uniData.id)
                    .eq('is_active', true)
                    .order('display_order');

                if (schData) {
                    setScholarships(schData);
                    console.log('[useUniversity] Fetched', schData.length, 'scholarships');
                }
            }
        } catch (err) {
            console.error('[useUniversity] Error:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }


    return { university, programs, accommodation, scholarships, loading, error, refetch: fetchUniversity };
}

// Hook to fetch unique cities from universities
export function useCities() {
    const [cities, setCities] = useState<{ name: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCities();
    }, []);

    async function fetchCities() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('universities')
                .select('city')
                .not('city', 'is', null);

            if (error) throw error;

            // Count universities per city
            const cityCounts: Record<string, number> = {};
            data?.forEach((item: any) => {
                const city = item.city;
                if (city) {
                    cityCounts[city] = (cityCounts[city] || 0) + 1;
                }
            });

            // Convert to array and sort by count
            const uniqueCities = Object.entries(cityCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);

            setCities(uniqueCities);
        } catch (err) {
            console.error('[useCities] Error:', err);
        } finally {
            setLoading(false);
        }
    }

    return { cities, loading };
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

            // Step 1: Fetch programs from the view (which has no FK relationship)
            const { data: programsData, error: programsError } = await supabase
                .from('v_university_programs_full')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            // .limit(50); // Fetch all for variety

            if (programsError) {
                console.error('[useFeaturedPrograms] Error fetching programs:', programsError);
                throw programsError;
            }

            if (!programsData || programsData.length === 0) {
                setPrograms([]);
                return;
            }

            // Shuffle and take 10
            const shuffled = programsData.sort(() => 0.5 - Math.random()).slice(0, 10);

            // Step 2: Extract unique university IDs from shuffled list
            const universityIds = [...new Set(shuffled.map((p: any) => p.university_id))];

            const { data: universitiesData } = await supabase
                .from('universities')
                .select('id, name, slug, city, cover_photo_url, logo_url')
                .in('id', universityIds);

            // Step 3: Create a Map for O(1) lookup and merge
            const universityMap = new Map(
                universitiesData?.map((u: any) => [u.id, u]) || []
            );

            // Step 4: Transform and merge data
            const transformed = shuffled.map((p: any) => {
                const uni = universityMap.get(p.university_id);
                return {
                    ...p,
                    title: p.display_title || p.program_title || 'Program',
                    university_name: uni?.name || p.university_name || 'University',
                    university_slug: uni?.slug || p.university_slug,
                    university_cover: uni?.cover_photo_url,
                    university_logo: uni?.logo_url,
                    city: uni?.city || p.city || 'China',
                };
            });

            // Cache disabled for web - Base64 images exceed localStorage quota
            // await appCache.setPrograms(transformed);
            setPrograms(transformed);
        } catch (err) {
            console.error('[useFeaturedPrograms] Error:', err);
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

// Hook to search programs with filters
export interface ProgramFilters {
    query?: string;
    degree?: string;
    field?: string;
    language?: string;
    city?: string;
    international_students?: number;
    program_count?: number; // Mapped from query
    maxTuition?: number;
    scholarship?: boolean;
}

export function useSearchPrograms(filters: ProgramFilters) {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            searchPrograms();
        }, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [
        filters.query,
        filters.degree,
        filters.field,
        filters.language,
        filters.city,
        filters.maxTuition,
        filters.scholarship
    ]);

    async function searchPrograms() {
        try {
            setLoading(true);
            console.log('[useSearchPrograms] Searching with filters:', filters);

            let query = supabase
                .from('v_university_programs_full')
                .select('*', { count: 'exact' })
                .eq('is_active', true);

            // Apply filters
            if (filters.query && filters.query.length >= 2) {
                query = query.or(`program_title.ilike.%${filters.query}%,university_name.ilike.%${filters.query}%`);
            }
            if (filters.degree && filters.degree !== 'all') {
                query = query.ilike('level', `%${filters.degree}%`);
            }
            if (filters.field && filters.field !== 'all') {
                query = query.ilike('category', `%${filters.field}%`);
            }
            if (filters.city && filters.city !== 'all') {
                query = query.ilike('city', `%${filters.city}%`);
            }
            if (filters.language && filters.language !== 'all') {
                query = query.ilike('language_name', `%${filters.language}%`);
            }
            if (filters.maxTuition && filters.maxTuition < 200000) {
                query = query.lte('tuition_fee', filters.maxTuition);
            }
            if (filters.scholarship) {
                query = query.not('scholarship_chance', 'is', null);
            }

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .limit(50);

            if (!error && data) {
                // Fetch university logos for results
                const universityIds = [...new Set(data.map((p: any) => p.university_id))];
                const { data: uniData } = await supabase
                    .from('universities')
                    .select('id, logo_url, cover_photo_url')
                    .in('id', universityIds);

                const uniMap = new Map(uniData?.map((u: any) => [u.id, u]) || []);

                const transformed = data.map((p: any) => {
                    const uni = uniMap.get(p.university_id);
                    return {
                        ...p,
                        title: p.display_title || p.program_title || 'Program',
                        university_logo: uni?.logo_url,
                        university_cover: uni?.cover_photo_url,
                    };
                });

                setResults(transformed);
                setTotalCount(count || 0);
                console.log('[useSearchPrograms] Found', transformed.length, 'programs');
            }
        } catch (err) {
            console.error('[useSearchPrograms] Error:', err);
        } finally {
            setLoading(false);
        }
    }

    return { results, loading, totalCount, refetch: searchPrograms };
}

// Hook to fetch a single program by slug with scholarships and accommodation
export function useProgram(slug: string) {
    const [program, setProgram] = useState<any>(null);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [accommodation, setAccommodation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) fetchProgram();
    }, [slug]);

    async function fetchProgram() {
        try {
            setLoading(true);
            console.log('[useProgram] Fetching program:', slug);

            // Check if slug is actually a UUID (ID) or a slug
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

            let query = supabase
                .from('v_university_programs_full')
                .select('*');

            // Use ID or slug based on format
            if (isUUID) {
                query = query.eq('id', slug);
            } else {
                query = query.eq('slug', slug);
            }

            const { data, error: progError } = await query.single();

            if (progError) throw progError;

            // Fetch university logo, requirements, scholarships, and accommodation
            if (data) {
                const { data: uniData } = await supabase
                    .from('universities')
                    .select('logo_url, cover_photo_url')
                    .eq('id', data.university_id)
                    .single();

                // Fetch admission requirements
                const { data: requirements } = await supabase
                    .from('v_university_admission_requirements')
                    .select('*')
                    .eq('university_id', data.university_id)
                    .in('requirement_type', [data.level.toLowerCase(), 'all'])
                    .order('category')
                    .order('display_order');

                // Fetch scholarships for this university
                const { data: schData } = await supabase
                    .from('university_scholarships')
                    .select('*')
                    .eq('university_id', data.university_id)
                    .eq('is_active', true)
                    .order('display_order');

                if (schData) {
                    setScholarships(schData);
                    console.log('[useProgram] Fetched', schData.length, 'scholarships');
                }

                // Fetch accommodation for this university
                const { data: accData } = await supabase
                    .from('university_accommodation')
                    .select('*')
                    .eq('university_id', data.university_id)
                    .order('display_order');

                if (accData) {
                    setAccommodation(accData);
                    console.log('[useProgram] Fetched', accData.length, 'accommodation types');
                }

                setProgram({
                    ...data,
                    title: data.display_title || data.program_title || 'Program',
                    university_logo: uniData?.logo_url,
                    university_cover: uniData?.cover_photo_url,
                    raw_requirements: requirements || [],
                });
            }
        } catch (err) {
            console.error('[useProgram] Error:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return { program, scholarships, accommodation, loading, error, refetch: fetchProgram };
}

// Hook to fetch user's applications
export function useUserApplications() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            setLoading(true);

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setApplications([]);
                return;
            }

            // Fetch applications
            const { data, error: appError } = await supabase
                .from('applications')
                .select('*')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false });

            if (appError) throw appError;

            // Fetch program details for each application
            if (data && data.length > 0) {
                const programIds = data.map((a: any) => a.program_id).filter(Boolean);

                if (programIds.length > 0) {
                    const { data: programs } = await supabase
                        .from('v_university_programs_full')
                        .select('id, display_title, program_title, university_name, university_id')
                        .in('id', programIds);

                    // Fetch university logos
                    const universityIds = [...new Set(programs?.map((p: any) => p.university_id) || [])];
                    const { data: universities } = await supabase
                        .from('universities')
                        .select('id, logo_url')
                        .in('id', universityIds);

                    const programMap = new Map(programs?.map((p: any) => [p.id, p]) || []);
                    const uniMap = new Map(universities?.map((u: any) => [u.id, u]) || []);

                    const enrichedApps = data.map((app: any) => {
                        const program = programMap.get(app.program_id);
                        const uni = program ? uniMap.get(program.university_id) : null;
                        return {
                            ...app,
                            program_title: program?.display_title || program?.program_title || 'Program',
                            university_name: program?.university_name || 'University',
                            university_logo: uni?.logo_url,
                        };
                    });

                    setApplications(enrichedApps);
                } else {
                    setApplications(data);
                }
            } else {
                setApplications([]);
            }
        } catch (err) {
            console.error('[useUserApplications] Error:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return { applications, loading, error, refresh: fetchApplications };
}

// Hook for authentication state
export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return { user, loading, signOut };
}

// Profile type definition
export interface UserProfile {
    id: string;
    user_id: string;
    full_name: string | null;
    phone: string | null;
    phone_country_code: string | null;
    nationality: string | null;
    passport_number: string | null;
    date_of_birth: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    emergency_phone_code: string | null;
    emergency_contact_relationship: string | null;
    profile_photo_url: string | null;
}

// Hook to fetch and manage user profile
export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setProfile(null);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 = no rows returned
                throw fetchError;
            }

            setProfile(data || null);
        } catch (err) {
            console.error('[useUserProfile] Error:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
        try {
            setSaving(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Check if profile exists
            const { data: existing } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            let result;
            if (existing) {
                // Update existing profile
                result = await supabase
                    .from('profiles')
                    .update(updates)
                    .eq('id', user.id)
                    .select()
                    .single();
            } else {
                // Insert new profile
                result = await supabase
                    .from('profiles')
                    .insert({ ...updates, id: user.id, email: user.email })
                    .select()
                    .single();
            }

            if (result.error) {
                throw result.error;
            }

            setProfile(result.data);
            return { success: true };
        } catch (err) {
            console.error('[useUserProfile] Update error:', err);
            return { success: false, error: (err as Error).message };
        } finally {
            setSaving(false);
        }
    }

    async function uploadProfilePhoto(file: { uri: string; name: string; type: string }): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            setSaving(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Create file path
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/profile.${fileExt}`;

            // Fetch the file as blob
            const response = await fetch(file.uri);
            const blob = await response.blob();

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: file.type,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(fileName);

            const photoUrl = urlData.publicUrl;

            // Update profile with photo URL
            await updateProfile({ profile_photo_url: photoUrl });

            return { success: true, url: photoUrl };
        } catch (err) {
            console.error('[useUserProfile] Upload error:', err);
            return { success: false, error: (err as Error).message };
        } finally {
            setSaving(false);
        }
    }

    // Calculate profile completion percentage
    const getCompletionPercentage = (): number => {
        if (!profile) return 0;
        const fields = [
            'full_name', 'phone', 'nationality', 'passport_number', 'date_of_birth',
            'address', 'city', 'postal_code',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship'
        ];
        const filled = fields.filter(f => profile[f as keyof UserProfile]).length;
        return Math.round((filled / fields.length) * 100);
    };

    return {
        profile,
        loading,
        error,
        saving,
        refresh: fetchProfile,
        updateProfile,
        uploadProfilePhoto,
        completionPercentage: getCompletionPercentage(),
    };
}

// Hook to count unread messages
export function useUnreadMessages() {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCount();
    }, []);

    async function fetchCount() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setCount(0);
                return;
            }

            // Get user's applications
            const { data: apps } = await supabase
                .from('applications')
                .select('id')
                .eq('student_id', user.id);

            if (!apps || apps.length === 0) {
                setCount(0);
                return;
            }

            const appIds = apps.map(a => a.id);

            // Count unread messages (from admin, not read by student)
            const { count: unreadCount } = await supabase
                .from('application_messages')
                .select('id', { count: 'exact', head: true })
                .in('application_id', appIds)
                .eq('sender_type', 'admin')
                .eq('is_read', false);

            setCount(unreadCount || 0);
        } catch (err) {
            console.error('[useUnreadMessages] Error:', err);
        } finally {
            setLoading(false);
        }
    }

    return { count, loading, refresh: fetchCount };
}

// Hook for Saved Programs (Local Storage)
export function useSavedPrograms() {
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSaved();
    }, []);

    const loadSaved = async () => {
        try {
            const json = await AsyncStorage.getItem('saved_programs');
            if (json) {
                setSavedIds(JSON.parse(json));
            }
        } catch (e) {
            console.error('[useSavedPrograms] Error loading:', e);
        } finally {
            setLoading(false);
        }
    };

    const toggleSave = async (id: string) => {
        try {
            let newIds;
            if (savedIds.includes(id)) {
                newIds = savedIds.filter(s => s !== id);
            } else {
                newIds = [...savedIds, id];
            }

            setSavedIds(newIds);
            await AsyncStorage.setItem('saved_programs', JSON.stringify(newIds));
            return !savedIds.includes(id);
        } catch (e) {
            console.error('[useSavedPrograms] Error saving:', e);
            return savedIds.includes(id);
        }
    };

    const isSaved = (id: string) => savedIds.includes(id);

    return {
        savedIds,
        count: savedIds.length,
        isSaved,
        toggleSave,
        loading,
        refresh: loadSaved
    };
}

// Hook to fetch articles for the home screen
export function useArticles() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
        try {
            setLoading(true);
            console.log('[useArticles] Fetching articles...');

            const { data, error: articlesError } = await supabase
                .from('v_published_articles')
                .select('id, title, slug, excerpt, featured_image, category_name, category_color, reading_time, published_at, views')
                .order('published_at', { ascending: false })
                .limit(5);

            if (articlesError) {
                console.error('[useArticles] Error:', articlesError);
                setError(articlesError.message);
            } else {
                console.log('[useArticles] Fetched', data?.length || 0, 'articles');
                setArticles(data || []);
            }
        } catch (err) {
            console.error('[useArticles] Error:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return { articles, loading, error, refetch: fetchArticles };
}
