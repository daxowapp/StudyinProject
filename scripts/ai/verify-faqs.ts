import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(chalk.red('Missing Supabase credentials in .env.local'));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFaqs() {
  console.log(chalk.blue('Fetching a random sample of FAQs...'));

  const { data: faqs, error } = await supabase
    .from('university_faqs')
    .select(`
      id,
      question,
      answer,
      locale,
      university:universities ( name )
    `)
    .limit(10);

  if (error) {
    console.error(chalk.red('Error fetching FAQs:'), error);
    process.exit(1);
  }

  if (!faqs || faqs.length === 0) {
    console.log(chalk.yellow('No FAQs found in the database.'));
    return;
  }

  console.log(chalk.green(`\nSampled ${faqs.length} FAQs for verification:\n`));

  faqs.forEach((faq: any, index: number) => {
    const univName = faq.university && Array.isArray(faq.university) && faq.university.length > 0 
      ? faq.university[0].name 
      : (faq.university && !Array.isArray(faq.university) ? faq.university.name : 'Unknown University');
      
    console.log(chalk.cyan(`--- FAQ ${index + 1} /// [${faq.locale.toUpperCase()}] ${univName} ---`));
    console.log(chalk.bold('Q:'), faq.question);
    console.log(chalk.bold('A:'), faq.answer);
    console.log('\n');
  });
}

verifyFaqs().catch(err => {
  console.error(chalk.red('Unexpected error:'), err);
  process.exit(1);
});
