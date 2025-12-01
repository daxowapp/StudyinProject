import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ApplyForm } from '@/components/applications/ApplyForm';

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ programSlug: string }>;
}) {
  const { programSlug } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login with return URL
    redirect(`/auth/login?returnUrl=/apply/${programSlug}`);
  }

  // Fetch program details
  const { data: program, error } = await supabase
    .from('university_programs')
    .select(
      `
      *,
      program_catalog:program_catalog_id (
        id,
        title,
        level,
        category,
        field,
        description
      ),
      university:university_id (
        id,
        name,
        slug,
        city,
        province,
        logo_url
      ),
      language:language_id (
        id,
        name,
        code
      )
    `
    )
    .eq('slug', programSlug)
    .eq('is_active', true)
    .single();

  if (error || !program) {
    redirect('/programs');
  }

  // Check if user already has an application for this program
  const { data: existingApplication } = await supabase
    .from('applications')
    .select('id, status')
    .eq('student_id', user.id)
    .eq('university_program_id', program.id)
    .single();

  if (existingApplication) {
    // Redirect to existing application
    redirect(`/dashboard/applications/${existingApplication.id}`);
  }

  // Fetch required documents for this program
  const { data: requirements } = await supabase
    .from('university_admission_requirements')
    .select(
      `
      *,
      requirement:requirement_id (
        id,
        title,
        category,
        description,
        is_mandatory
      )
    `
    )
    .eq('university_id', program.university.id)
    .eq('program_level', program.program_catalog.level);

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ApplyForm
          program={program}
          requirements={requirements || []}
          user={user}
          profile={profile}
        />
      </div>
    </div>
  );
}
