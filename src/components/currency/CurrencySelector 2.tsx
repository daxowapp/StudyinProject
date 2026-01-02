"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CurrencySelectorProps {
    variant?: "navbar" | "footer";
    className?: string;
}

export function CurrencySelector({ variant = "navbar", className }: CurrencySelectorProps) {
    const [currency, setCurrency] = React.useState("USD");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={className}>
                    {currency}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrency("USD")}>USD</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("CNY")}>CNY</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("EUR")}>EUR</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
