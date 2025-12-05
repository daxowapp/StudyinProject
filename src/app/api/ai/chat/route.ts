import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { createClient } from '@/lib/supabase/server';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

interface ChatSession {
    id: string;
    messages: ChatMessage[];
    context: {
        applicationFlow?: {
            step: string;
            programId?: string;
            collectedData: Record<string, string>;
        };
        userLocation?: string;
        detectedLanguage?: string;
    };
}

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

        const {
            messages,
            locale = 'en',
            sessionId,
            isNewSession = false,
            userLocation
        } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Messages array is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const supabase = await createClient();

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();

        let chatSession: ChatSession | null = null;
        let userApplications: { id: string; status: string; program_title: string; university_name: string }[] = [];

        // If user is logged in, try to load/create chat session
        if (user) {
            // Load previous chat session if exists
            if (sessionId && !isNewSession) {
                const { data: existingSession } = await supabase
                    .from('chat_sessions')
                    .select('*')
                    .eq('id', sessionId)
                    .eq('user_id', user.id)
                    .single();

                if (existingSession) {
                    chatSession = existingSession as unknown as ChatSession;
                }
            }

            // Fetch user's applications for context
            const { data: applications } = await supabase
                .from('applications')
                .select(`
                    id,
                    status,
                    university_programs!inner(
                        program_catalog(title),
                        universities(name)
                    )
                `)
                .eq('student_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (applications) {
                userApplications = applications.map((app: any) => ({
                    id: app.id,
                    status: app.status,
                    program_title: app.university_programs?.program_catalog?.title || 'Unknown',
                    university_name: app.university_programs?.universities?.name || 'Unknown'
                }));
            }
        }

        // Try to get custom prompt from database
        let customPrompt = '';
        try {
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

        // Build context for the AI
        const userContext = user ? `
## Current User Context:
- User is logged in as: ${user.email}
- User ID: ${user.id}
${userApplications.length > 0 ? `
- User's recent applications:
${userApplications.map(app => `  • ${app.program_title} at ${app.university_name} - Status: ${app.status}`).join('\n')}
` : '- User has no applications yet'}
` : `
## Current User Context:
- User is NOT logged in (guest)
- If they ask about their application, remind them to log in first
- Encourage them to register/login to save their chat history
`;

        // Add locale context to system prompt
        const localeContext: Record<string, string> = {
            en: 'Respond in English.',
            ar: 'Respond in Arabic (العربية). Use right-to-left friendly formatting.',
            fa: 'Respond in Persian/Farsi (فارسی). Use right-to-left friendly formatting.',
            tr: 'Respond in Turkish (Türkçe).',
        };

        const systemPrompt = customPrompt || CHAT_SYSTEM_PROMPT;
        const fullPrompt = `${systemPrompt}

${userContext}

${localeContext[locale] || localeContext.en}

Current date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
User location hint: ${userLocation || 'Unknown'}`;

        // Create streaming response using gpt-4.1-mini
        const stream = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: fullPrompt },
                ...messages.map((m: { role: string; content: string }) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                })),
            ],
            temperature: 0.7,
            max_tokens: 800,
            stream: true,
        });

        // Variables to collect the full response for saving
        let fullResponse = '';

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        fullResponse += content;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));

                // Save chat session if user is logged in
                if (user && fullResponse) {
                    const updatedMessages = [
                        ...messages,
                        { role: 'assistant', content: fullResponse, timestamp: new Date().toISOString() }
                    ];

                    try {
                        if (chatSession?.id) {
                            // Update existing session
                            await supabase
                                .from('chat_sessions')
                                .update({
                                    messages: updatedMessages,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', chatSession.id);

                            // Send session ID back to client
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sessionId: chatSession.id })}\n\n`));
                        } else {
                            // Create new session and get the ID
                            const { data: newSession } = await supabase
                                .from('chat_sessions')
                                .insert({
                                    user_id: user.id,
                                    messages: updatedMessages,
                                    locale,
                                    context: { userLocation }
                                })
                                .select('id')
                                .single();

                            // Send new session ID back to client
                            if (newSession?.id) {
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sessionId: newSession.id })}\n\n`));
                            }
                        }
                    } catch (saveError) {
                        console.error('Failed to save chat session:', saveError);
                    }
                }

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

// GET endpoint to fetch chat history
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response(
                JSON.stringify({ sessions: [], isAuthenticated: false }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Get user's chat sessions
        const { data: sessions, error } = await supabase
            .from('chat_sessions')
            .select('id, messages, context, locale, created_at, updated_at')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('updated_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching chat sessions:', error);
            return new Response(
                JSON.stringify({ sessions: [], isAuthenticated: true, error: error.message }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                sessions: sessions || [],
                isAuthenticated: true,
                userId: user.id
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error in GET /api/ai/chat:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch chat history' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
