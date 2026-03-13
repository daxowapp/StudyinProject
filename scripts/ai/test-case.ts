import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false }
});

async function main() {
  const { data: cols, error: e } = await supabase.rpc('query_sql', {
    sql: "SELECT column_name FROM information_schema.key_column_usage WHERE constraint_name = 'university_faqs_university_id_locale_display_order_key';"
  });
  console.log("Cols:", cols, "Error:", e);
}
main();
