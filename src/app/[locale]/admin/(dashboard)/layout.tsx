import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar - Desktop */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Navigation */}
                <AdminMobileNav />

                <div className="flex-1 p-4 md:p-8 overflow-x-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
