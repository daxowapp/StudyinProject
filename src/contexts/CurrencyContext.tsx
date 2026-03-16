"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrencyCode, DEFAULT_CURRENCY } from '@/lib/constants/currencies';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    exchangeRates: Record<string, number>;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fallback rates (approximate, as of Dec 2024)
const FALLBACK_RATES: Record<string, number> = {
    CNY: 1,
    USD: 0.14,
    AED: 0.51,
    SAR: 0.52,
    EGP: 6.85,
    KWD: 0.043,
    QAR: 0.51,
    OMR: 0.054,
    BHD: 0.053,
    JOD: 0.099,
    LBP: 12500,
    IQD: 183,
    SYP: 350,
    YER: 35,
    TRY: 4.82,
    MAD: 1.39,
    TND: 0.44,
    DZD: 18.8,
    LYD: 0.68,
    SDG: 84,
    MRU: 5.5,
    SOS: 80,
    DJF: 24.8,
    KMF: 64.5,
    RUB: 13.5,
    KZT: 66,
    UZS: 1780,
    AZN: 0.24,
    BYN: 0.46,
    AMD: 54,
    GEL: 0.38,
    KGS: 12.4,
    TJS: 1.49,
    TMT: 0.49,
    MDL: 2.53,
    UAH: 5.75,
};

async function fetchExchangeRates(): Promise<Record<string, number>> {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
    const data = await response.json();
    return data.rates;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

    const { data: exchangeRates = FALLBACK_RATES, isLoading } = useQuery({
        queryKey: ['exchange-rates'],
        queryFn: fetchExchangeRates,
        staleTime: 60 * 60 * 1000,      // 1 hour — rates don't change often
        gcTime: 24 * 60 * 60 * 1000,    // 24 hours cache
        initialData: FALLBACK_RATES,     // instant display, no loading flash
        refetchOnMount: false,           // don't refetch when components remount
    });

    // Load saved currency from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('preferred-currency');
        if (saved) {
            setCurrencyState(saved as CurrencyCode);
        }
    }, []);

    const setCurrency = (newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('preferred-currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

export function useConvertPrice(priceInCNY: number): { convertedPrice: number; currency: CurrencyCode; isLoading: boolean } {
    const { currency, exchangeRates, isLoading } = useCurrency();

    const rate = exchangeRates[currency] || 1;
    const convertedPrice = Math.round(priceInCNY * rate);

    return { convertedPrice, currency, isLoading };
}
