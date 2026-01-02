"use client";

import { useFormatter } from "next-intl";

interface PriceProps {
    amount: number;
    currency?: string;
    className?: string;
    showCurrency?: boolean;
}

export function Price({ amount, currency = "USD", className, showCurrency = true }: PriceProps) {
    const format = useFormatter();

    return (
        <span className={className}>
            {format.number(amount, {
                style: showCurrency ? 'currency' : 'decimal',
                currency: currency
            })}
        </span>
    );
}
