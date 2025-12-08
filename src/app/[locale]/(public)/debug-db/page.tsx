
import { inspectDatabaseValues } from "@/lib/inspect-db";

export default async function Page() {
    const data = await inspectDatabaseValues();
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
