import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { SEARCH_SYSTEM_PROMPT, SEARCH_RESULT_PROMPT } from '@/lib/ai/prompts';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface SearchFilters {
    level?: string;
    city?: string;
    province?: string;
    language?: string;
    maxTuition?: number;
    minTuition?: number;
    field?: string;
    university?: string;
    scholarship?: boolean;
    fastTrack?: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Step 1: Extract search filters using GPT
        const filterResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SEARCH_SYSTEM_PROMPT },
                { role: 'user', content: query },
            ],
            temperature: 0,
            max_tokens: 200,
        });

        let filters: SearchFilters = {};
        try {
            const content = filterResponse.choices[0]?.message?.content || '{}';
            filters = JSON.parse(content);
        } catch {
            // If parsing fails, continue with empty filters
            console.error('Failed to parse AI response');
        }

        // Step 2: Query database with extracted filters
        const supabase = await createClient();

        let dbQuery = supabase
            .from('v_university_programs_full')
            .select('*')
            .eq('is_active', true);

        // Apply filters
        if (filters.level) {
            dbQuery = dbQuery.ilike('level', `%${filters.level}%`);
        }
        if (filters.city) {
            dbQuery = dbQuery.ilike('city', `%${filters.city}%`);
        }
        if (filters.language) {
            dbQuery = dbQuery.ilike('language_name', `%${filters.language}%`);
        }
        if (filters.maxTuition) {
            dbQuery = dbQuery.lte('tuition_fee', filters.maxTuition);
        }
        if (filters.minTuition) {
            dbQuery = dbQuery.gte('tuition_fee', filters.minTuition);
        }
        if (filters.field) {
            dbQuery = dbQuery.or(`program_title.ilike.%${filters.field}%,category.ilike.%${filters.field}%`);
        }
        if (filters.university) {
            dbQuery = dbQuery.ilike('university_name', `%${filters.university}%`);
        }
        if (filters.fastTrack) {
            // Join with universities to check fast_track
            // For now, we'll filter this in memory after fetching
        }

        const { data: programs, error } = await dbQuery.limit(20);

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to search programs' },
                { status: 500 }
            );
        }

        // Step 3: Generate a friendly summary
        let summary = '';
        if (programs && programs.length > 0) {
            const summaryResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SEARCH_RESULT_PROMPT },
                    {
                        role: 'user',
                        content: `Query: "${query}"\nResults found: ${programs.length} programs\nFilters applied: ${JSON.stringify(filters)}\nSample results: ${programs.slice(0, 3).map(p => p.display_title || p.program_title).join(', ')}`
                    },
                ],
                temperature: 0.7,
                max_tokens: 100,
            });
            summary = summaryResponse.choices[0]?.message?.content || '';
        } else {
            summary = "I couldn't find programs matching your exact criteria. Try broadening your search or exploring our full catalog.";
        }

        return NextResponse.json({
            success: true,
            query,
            filters,
            summary,
            results: programs || [],
            totalResults: programs?.length || 0,
        });

    } catch (error) {
        console.error('AI Search error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your search' },
            { status: 500 }
        );
    }
}
