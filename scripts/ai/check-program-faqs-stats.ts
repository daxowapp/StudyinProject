import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFaqStats() {
  console.log('Fetching Program FAQ stats...');
  
  const { data: countData, error: countError } = await supabase
    .from('program_faqs')
    .select('program_id, locale');
    
  if (countError) {
    console.error('Error fetching FAQ counts:', countError);
    return;
  }
  
  if (!countData || countData.length === 0) {
    console.log('No Program FAQs found.');
    return;
  }
  
  const stats = countData.reduce((acc: any, curr: any) => {
    acc[curr.locale] = (acc[curr.locale] || 0) + 1;
    return acc;
  }, {});
  
  console.log('Total Program FAQs by language:', stats);
  
  const uniStats = countData.reduce((acc: any, curr: any) => {
    if (!acc[curr.locale]) acc[curr.locale] = new Set();
    // @ts-ignore
    acc[curr.locale].add(curr.program_id);
    return acc;
  }, {});
  
  console.log('Programs with FAQs by language:');
  for (const [locale, set] of Object.entries(uniStats)) {
    // @ts-ignore
    console.log(`- ${locale}: ${set.size}`);
  }
}

checkFaqStats().catch(console.error);
