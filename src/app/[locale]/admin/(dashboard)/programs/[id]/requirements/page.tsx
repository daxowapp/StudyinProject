import ProgramRequirementsManager from "./ProgramRequirementsManager";

export default async function ProgramRequirementsPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <ProgramRequirementsManager programId={id} />
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
