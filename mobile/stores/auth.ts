import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
    session: Session | null;
    user: User | null;
    loading: boolean;
    initialized: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    loading: false,
    initialized: false,

    initialize: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({
                session,
                user: session?.user ?? null,
                initialized: true
            });

            // Listen for auth changes
            supabase.auth.onAuthStateChange((_event, session) => {
                set({
                    session,
                    user: session?.user ?? null
                });
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            set({ initialized: true });
        }
    },

    signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                set({ loading: false });
                return { error: error.message };
            }

            set({
                session: data.session,
                user: data.user,
                loading: false
            });
            return { error: null };
        } catch (err) {
            set({ loading: false });
            return { error: (err as Error).message };
        }
    },

    signUp: async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        ...metadata,
                        full_name: metadata ? `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() : undefined,
                        role: 'student',
                    },
                },
            });

            if (error) {
                set({ loading: false });
                return { error: error.message };
            }

            set({ loading: false });
            return { error: null };
        } catch (err) {
            set({ loading: false });
            return { error: (err as Error).message };
        }
    },

    signOut: async () => {
        set({ loading: true });
        await supabase.auth.signOut();
        set({ session: null, user: null, loading: false });
    },
}));
