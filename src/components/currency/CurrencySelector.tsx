"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CURRENCIES, getCurrencyInfo } from "@/lib/constants/currencies";

interface CurrencySelectorProps {
    variant?: "navbar" | "compact";
    className?: string;
}

export function CurrencySelector({ variant = "navbar", className }: CurrencySelectorProps) {
    const { currency, setCurrency } = useCurrency();
    const currentCurrency = getCurrencyInfo(currency);

    const groupedCurrencies = {
        major: CURRENCIES.filter(c => ['CNY', 'USD', 'EUR'].includes(c.code)),
        mena: CURRENCIES.filter(c =>
            ['AED', 'SAR', 'EGP', 'KWD', 'QAR', 'OMR', 'BHD', 'JOD', 'LBP', 'IQD', 'SYP', 'YER', 'TRY', 'MAD', 'TND', 'DZD', 'LYD', 'SDG', 'MRU', 'SOS', 'DJF', 'KMF'].includes(c.code)
        ),
        cis: CURRENCIES.filter(c =>
            ['RUB', 'KZT', 'UZS', 'AZN', 'BYN', 'AMD', 'GEL', 'KGS', 'TJS', 'TMT', 'MDL', 'UAH'].includes(c.code)
        ),
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-xl font-semibold ${className || ''}`}
                >
                    <span className="mr-1">{currentCurrency.flag}</span>
                    {variant === "navbar" ? currentCurrency.code : currentCurrency.symbol}
                    <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Major Currencies */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Major Currencies
                </div>
                {groupedCurrencies.major.map((curr) => (
                    <DropdownMenuItem
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={currency === curr.code ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{curr.flag}</span>
                        <span className="flex-1">{curr.name}</span>
                        <span className="text-muted-foreground">{curr.code}</span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                {/* MENA Currencies */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    MENA Region
                </div>
                {groupedCurrencies.mena.map((curr) => (
                    <DropdownMenuItem
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={currency === curr.code ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{curr.flag}</span>
                        <span className="flex-1">{curr.name}</span>
                        <span className="text-muted-foreground">{curr.code}</span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                {/* CIS Currencies */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    CIS Countries
                </div>
                {groupedCurrencies.cis.map((curr) => (
                    <DropdownMenuItem
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={currency === curr.code ? 'bg-accent' : ''}
                    >
                        <span className="mr-2">{curr.flag}</span>
                        <span className="flex-1">{curr.name}</span>
                        <span className="text-muted-foreground">{curr.code}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
