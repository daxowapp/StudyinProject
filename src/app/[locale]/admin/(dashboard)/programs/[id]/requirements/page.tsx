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
