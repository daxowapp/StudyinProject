import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();
    
    const { data: scholarshipPrograms, error } = await supabase
        .from("v_scholarship_programs")
        .select("program_id, program_title, is_popular")
        .eq("is_active", true)
        .eq("is_popular", true)
        .limit(10);
        
    return NextResponse.json({
        data: scholarshipPrograms,
        error: error
    });
}
