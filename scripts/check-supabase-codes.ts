import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxmrdnzmaztskbkqeusm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bXJkbnptYXp0c2tia3FldXNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDIzOTkyMiwiZXhwIjoyMDc5ODE1OTIyfQ.HhtEPYPFPbNJXTXlGhMZaG1ooe2j5_4VP8FzI2XnD0U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCodes() {
  const { data, error } = await supabase.from('universities').select('id, name, code');
  
  if (error) {
    console.error('Error fetching universities:', error);
    return;
  }
  
  console.log(`Universities in DB: ${data.length}`);
  let validCodes = 0;
  let missingCodes = 0;
  
  for (const uni of data) {
    if (uni.code) {
      validCodes++;
      console.log(`- ${uni.name}: ${uni.code}`);
    } else {
      missingCodes++;
      console.log(`- ${uni.name}: NO CODE`);
    }
  }
  
  console.log(`Valid codes: ${validCodes}, Missing codes: ${missingCodes}`);
}

checkCodes();
