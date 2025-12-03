# Currency Converter System - Usage Guide

## Overview

The currency converter system allows users to view all prices on the website in their preferred currency. It supports 35+ currencies from MENA and CIS regions, with automatic conversion using live exchange rates.

## Features

- ✅ 35+ currencies (MENA + CIS + Major currencies)
- ✅ Live exchange rates (updated hourly)
- ✅ Persistent currency selection (localStorage)
- ✅ Automatic price conversion throughout the site
- ✅ Currency selector in navbar
- ✅ Grouped currency dropdown (Major / MENA / CIS)

## How to Use the Price Component

Replace hardcoded prices with the `<Price>` component:

### Before:
```tsx
<div>¥{program.tuition_fee} CNY</div>
```

### After:
```tsx
import { Price } from "@/components/currency/Price";

<Price amount={program.tuition_fee} currency="CNY" />
```

## Price Component Props

```tsx
interface PriceProps {
  amount: number;           // The price amount
  currency?: string;        // Source currency (default: 'CNY')
  className?: string;       // Optional CSS classes
  showCurrency?: boolean;   // Show currency code (default: true)
}
```

## Examples

### Basic Usage
```tsx
<Price amount={50000} currency="CNY" />
// Output: ¥ 50,000 CNY (or converted to user's selected currency)
```

### Without Currency Code
```tsx
<Price amount={50000} currency="CNY" showCurrency={false} />
// Output: ¥ 50,000
```

### With Custom Styling
```tsx
<Price 
  amount={50000} 
  currency="CNY" 
  className="text-2xl font-bold text-primary"
/>
```

### Different Source Currencies
```tsx
<Price amount={1000} currency="USD" />
<Price amount={5000} currency="SAR" />
<Price amount={100000} currency="EGP" />
```

## Files to Update

To add currency conversion to existing pages, update these files:

### 1. Program Cards
**File:** `src/components/programs/ProgramCard.tsx`
```tsx
import { Price } from "@/components/currency/Price";

// Replace:
<span>{tuition}</span>

// With:
<Price amount={tuition_fee} currency={currency} />
```

### 2. University Cards
**File:** `src/components/universities/UniversityCard.tsx`
```tsx
// Replace tuition fee display with:
<Price amount={minTuitionFee} currency="CNY" />
```

### 3. Featured Programs
**File:** `src/components/home/FeaturedProgramsSection.tsx`
```tsx
// Replace price displays with:
<Price amount={program.tuition_fee} currency={program.currency} />
```

### 4. Application Forms
**File:** `src/components/applications/ApplyForm.tsx`
```tsx
// Replace payment amounts with:
<Price amount={totalFee} currency="CNY" />
```

### 5. Payment Pages
**File:** `src/app/dashboard/payments/page.tsx`
```tsx
// Replace all payment amounts with Price component
```

## Supported Currencies

### Major Currencies (2)
- CNY - Chinese Yuan
- USD - US Dollar

### MENA Region (22)
- AED - UAE Dirham
- SAR - Saudi Riyal
- EGP - Egyptian Pound
- KWD - Kuwaiti Dinar
- QAR - Qatari Riyal
- OMR - Omani Rial
- BHD - Bahraini Dinar
- JOD - Jordanian Dinar
- TRY - Turkish Lira
- And 13 more...

### CIS Countries (12)
- RUB - Russian Ruble
- KZT - Kazakhstani Tenge
- UZS - Uzbekistani Som
- AZN - Azerbaijani Manat
- And 8 more...

## Exchange Rate API

The system uses [exchangerate-api.com](https://www.exchangerate-api.com/) for live rates:
- Free tier: 1500 requests/month
- Updates: Every hour
- Fallback: Hardcoded rates if API fails

## Advanced Usage

### Using the Currency Hook
```tsx
import { useCurrency } from "@/contexts/CurrencyContext";

function MyComponent() {
  const { currency, setCurrency, exchangeRates } = useCurrency();
  
  return (
    <div>
      Current currency: {currency}
      <button onClick={() => setCurrency('USD')}>
        Switch to USD
      </button>
    </div>
  );
}
```

### Using the Convert Price Hook
```tsx
import { useConvertPrice } from "@/contexts/CurrencyContext";

function MyComponent() {
  const convertPrice = useConvertPrice();
  
  const priceInCNY = 50000;
  const convertedPrice = convertPrice(priceInCNY, 'CNY');
  
  return <div>{convertedPrice}</div>;
}
```

## Testing

1. Navigate to any page with prices
2. Click the currency selector in the navbar (next to language selector)
3. Select a different currency
4. All prices should update automatically
5. Refresh the page - selected currency should persist

## Next Steps

To complete the integration:

1. ✅ Update all program cards to use `<Price>` component
2. ✅ Update university cards
3. ✅ Update featured programs section
4. ✅ Update application forms
5. ✅ Update payment pages
6. ✅ Update admin dashboard (if showing prices)
7. ✅ Test with different currencies
8. ✅ Verify exchange rates are updating

## Troubleshooting

### Prices not converting?
- Check if component is wrapped in `<CurrencyProvider>`
- Verify the Price component is imported correctly
- Check browser console for errors

### Exchange rates not loading?
- Check network tab for API calls
- Fallback rates will be used if API fails
- Rates update every hour

### Currency not persisting?
- Check localStorage in browser DevTools
- Key: `preferred-currency`
- Clear localStorage and try again
