"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, DEFAULT_CURRENCY } from '@/lib/constants/currencies';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    exchangeRates: Record<string, number>;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Load saved currency from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('preferred-currency');
        if (saved) {
            setCurrencyState(saved as CurrencyCode);
        }
    }, []);

    // Fetch exchange rates from API
    useEffect(() => {
        const fetchRates = async () => {
            try {
                setIsLoading(true);
                // Using exchangerate-api.com free tier (1500 requests/month)
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
                const data = await response.json();
                setExchangeRates(data.rates);
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                // Fallback rates (approximate, as of Dec 2024)
                setExchangeRates({
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
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchRates();
        // Refresh rates every hour
        const interval = setInterval(fetchRates, 3600000);
        return () => clearInterval(interval);
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
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
}

// Utility hook for converting prices
export function useConvertPrice() {
    const { currency, exchangeRates } = useCurrency();

    return (amount: number, fromCurrency: string = 'CNY'): number => {
        if (!exchangeRates[currency] || !exchangeRates[fromCurrency]) {
            return amount;
        }

        // If converting to the same currency, return as is
        if (currency === fromCurrency) {
            return amount;
        }

        // The API returns rates FROM CNY
        // So exchangeRates[USD] = 0.14 means 1 CNY = 0.14 USD

        let converted: number;

        if (fromCurrency === 'CNY') {
            // Converting FROM CNY to another currency
            // Just multiply by the rate
            converted = amount * exchangeRates[currency];
        } else if (currency === 'CNY') {
            // Converting TO CNY from another currency
            // Divide by the rate
            converted = amount / exchangeRates[fromCurrency];
        } else {
            // Converting between two non-CNY currencies
            // First convert to CNY, then to target currency
            const inCNY = amount / exchangeRates[fromCurrency];
            converted = inCNY * exchangeRates[currency];
        }

        return Math.round(converted * 100) / 100; // Round to 2 decimal places
    };
}
