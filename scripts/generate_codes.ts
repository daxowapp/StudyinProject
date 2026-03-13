import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Note: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Words to ignore when creating abbreviations
const IGNORE_WORDS = new Set(['of', 'and', 'for', 'in', 'the', 'at', 'on']);

function generateCode(name: string): string {
  // Remove content in brackets, punctuation, then split by spaces/hyphens
  const cleanName = name.replace(/\([^)]*\)/g, '').replace(/[^\w\s-]/g, '');
  const words = cleanName.split(/[\s-]+/).filter(w => w.length > 0);
  
  let code = '';
  // Extract first letter of each valid word
  for (const word of words) {
    if (!IGNORE_WORDS.has(word.toLowerCase())) {
      code += word[0].toUpperCase();
    }
  }
  
  // If it's too short and we have long words, maybe grab extra characters?
  // User just asked for initials ex: Zhejiang Gongshang University -> ZJGU
  // But wait, "Zhejiang" is one word, "Gongshang" is one word. So ZGU?
  // Wait, ZJGU comes from Zhe Jiang Gong Shang? Or Zhejiang (ZJ) Gongshang (GS) University (U)?
  // Usually, just taking the first letter works as a fallback. 
  // Let's just do standard initials, but for known patterns, we can do substring.
  // Actually, standard initials for "Zhejiang Gongshang University" is just ZGU unless split manually.
  // To keep it simple and match standard acronyms, let's just use the first letter of each word.
  // For 'Zhejiang', abbreviation is usually ZJ, but ZGU is fine.
  
  if (code.length < 2 && name.length >= 2) {
      code = name.substring(0, 3).toUpperCase();
  }
  return code;
}

async function main() {
  const { data, error } = await supabase.from('universities').select('id, name');
  
  if (error) {
    console.error("Error fetching universities:", error);
    return;
  }
  
  console.log(`Generating codes for ${data.length} universities...`);
  
  let sql = `-- Add the 'code' column if it doesn't exist\n`;
  sql += `ALTER TABLE universities ADD COLUMN IF NOT EXISTS code VARCHAR(20);\n\n`;
  sql += `-- Populate codes for existing universities\n`;
  
  const codesSeen = new Set<string>();
  
  for (const uni of data) {
    let baseCode = generateCode(uni.name);
    let finalCode = baseCode;
    let counter = 1;
    
    // Ensure uniqueness
    while (codesSeen.has(finalCode)) {
      finalCode = `${baseCode}${counter}`;
      counter++;
    }
    codesSeen.add(finalCode);
    
    // Escape single quotes in names (e.g. Xi'an)
    const escapedName = uni.name.replace(/'/g, "''");
    
    sql += `UPDATE universities SET code = '${finalCode}' WHERE id = '${uni.id}'; -- ${escapedName}\n`;
  }
  
  const outPath = path.join(process.cwd(), 'supabase', 'migrations', 'update_codes.sql');
  fs.writeFileSync(outPath, sql);
  
  console.log(`\nMigration SQL has been generated at: ${outPath}`);
  console.log(`Please run this SQL in your Supabase SQL Editor.`);
}

main();
