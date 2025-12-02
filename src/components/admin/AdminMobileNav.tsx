"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function AdminMobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sheet when route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <div className="md:hidden border-b bg-card p-4 flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <Sidebar className="flex w-full border-none shadow-none" />
                </SheetContent>
            </Sheet>
            <div className="font-bold text-lg">Admin Dashboard</div>
        </div>
    );
}
