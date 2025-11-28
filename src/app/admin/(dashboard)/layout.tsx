import { Button } from "@/components/ui/button";
import { 
    LayoutDashboard, 
    Building2, 
    FileText, 
    Users, 
    Settings, 
    LogOut, 
    GraduationCap, 
    MessageSquare, 
    Calendar, 
    Languages, 
    Award, 
    BarChart3, 
    BookOpen,
    ClipboardCheck
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-16 items-center border-b px-6 bg-primary/5">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            A
                        </div>
                        Admin Panel
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/analytics">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </Button>
                    </Link>
                    <Link href="/admin/universities">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Building2 className="h-4 w-4" />
                            Universities
                        </Button>
                    </Link>
                    <Link href="/admin/program-catalog">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <BookOpen className="h-4 w-4" />
                            Program Catalog
                        </Button>
                    </Link>
                    <Link href="/admin/programs">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <GraduationCap className="h-4 w-4" />
                            University Programs
                        </Button>
                    </Link>
                    <Link href="/admin/scholarships">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Award className="h-4 w-4" />
                            Scholarships
                        </Button>
                    </Link>
                    <Link href="/admin/admission-requirements">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <ClipboardCheck className="h-4 w-4" />
                            Admission Requirements
                        </Button>
                    </Link>
                    <Link href="/admin/applications">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Applications
                        </Button>
                    </Link>
                    <Link href="/admin/leads">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Leads
                        </Button>
                    </Link>
                    <Link href="/admin/users">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Users className="h-4 w-4" />
                            Users
                        </Button>
                    </Link>
                    <Link href="/admin/academic-years">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Calendar className="h-4 w-4" />
                            Academic Years
                        </Button>
                    </Link>
                    <Link href="/admin/languages">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Languages className="h-4 w-4" />
                            Languages
                        </Button>
                    </Link>
                    <Link href="/admin/settings">
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
        </div >
    );
}
