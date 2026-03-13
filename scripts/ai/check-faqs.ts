import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { count, error } = await supabase.from('university_faqs').select('*', { count: 'exact', head: true });
  console.log('Total FAQs exact count:', count, 'Error:', error);
  const { data: q2, error: e2 } = await supabase.from('university_faqs').select('id').range(1000, 1999);
  console.log('Page 1 count:', q2?.length);
  
  const { count: c2 } = await supabase.from('universities').select('*', { count: 'exact', head: true });
  console.log('Total Universities exact count:', c2);
}
check();
