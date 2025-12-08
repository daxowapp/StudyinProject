import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

interface Favorite {
    id: string;
    user_id: string;
    item_type: 'university' | 'program';
    item_id: string;
    created_at: string;
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all user favorites
    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setFavorites([]);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('user_favorites')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setFavorites(data || []);
        } catch (err) {
            console.error('[useFavorites] Error fetching favorites:', err);
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Check if an item is favorited
    const isFavorited = useCallback((itemType: 'university' | 'program', itemId: string): boolean => {
        return favorites.some(fav => fav.item_type === itemType && fav.item_id === itemId);
    }, [favorites]);

    // Toggle favorite (add if not exists, remove if exists)
    const toggleFavorite = useCallback(async (itemType: 'university' | 'program', itemId: string): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert('Error', 'You must be logged in to save favorites');
                return false;
            }

            const isCurrentlyFavorited = isFavorited(itemType, itemId);

            if (isCurrentlyFavorited) {
                // Remove favorite
                const { error: deleteError } = await supabase
                    .from('user_favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('item_type', itemType)
                    .eq('item_id', itemId);

                if (deleteError) throw deleteError;

                // Update local state
                setFavorites(prev => prev.filter(
                    fav => !(fav.item_type === itemType && fav.item_id === itemId)
                ));

                return false; // Now unfavorited
            } else {
                // Add favorite
                const { data, error: insertError } = await supabase
                    .from('user_favorites')
                    .insert({
                        user_id: user.id,
                        item_type: itemType,
                        item_id: itemId,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;

                // Update local state
                setFavorites(prev => [data, ...prev]);

                return true; // Now favorited
            }
        } catch (err) {
            console.error('[useFavorites] Error toggling favorite:', err);
            Alert.alert('Error', 'Failed to update favorite');
            return isFavorited(itemType, itemId);
        }
    }, [favorites, isFavorited]);

    // Get favorited items by type
    const favoritedUniversities = favorites.filter(f => f.item_type === 'university').map(f => f.item_id);
    const favoritedPrograms = favorites.filter(f => f.item_type === 'program').map(f => f.item_id);

    return {
        favorites,
        loading,
        error,
        isFavorited,
        toggleFavorite,
        favoritedUniversities,
        favoritedPrograms,
        refetch: fetchFavorites,
    };
}
