import { CURRENCIES } from '@/types';

/**
 * Format amount with the user's selected currency
 * @param amount - The numeric amount to format
 * @param currencyCode - Currency code (USD, EUR, INR, etc.)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'USD',
  decimals: number = 2
): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  
  if (!currency) {
    // Fallback to USD if currency not found
    return `$${amount.toFixed(decimals)}`;
  }

  // For currencies that don't typically use decimals (like JPY, KRW)
  const shouldShowDecimals = !['JPY', 'KRW', 'VND', 'CLP'].includes(currencyCode);
  const finalDecimals = shouldShowDecimals ? decimals : 0;

  // Format the number with proper separators
  const formattedAmount = amount.toFixed(finalDecimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Return formatted string with currency symbol
  return `${currency.symbol}${formattedAmount}`;
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(currencyCode: string = 'USD'): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
}

/**
 * Get currency name by code
 */
export function getCurrencyName(currencyCode: string = 'USD'): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.name || 'US Dollar';
}

/**
 * Format amount for display (shorter format for large numbers)
 * @param amount - The numeric amount
 * @param currencyCode - Currency code
 * @returns Formatted string like "$1.2K" or "$45"
 */
export function formatCurrencyShort(
  amount: number,
  currencyCode: string = 'USD'
): string {
  const symbol = getCurrencySymbol(currencyCode);
  
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  } else {
    return `${symbol}${amount.toFixed(0)}`;
  }
}

