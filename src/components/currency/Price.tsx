"use client";

import { useCurrency, useConvertPrice } from "@/contexts/CurrencyContext";
import { getCurrencyInfo } from "@/lib/constants/currencies";
import { useEffect, useState } from "react";

interface PriceProps {
    amount: number;
    currency?: string;
    className?: string;
    showCurrency?: boolean;
}

// Normalize currency codes (handle aliases)
function normalizeCurrency(currency: string): string {
    const normalized = currency.toUpperCase();
    // RMB is an alias for CNY (Chinese Yuan Renminbi)
    if (normalized === 'RMB') return 'CNY';
    return normalized;
}

export function Price({ amount, currency = 'CNY', className = '', showCurrency = true }: PriceProps) {
    const { currency: selectedCurrency, exchangeRates } = useCurrency();
    const convertPrice = useConvertPrice();
    const [convertedAmount, setConvertedAmount] = useState(amount);

    // Normalize the source currency
    const normalizedCurrency = normalizeCurrency(currency);

    useEffect(() => {
        const converted = convertPrice(amount, normalizedCurrency);
        setConvertedAmount(converted);
    }, [amount, currency, normalizedCurrency, selectedCurrency, exchangeRates, convertPrice]);

    const currencyInfo = getCurrencyInfo(selectedCurrency);

    // Format number with commas
    const formattedAmount = convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return (
        <span className={className}>
            {showCurrency && `${currencyInfo.symbol} `}
            {formattedAmount}
            {showCurrency && ` ${selectedCurrency}`}
        </span>
    );
}
