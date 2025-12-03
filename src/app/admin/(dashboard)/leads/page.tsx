import { getLeads } from "./actions";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">
                        Manage inquiries and potential students.
                    </p>
                </div>
            </div>

            <DataTable columns={columns} data={leads || []} />
        </div>
    );
}
