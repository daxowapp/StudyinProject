// Currency constants for mobile app (ported from website)

export const CURRENCIES = [
    // Major currencies
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },

    // MENA Countries
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound', flag: '🇪🇬' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
    { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: '🇶🇦' },
    { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial', flag: '🇴🇲' },
    { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
    { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', flag: '🇯🇴' },
    { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound', flag: '🇱🇧' },
    { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar', flag: '🇮🇶' },
    { code: 'SYP', symbol: 'ل.س', name: 'Syrian Pound', flag: '🇸🇾' },
    { code: 'YER', symbol: 'ر.ي', name: 'Yemeni Rial', flag: '🇾🇪' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'MAD', symbol: 'د.م', name: 'Moroccan Dirham', flag: '🇲🇦' },
    { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', flag: '🇹🇳' },
    { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar', flag: '🇩🇿' },
    { code: 'LYD', symbol: 'ل.د', name: 'Libyan Dinar', flag: '🇱🇾' },
    { code: 'SDG', symbol: 'ج.س', name: 'Sudanese Pound', flag: '🇸🇩' },
    { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya', flag: '🇲🇷' },
    { code: 'SOS', symbol: 'Sh', name: 'Somali Shilling', flag: '🇸🇴' },
    { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc', flag: '🇩🇯' },
    { code: 'KMF', symbol: 'CF', name: 'Comorian Franc', flag: '🇰🇲' },

    // CIS Countries
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', flag: '🇰🇿' },
    { code: 'UZS', symbol: 'soʻm', name: 'Uzbekistani Som', flag: '🇺🇿' },
    { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat', flag: '🇦🇿' },
    { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble', flag: '🇧🇾' },
    { code: 'AMD', symbol: '֏', name: 'Armenian Dram', flag: '🇦🇲' },
    { code: 'GEL', symbol: '₾', name: 'Georgian Lari', flag: '🇬🇪' },
    { code: 'KGS', symbol: 'с', name: 'Kyrgyzstani Som', flag: '🇰🇬' },
    { code: 'TJS', symbol: 'ЅМ', name: 'Tajikistani Somoni', flag: '🇹🇯' },
    { code: 'TMT', symbol: 'm', name: 'Turkmenistani Manat', flag: '🇹🇲' },
    { code: 'MDL', symbol: 'L', name: 'Moldovan Leu', flag: '🇲🇩' },
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];

export const DEFAULT_CURRENCY: CurrencyCode = 'CNY';

// Get currency info by code
export function getCurrencyInfo(code: CurrencyCode) {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

// Grouped currencies for UI display
export const CURRENCY_GROUPS = {
    major: CURRENCIES.filter(c => ['CNY', 'USD'].includes(c.code)),
    mena: CURRENCIES.filter(c =>
        ['AED', 'SAR', 'EGP', 'KWD', 'QAR', 'OMR', 'BHD', 'JOD', 'LBP', 'IQD', 'SYP', 'YER', 'TRY', 'MAD', 'TND', 'DZD', 'LYD', 'SDG', 'MRU', 'SOS', 'DJF', 'KMF'].includes(c.code)
    ),
    cis: CURRENCIES.filter(c =>
        ['RUB', 'KZT', 'UZS', 'AZN', 'BYN', 'AMD', 'GEL', 'KGS', 'TJS', 'TMT', 'MDL', 'UAH'].includes(c.code)
    ),
};
