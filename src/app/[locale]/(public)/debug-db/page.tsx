
import { inspectDatabaseValues } from "@/lib/inspect-db";

export default async function Page() {
    const data = await inspectDatabaseValues();
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
