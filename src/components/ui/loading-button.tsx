"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

interface LoadingButtonProps extends ComponentPropsWithoutRef<typeof Button> {
    loading?: boolean;
    loadingText?: string;
}

export function LoadingButton({
    children,
    loading = false,
    loadingText,
    disabled,
    className,
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            {...props}
            disabled={disabled || loading}
            className={cn(className, loading && "cursor-not-allowed opacity-70")}
        >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {loading && loadingText ? loadingText : children}
        </Button>
    );
}
