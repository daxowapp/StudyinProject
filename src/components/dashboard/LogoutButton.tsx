"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signout } from "@/app/(public)/auth/actions";
import { useState } from "react";
import { toast } from "sonner";

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signout();
        } catch (error) {
            toast.error("Failed to sign out. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            disabled={isLoading}
        >
            <LogOut className="h-4 w-4" />
            {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
    );
}
