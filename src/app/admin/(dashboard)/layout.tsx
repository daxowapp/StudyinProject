import { Button } from "@/components/ui/button";
import {
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            < main className="flex-1 flex flex-col" >
                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main >
        </div >
    );
}
