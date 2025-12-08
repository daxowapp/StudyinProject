import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrencyCode, DEFAULT_CURRENCY, getCurrencyInfo } from '../constants/currencies';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    exchangeRates: Record<string, number>;
    isLoading: boolean;
    currencyInfo: ReturnType<typeof getCurrencyInfo>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = '@currency';

// Fallback exchange rates (approximate, as of Dec 2024)
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

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved currency preference
    useEffect(() => {
        const loadCurrency = async () => {
            try {
                const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
                if (savedCurrency) {
                    setCurrencyState(savedCurrency as CurrencyCode);
                }
            } catch (error) {
                console.error('Error loading currency:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadCurrency();
    }, []);

    // Fetch exchange rates from API
    useEffect(() => {
        const fetchRates = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
                const data = await response.json();
                setExchangeRates(data.rates);
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                setExchangeRates(FALLBACK_RATES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRates();
        // Refresh rates every hour
        const interval = setInterval(fetchRates, 3600000);
        return () => clearInterval(interval);
    }, []);

    // Set currency and save to storage
    const setCurrency = async (newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency);
        try {
            await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
        } catch (error) {
            console.error('Error saving currency:', error);
        }
    };

    const currencyInfo = getCurrencyInfo(currency);

    // Don't render until currency is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, isLoading, currencyInfo }}>
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

// Utility hook for converting prices
export function useConvertPrice() {
    const { currency, exchangeRates } = useCurrency();

    return (amount: number, fromCurrency: string = 'CNY'): number => {
        if (!exchangeRates[currency] || !exchangeRates[fromCurrency]) {
            return amount;
        }

        if (currency === fromCurrency) {
            return amount;
        }

        let converted: number;

        if (fromCurrency === 'CNY') {
            converted = amount * exchangeRates[currency];
        } else if (currency === 'CNY') {
            converted = amount / exchangeRates[fromCurrency];
        } else {
            const inCNY = amount / exchangeRates[fromCurrency];
            converted = inCNY * exchangeRates[currency];
        }

        return Math.round(converted * 100) / 100;
    };
}
