import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { messages, locale = 'en' } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Messages array is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Try to get custom prompt from database
        let customPrompt = '';
        try {
            const supabase = await createClient();
            const { data: settings } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'ai_chat_prompt')
                .single();

            if (settings?.value) {
                customPrompt = settings.value;
            }
        } catch {
            // If site_settings table doesn't exist or no custom prompt, use default
        }

        // Add locale context to system prompt
        const localeContext = {
            en: 'Respond in English.',
            ar: 'Respond in Arabic (العربية). Use right-to-left friendly formatting.',
            fa: 'Respond in Persian/Farsi (فارسی). Use right-to-left friendly formatting.',
            tr: 'Respond in Turkish (Türkçe).',
        };

        const systemPrompt = customPrompt || CHAT_SYSTEM_PROMPT;
        const fullPrompt = `${systemPrompt}\n\n${localeContext[locale as keyof typeof localeContext] || localeContext.en}`;

        // Create streaming response
        const stream = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: fullPrompt },
                ...messages.map((m: { role: string; content: string }) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                })),
            ],
            temperature: 0.7,
            max_tokens: 500,
            stream: true,
        });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('AI Chat error:', error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while processing your message' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
