import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { count: uCount, error: uErr } = await supabase.from('universities').select('*', { count: 'exact', head: true });
  const { count: pCount, error: pErr } = await supabase.from('programs').select('*', { count: 'exact', head: true });
  console.log('Universities:', uCount, uErr || '');
  console.log('Programs:', pCount, pErr || '');
}
check();
