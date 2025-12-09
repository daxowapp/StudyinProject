import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, FileText, CreditCard, LayoutDashboard, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { getTranslations } from "next-intl/server";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const t = await getTranslations('Dashboard.sidebar');

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    let unreadCount = 0;
    let pendingPayments = 0;
    let pendingDocuments = 0;
    let hasUnreadDocuments = false;

    if (user) {
        // Get user's applications
        const { data: applications } = await supabase
            .from("applications")
            .select("id")
            .eq("student_id", user.id);

        const applicationIds = applications?.map(app => app.id) || [];

        if (applicationIds.length > 0) {
            // Get unread messages count
            const { count } = await supabase
                .from("application_messages")
                .select("*", { count: 'exact', head: true })
                .in("application_id", applicationIds)
                .eq("is_read", false);

            unreadCount = count || 0;

            // Get pending payments count
            const { count: paymentCount } = await supabase
                .from("payment_transactions")
                .select("*", { count: 'exact', head: true })
                .eq("student_id", user.id)
                .eq("status", "pending");

            pendingPayments = paymentCount || 0;


            // Get student documents count (Total)
            const { count: totalDocCount } = await supabase
                .from("student_documents")
                .select("*", { count: 'exact', head: true })
                .eq("student_id", user.id);

            // Get unread student documents count
            const { count: unreadDocCount } = await supabase
                .from("student_documents")
                .select("*", { count: 'exact', head: true })
                .eq("student_id", user.id)
                .eq("is_read", false);

            pendingDocuments = totalDocCount || 0;
            hasUnreadDocuments = (unreadDocCount || 0) > 0;
        }
    }
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
                            {t('myApplications')}
                        </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <User className="h-4 w-4" />
                            {t('profile')}
                        </Button>
                    </Link>
                    <Link href="/dashboard/messages">
                        <Button variant="ghost" className="w-full justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {t('messages')}
                            </div>
                            {unreadCount > 0 && (
                                <Badge className="bg-red-600 hover:bg-red-700 text-white">
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                    <Link href="/dashboard/payments">
                        <Button variant="ghost" className="w-full justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                {t('payments')}
                            </div>
                            {pendingPayments > 0 && (
                                <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                    {pendingPayments}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                    <Link href="/dashboard/documents">
                        <Button variant="ghost" className="w-full justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {t('documents')}
                            </div>
                            {pendingDocuments > 0 && (
                                <Badge className={`${hasUnreadDocuments ? "bg-red-600 hover:bg-red-700" : "bg-gray-500 hover:bg-gray-600"} text-white`}>
                                    {pendingDocuments}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            {t('settings')}
                        </Button>
                    </Link>
                </nav>
                <div className="border-t p-4">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
                    <LanguageSwitcher />
                    {user && <NotificationBell userId={user.id} />}
                </header>
                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* Chen Wei Chat Widget */}
            <ChatWidget />
        </div>
    );
}

