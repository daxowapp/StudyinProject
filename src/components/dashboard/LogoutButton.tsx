"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signout } from "@/app/[locale]/(auth)/actions";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('Dashboard.sidebar');

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signout();
        } catch {
            toast.error("Failed to sign out. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-4 py-5 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
            onClick={handleLogout}
            disabled={isLoading}
        >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-left">{isLoading ? "Signing out..." : "Sign Out"}</span>
        </Button>
    );
}
