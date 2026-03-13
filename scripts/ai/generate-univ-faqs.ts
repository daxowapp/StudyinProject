import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import OpenAI from 'openai';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'fr', name: 'French' },
  { code: 'ru', name: 'Russian' },
  { code: 'es', name: 'Spanish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'fa', name: 'Persian' }
];

const DELAY_MS = 100; // Small delay between batches to be nice to APIs

async function generateFaqsForUniversity(uni: any, localeObj: any) {
  try {
    const prompt = `You are a helpful assistant for international students. Generate exactly 5 frequently asked questions (FAQs) and answers about studying at "${uni.name}".
Language to use for output: ${localeObj.name} (ISO code: ${localeObj.code}).
Both questions and answers MUST be naturally written in ${localeObj.name}.
Include topics like admissions, scholarships, campus life, living costs, or international student support.

Return ONLY a JSON object with a single key "faqs" which is an array of objects.
Each object must have "question" and "answer" string fields.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    if (!parsed.faqs || !Array.isArray(parsed.faqs)) {
      throw new Error('Invalid JSON structure returned');
    }

    // Insert into DB
    const faqsToInsert = parsed.faqs.map((faq: any, index: number) => ({
      university_id: uni.id,
      locale: localeObj.code,
      question: faq.question,
      answer: faq.answer,
      display_order: index + 1
    }));

    const { error } = await supabase.from('university_faqs').upsert(faqsToInsert, {
      onConflict: 'university_id, locale, display_order'
    });
    if (error) throw error;

    console.log(`✅ Generated FAQs for ${uni.name} in ${localeObj.code}`);
  } catch (err: any) {
    console.error(`❌ Error generating for ${uni.name} (${localeObj.code}):`, err.message);
  }
}

async function main() {
  console.log('Fetching existing FAQs to find what is missing...');
  
  let existing: any[] = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data: faqs, error: fetchErr } = await supabase
      .from('university_faqs')
      .select('id, university_id, locale')
      .order('id')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (fetchErr) {
      console.error('Failed to fetch existing FAQs:', fetchErr);
      return;
    }

    if (!faqs || faqs.length === 0) {
      break;
    }

    existing = existing.concat(faqs);
    page++;
    
    if (faqs.length < pageSize) {
      break;
    }
  }

  // Set of "uniId_locale" that already exist
  const existingSet = new Set(existing.map((e: any) => `${e.university_id}_${e.locale}`));

  console.log('Fetching universities...');
  let universities: any[] = [];
  let uniPage = 0;
  while (true) {
    const { data: uniBatch, error: uniErr } = await supabase
      .from('universities')
      .select('id, name')
      .order('id')
      .range(uniPage * pageSize, (uniPage + 1) * pageSize - 1);

    if (uniErr) {
      console.error('Failed to fetch universities:', uniErr);
      return;
    }

    if (!uniBatch || uniBatch.length === 0) break;
    universities = universities.concat(uniBatch);
    uniPage++;
    if (uniBatch.length < pageSize) break;
  }
  console.log(`Fetched ${universities.length} universities.`);

  const tasks: { uni: any, localeObj: any }[] = [];
  
  for (const uni of universities) {
    for (const localeObj of LOCALES) {
      const key = `${uni.id}_${localeObj.code}`;
      if (!existingSet.has(key)) {
        tasks.push({ uni, localeObj });
      }
    }
  }

  console.log(`Found ${tasks.length} missing FAQ configurations to generate.`);

  const CONCURRENCY = 10;
  
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    console.log(`Processing batch ${Math.floor(i/CONCURRENCY) + 1} / ${Math.ceil(tasks.length/CONCURRENCY)}...`);
    
    await Promise.all(batch.map(task => generateFaqsForUniversity(task.uni, task.localeObj)));
    
    // Slight pause 
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
  
  console.log('Done!');
}

main().catch(console.error);
