import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useCurrency, useConvertPrice } from '../../contexts/CurrencyContext';
import { getCurrencyInfo } from '../../constants/currencies';

interface PriceProps {
    amount: number;
    currency?: string;  // Source currency (default: CNY)
    style?: StyleProp<TextStyle>;
    showCurrency?: boolean;
    suffix?: string;
}

// Normalize currency codes (handle aliases like RMB -> CNY)
function normalizeCurrency(currency: string): string {
    const normalized = currency.toUpperCase();
    if (normalized === 'RMB') return 'CNY';
    return normalized;
}

export function Price({ amount, currency = 'CNY', style, showCurrency = true, suffix = '' }: PriceProps) {
    const { currency: selectedCurrency } = useCurrency();
    const convertPrice = useConvertPrice();

    // Normalize the source currency
    const normalizedCurrency = normalizeCurrency(currency);

    // Convert the price
    const convertedAmount = convertPrice(amount, normalizedCurrency);

    // Get currency info for display
    const currencyInfo = getCurrencyInfo(selectedCurrency);

    // Format the number
    const formattedAmount = convertedAmount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <Text style={style}>
            {showCurrency ? `${currencyInfo.symbol}${formattedAmount}` : formattedAmount}
            {suffix}
        </Text>
    );
}
