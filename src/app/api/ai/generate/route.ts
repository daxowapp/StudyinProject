
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        // 1. Verify the request is from an authenticated admin
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { type, query } = body;

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const apiKey = process.env.PERPLEXITY_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        let systemPrompt = "";
        if (type === 'university') {
            systemPrompt = `You are a helpful assistant that provides detailed information about universities. 
      Return a JSON object with the following fields for the university specified in the user query. 
      Do not include markdown formatting or code blocks, just the raw JSON.
      If a field is not available, use null or an empty string / array.

    Fields:
- name: string(Official English name)
    - name_local: string(Native language name, e.g.Chinese)
        - city: string
            - province: string
                - description: string(A detailed summary, at least 2 paragraphs)
                    - website: string(URL)
                        - founded: string(Year)
                            - total_students: string(Approximate number)
                                - international_students: string(Approximate number)
                                    - ranking: string(Global or national ranking)
                                        - features: array of strings(e.g. "Project 985", "C9 League", "Research University")
                                            - latitude: string(Decimal degrees)
                                                - longitude: string(Decimal degrees)
                                                - logo_url: string(URL to official logo if found)
                                                - cover_photo_url: string(URL to a high-quality campus photo)
                                                - video_url: string(YouTube or Vimeo URL if found)
                                                - gallery_images: array of strings(URLs to 3-5 campus photos)
                                                - university_type: string(Choose ONE: "Public", "Private", "Research", "Comprehensive", "Specialized", or "Vocational")
                                                - institution_category: string(Choose ONE: "University", "College", "Language Institute", "Vocational School", or "Technical Institute")
      `;
        } else if (type === 'program') {
            systemPrompt = `You are a helpful assistant that provides detailed information about university programs.
      Return a JSON object with the following fields for the program specified in the user query.
      Do not include markdown formatting or code blocks, just the raw JSON.
      If a field is not available, use null or an empty string / array.

    Fields:
- title: string(Program name)
    - level: string(Bachelor, Master, PhD, Non - Degree)
        - duration: string(e.g. "4 Years", "2 Years")
            - tuition_fee: number(Yearly fee in RMB / CNY if not specified)
- currency: string(e.g. "RMB", "USD")
    - language: string(Instruction language, e.g. "English", "Chinese")
        - deadline: string(YYYY - MM - DD if possible, or general description)
- application_fee: number
    - service_fee: number(Estimate if unknown, usually 0 - 100)
- scholarship_chance: string(e.g. "High", "Medium", "Low", or specific scholarship names)
      `;
        } else if (type === 'scholarship_translation') {
            systemPrompt = `You are a professional translator.
      Translate the provided scholarship information into the target language specified in the query.
      Return a JSON object with the translated fields.
      Do not include markdown formatting or code blocks, just the raw JSON.
      
      Fields to translate:
      - display_name: string
      - description: string
      - accommodation_type: string
      - additional_benefits: array of strings
      - requirements: array of strings
      
      The query will be in the format: "Translate to [Language]: [JSON Data]"
      `;
        } else if (type === 'translation') {
            systemPrompt = `You are a professional translator.
      Translate the provided university information into the target language specified in the query.
      Return a JSON object with the translated fields.
      Do not include markdown formatting or code blocks, just the raw JSON.
      
      Fields to translate:
      - name: string
      - description: string
      - features: array of strings
      
      The query will be in the format: "Translate to [Language]: [JSON Data]"
      `;
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey} `,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Provide information for: ${query} ` }
                ],
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Perplexity API Error:", response.status, errorText);
            return NextResponse.json({ error: 'Failed to fetch from AI', details: errorText }, { status: response.status });
        }

        const data = await response.json();
        let content = data.choices[0]?.message?.content;

        // Clean up markdown code blocks if present
        content = content.replace(/```json\n ?|\n ? ```/g, '').trim();

        // Extract JSON object if there's extra text
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            content = content.substring(firstBrace, lastBrace + 1);
        }

        try {
            const jsonData = JSON.parse(content);
            return NextResponse.json(jsonData);
        } catch (e) {
            console.error("JSON Parse Error:", e, content);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
