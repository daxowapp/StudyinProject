const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, count, error } = await supabase.from('v_scholarship_programs').select('*', { count: 'exact', head: true });
  console.log("Total programs in DB view:", count);
  console.log("Error:", error);
}
test();
