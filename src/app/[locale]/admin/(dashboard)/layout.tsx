import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { Sidebar } from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar - Desktop */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-40 hidden md:flex h-14 items-center justify-end gap-4 border-b bg-background/95 backdrop-blur px-6">
                    {user && <NotificationBell userId={user.id} />}
                </header>

                {/* Mobile Navigation */}
                <AdminMobileNav />

                <div className="flex-1 p-4 md:p-8 overflow-x-auto">
                    {children}
                </div>
            </main>
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
