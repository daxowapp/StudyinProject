'use client';

import { useState, useCallback } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SearchFilters {
    level?: string;
    city?: string;
    language?: string;
    maxTuition?: number;
    field?: string;
    university?: string;
}

interface SearchResult {
    id: string;
    slug: string;
    display_title?: string;
    program_title: string;
    level: string;
    university_name: string;
    city: string;
    tuition_fee: number;
    currency: string;
}

interface AISearchBarProps {
    onResults?: (results: SearchResult[], filters: SearchFilters, summary: string) => void;
    className?: string;
    placeholder?: string;
}

export function AISearchBar({ onResults, className, placeholder }: AISearchBarProps) {
    const t = useTranslations('AISearch');
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleSearch = useCallback(async () => {
        if (!query.trim()) return;

        setIsSearching(true);
        setError('');
        setSummary('');
        setFilters({});

        try {
            const response = await fetch('/api/ai/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();

            setFilters(data.filters || {});
            setSummary(data.summary || '');

            if (onResults) {
                onResults(data.results || [], data.filters || {}, data.summary || '');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(t('error') || 'Something went wrong. Please try again.');
        } finally {
            setIsSearching(false);
        }
    }, [query, onResults, t]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSearching) {
            handleSearch();
        }
    };

    const clearFilter = (key: keyof SearchFilters) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const clearAll = () => {
        setQuery('');
        setFilters({});
        setSummary('');
        setError('');
    };

    const hasFilters = Object.keys(filters).length > 0;

    return (
        <div className={cn('space-y-3', className)}>
            {/* Search Input */}
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || t('placeholder') || "Try: 'Master's in Engineering under 30000 RMB in Beijing'"}
                    className="pl-12 pr-24 h-14 text-lg rounded-2xl border-2 border-primary/20 focus:border-primary shadow-lg"
                    disabled={isSearching}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearAll}
                            disabled={isSearching}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        onClick={handleSearch}
                        disabled={isSearching || !query.trim()}
                        className="h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/80"
                    >
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Search className="h-4 w-4 mr-2" />
                                {t('search') || 'Search'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* AI Interpreted Filters */}
            {hasFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('filters') || 'AI understood'}:</span>
                    {filters.level && (
                        <Badge variant="secondary" className="gap-1">
                            {filters.level}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('level')} />
                        </Badge>
                    )}
                    {filters.city && (
                        <Badge variant="secondary" className="gap-1">
                            📍 {filters.city}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('city')} />
                        </Badge>
                    )}
                    {filters.language && (
                        <Badge variant="secondary" className="gap-1">
                            🌐 {filters.language}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('language')} />
                        </Badge>
                    )}
                    {filters.maxTuition && (
                        <Badge variant="secondary" className="gap-1">
                            💰 ≤{filters.maxTuition.toLocaleString()} RMB
                            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('maxTuition')} />
                        </Badge>
                    )}
                    {filters.field && (
                        <Badge variant="secondary" className="gap-1">
                            📚 {filters.field}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('field')} />
                        </Badge>
                    )}
                    {filters.university && (
                        <Badge variant="secondary" className="gap-1">
                            🏛️ {filters.university}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('university')} />
                        </Badge>
                    )}
                </div>
            )}

            {/* AI Summary */}
            {summary && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {summary}
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
        </div>
    );
}
