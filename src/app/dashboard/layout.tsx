import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            S
                        </div>
                        StudyAtChina
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/applications">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            My Applications
                        </Button>
                    </Link>
                    <Link href="/dashboard/documents">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Documents
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </nav>
                <div className="border-t p-4">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
