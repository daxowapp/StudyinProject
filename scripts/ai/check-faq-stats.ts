import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFaqStats() {
  console.log('Fetching FAQ stats...');
  
  const { data: countData, error: countError } = await supabase
    .from('university_faqs')
    .select('university_id, locale');
    
  if (countError) {
    console.error('Error fetching FAQ counts:', countError);
    return;
  }
  
  const stats = countData.reduce((acc: any, curr: any) => {
    acc[curr.locale] = (acc[curr.locale] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Total FAQs by language:', stats);
  
  // Also let's check how many unique universities have FAQs per language
  const { data: uniqueData, error: uniqueError } = await supabase
    .from('university_faqs')
    .select('university_id, locale');
    
  if (uniqueError) {
    console.error('Error fetching unique stats:', uniqueError);
    return;
  }
  
  const uniStats = uniqueData.reduce((acc: any, curr: any) => {
    if (!acc[curr.locale]) acc[curr.locale] = new Set();
    acc[curr.locale].add(curr.university_id);
    return acc;
  }, {});
  
  console.log('Universities with FAQs by language:');
  for (const [locale, set] of Object.entries(uniStats)) {
    console.log(`- ${locale}: ${(set as Set<any>).size}`);
  }
}

checkFaqStats().catch(console.error);
